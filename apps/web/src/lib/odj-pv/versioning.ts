/**
 * Auto-save and version management for ODJ-PV
 *
 * Implements versioning with milestone-based version retention:
 * - T-5, T-10, T-20, T-30 minutes, then every 10 minutes
 * - Intermediate versions are cleaned up after finalization
 */

import type { MeetingSnapshot, MeetingVersion } from '../../types/odj-pv';
import {
  getMeeting,
  getAgendaItems,
  getMemberRoles,
  getDecisions,
  getMissions,
  createVersion as createVersionDb,
  getVersions,
} from './supabase';
import { supabase } from '../auth';

/**
 * Creates a full snapshot of the current meeting state
 *
 * @param meetingId - The meeting to snapshot
 * @returns The snapshot data
 */
export async function createSnapshot(meetingId: string): Promise<MeetingSnapshot> {
  const [meeting, agendaItems, roles, decisions, missions] = await Promise.all([
    getMeeting(meetingId),
    getAgendaItems(meetingId),
    getMemberRoles(meetingId),
    getDecisions(meetingId),
    getMissions(meetingId),
  ]);

  return {
    meeting,
    agendaItems,
    roles,
    decisions,
    missions,
  };
}

/**
 * Milestone intervals in minutes
 * T-5, T-10, T-20, T-30, then every 10 minutes (T-40, T-50, T-60, etc.)
 */
const MILESTONE_INTERVALS = [5, 10, 20, 30];
const REGULAR_INTERVAL = 10; // After milestones, save every 10 minutes

/**
 * Determines if a new milestone version should be created based on time elapsed
 *
 * @param lastVersionTime - Timestamp of the last version (ISO string)
 * @returns true if a new version should be created
 */
export function shouldCreateVersion(lastVersionTime: string): boolean {
  const now = new Date();
  const lastVersion = new Date(lastVersionTime);
  const minutesElapsed = Math.floor((now.getTime() - lastVersion.getTime()) / 1000 / 60);

  // Check milestone intervals first
  for (const interval of MILESTONE_INTERVALS) {
    if (minutesElapsed >= interval && minutesElapsed < interval + 1) {
      return true;
    }
  }

  // After T-30, check for regular 10-minute intervals
  const lastMilestone = Math.max(...MILESTONE_INTERVALS);
  if (minutesElapsed > lastMilestone) {
    const intervalsSinceLastMilestone = Math.floor((minutesElapsed - lastMilestone) / REGULAR_INTERVAL);
    const nextInterval = lastMilestone + (intervalsSinceLastMilestone * REGULAR_INTERVAL);
    return minutesElapsed >= nextInterval && minutesElapsed < nextInterval + 1;
  }

  return false;
}

/**
 * Alternative version that checks if enough time has passed for ANY version
 * (more lenient - creates version if we've passed any milestone)
 *
 * @param lastVersionTime - Timestamp of the last version (ISO string)
 * @returns true if a new version should be created
 */
export function shouldCreateVersionLenient(lastVersionTime: string): boolean {
  const now = new Date();
  const lastVersion = new Date(lastVersionTime);
  const minutesElapsed = Math.floor((now.getTime() - lastVersion.getTime()) / 1000 / 60);

  // Check if we've passed any milestone
  for (const interval of MILESTONE_INTERVALS) {
    if (minutesElapsed >= interval) {
      return true;
    }
  }

  // After T-30, check if we've passed any 10-minute interval
  const lastMilestone = Math.max(...MILESTONE_INTERVALS);
  if (minutesElapsed >= lastMilestone + REGULAR_INTERVAL) {
    return true;
  }

  return false;
}

/**
 * Gets all milestone timestamps that should have versions
 * (helper for determining which versions to keep)
 *
 * @param startTime - When the meeting started (ISO string)
 * @param endTime - When the meeting was finalized (ISO string)
 * @returns Array of milestone timestamps
 */
export function getMilestoneTimestamps(startTime: string, endTime: string): Date[] {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const milestones: Date[] = [start];

  let currentTime = new Date(start);

  // Add milestone intervals
  for (const interval of MILESTONE_INTERVALS) {
    currentTime = new Date(start.getTime() + interval * 60 * 1000);
    if (currentTime <= end) {
      milestones.push(currentTime);
    }
  }

  // Add regular intervals after last milestone
  const lastMilestone = Math.max(...MILESTONE_INTERVALS);
  let regularInterval = lastMilestone + REGULAR_INTERVAL;

  while (true) {
    currentTime = new Date(start.getTime() + regularInterval * 60 * 1000);
    if (currentTime > end) break;
    milestones.push(currentTime);
    regularInterval += REGULAR_INTERVAL;
  }

  // Always include the end time
  milestones.push(end);

  return milestones;
}

/**
 * Finds the closest version to a milestone timestamp
 *
 * @param milestone - The milestone timestamp to match
 * @param versions - Available versions
 * @param toleranceMinutes - How many minutes away a version can be (default: 2)
 * @returns The closest version, or null if none within tolerance
 */
function findClosestVersion(
  milestone: Date,
  versions: MeetingVersion[],
  toleranceMinutes: number = 2
): MeetingVersion | null {
  let closest: MeetingVersion | null = null;
  let closestDiff = Infinity;

  for (const version of versions) {
    const versionTime = new Date(version.created_at);
    const diffMinutes = Math.abs((versionTime.getTime() - milestone.getTime()) / 1000 / 60);

    if (diffMinutes <= toleranceMinutes && diffMinutes < closestDiff) {
      closest = version;
      closestDiff = diffMinutes;
    }
  }

  return closest;
}

/**
 * Cleans up intermediate versions after meeting finalization.
 * Keeps only milestone versions (T-5, T-10, T-20, T-30, then every 10min).
 *
 * @param meetingId - The meeting to clean up
 * @returns Number of versions deleted
 */
export async function cleanupVersions(meetingId: string): Promise<number> {
  if (!supabase) throw new Error('Supabase not initialized');

  // Get meeting to find start/end times
  const meeting = await getMeeting(meetingId);
  if (meeting.status !== 'finalized') {
    throw new Error('Can only cleanup versions for finalized meetings');
  }

  // Get all versions
  const versions = await getVersions(meetingId);

  if (versions.length === 0) {
    return 0;
  }

  // Use first version as start time and last as end time
  const startTime = versions[versions.length - 1].created_at; // Oldest version
  const endTime = versions[0].created_at; // Newest version

  // Get milestone timestamps
  const milestones = getMilestoneTimestamps(startTime, endTime);

  // Find versions to keep (closest to each milestone)
  const versionsToKeep = new Set<string>();

  for (const milestone of milestones) {
    const closest = findClosestVersion(milestone, versions);
    if (closest) {
      versionsToKeep.add(closest.id);
    }
  }

  // Delete versions not in the keep set
  const versionsToDelete = versions.filter(v => !versionsToKeep.has(v.id));

  if (versionsToDelete.length === 0) {
    return 0;
  }

  // Delete in batches
  const deletePromises = versionsToDelete.map(v =>
    supabase
      .from('meeting_versions')
      .delete()
      .eq('id', v.id)
  );

  const results = await Promise.all(deletePromises);
  const errors = results.filter(r => r.error);

  if (errors.length > 0) {
    throw errors[0].error;
  }

  return versionsToDelete.length;
}

/**
 * Creates a new version if needed based on time elapsed
 *
 * @param meetingId - The meeting to version
 * @returns The created version, or null if not needed
 */
export async function autoSaveVersion(meetingId: string): Promise<MeetingVersion | null> {
  const versions = await getVersions(meetingId);

  // Always create first version
  if (versions.length === 0) {
    const snapshot = await createSnapshot(meetingId);
    return await createVersionDb({
      meeting_id: meetingId,
      snapshot_json: snapshot,
    });
  }

  // Check if enough time has passed
  const lastVersion = versions[0]; // Most recent
  if (shouldCreateVersionLenient(lastVersion.created_at)) {
    const snapshot = await createSnapshot(meetingId);
    return await createVersionDb({
      meeting_id: meetingId,
      snapshot_json: snapshot,
    });
  }

  return null;
}
