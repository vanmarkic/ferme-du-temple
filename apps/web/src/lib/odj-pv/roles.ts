/**
 * Role suggestion algorithm for ODJ-PV
 *
 * Suggests optimal role assignments by maximizing the gap between same role occurrences.
 * President and co-president count as the same role for gap calculation.
 */

import type { Member, MemberRole, RoleType, RoleSuggestion } from '../../types/odj-pv';

/**
 * Calculates the gap (number of meetings) since a member last had a specific role.
 * Returns Infinity if the member never had this role.
 *
 * Note: president and co-president are treated as the same role for gap calculation.
 *
 * @param memberId - The member to check
 * @param role - The role to check for
 * @param history - Role history, ordered by meeting date (newest first)
 * @returns Number of meetings since last occurrence, or Infinity if never
 */
export function calculateGap(
  memberId: string,
  role: RoleType,
  history: MemberRole[]
): number {
  // For president role, also check for co-president (and vice versa)
  const rolesToCheck: RoleType[] = role === 'president'
    ? ['president']
    : [role];

  let gap = 0;

  for (const record of history) {
    if (record.member_id === memberId && rolesToCheck.includes(record.role)) {
      return gap;
    }
    gap++;
  }

  // Never had this role
  return Infinity;
}

/**
 * Suggests optimal role assignments for a meeting.
 *
 * Algorithm:
 * 1. For each role, calculate gap for all members
 * 2. Assign role to member with largest gap
 * 3. Remove assigned member from pool
 * 4. Repeat for remaining roles
 *
 * Warnings are flagged when gap is 0 or 1 (recent assignment).
 *
 * @param members - List of active members
 * @param roleHistory - Role history ordered by meeting date (newest first)
 * @returns Suggested role assignments
 */
export function suggestRoles(
  members: Member[],
  roleHistory: MemberRole[]
): RoleSuggestion[] {
  const suggestions: RoleSuggestion[] = [];
  const availableMembers = new Set(members.map(m => m.id));

  // Define roles in priority order
  const roles: RoleType[] = ['president', 'secretaire', 'parole', 'temps', 'serpent', 'plage'];

  for (const role of roles) {
    if (availableMembers.size === 0) {
      // No more members available - this shouldn't happen unless there are more roles than members
      break;
    }

    // Calculate gap for each available member for this role
    const memberGaps = Array.from(availableMembers).map(memberId => ({
      memberId,
      gap: calculateGap(memberId, role, roleHistory),
    }));

    // Sort by gap descending (largest gap first)
    memberGaps.sort((a, b) => {
      if (a.gap === Infinity && b.gap === Infinity) return 0;
      if (a.gap === Infinity) return -1;
      if (b.gap === Infinity) return 1;
      return b.gap - a.gap;
    });

    // Assign role to member with largest gap
    const bestMatch = memberGaps[0];
    suggestions.push({
      role,
      member_id: bestMatch.memberId,
      gap: bestMatch.gap,
      warning: bestMatch.gap <= 1 && bestMatch.gap !== Infinity,
    });

    // Remove assigned member from available pool
    availableMembers.delete(bestMatch.memberId);
  }

  return suggestions;
}

/**
 * Gets the member name for a suggestion (helper for UI)
 */
export function getMemberName(memberId: string, members: Member[]): string {
  const member = members.find(m => m.id === memberId);
  return member?.name || 'Unknown';
}

/**
 * Formats gap for display
 */
export function formatGap(gap: number): string {
  if (gap === Infinity) return 'Jamais';
  if (gap === 0) return "Dernier meeting";
  if (gap === 1) return "Il y a 1 meeting";
  return `Il y a ${gap} meetings`;
}
