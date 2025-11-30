/**
 * Data migration utilities for Participant
 *
 * Handles backward compatibility when Participant schema changes.
 *
 * v2 → v3 Migration (Two-Loan Redesign):
 * - capitalForLoan1 → merged into capitalApporte
 * - loan2IncludesParachevements → removed (implicit in phase-based split)
 * - capitalApporte: now represents capital at signature
 * - capitalForLoan2: additional capital available later
 *
 * See docs/2025-11-30-two-loan-redesign.md for design rationale.
 */

import type { Participant } from './calculatorUtils';

/**
 * Old format for Participant (v2 - before two-loan redesign)
 */
interface ParticipantV2 extends Omit<Participant, 'capitalForLoan1' | 'loan2IncludesParachevements'> {
  capitalForLoan1?: number;  // How much of capitalApporte goes to loan 1
  loan2IncludesParachevements?: boolean;  // Whether to include parachevements in loan 2
}

/**
 * Type guard: Check if a Participant has the v2 format (has capitalForLoan1)
 */
function isV2Format(participant: Participant | ParticipantV2): participant is ParticipantV2 {
  return 'capitalForLoan1' in participant && participant.capitalForLoan1 !== undefined;
}

/**
 * Migrate a single Participant from v2 to v3 format
 *
 * Strategy:
 * - If useTwoLoans is enabled and capitalForLoan1 is set, use it as the new capitalApporte
 * - If useTwoLoans is disabled, keep capitalApporte as-is
 * - Remove deprecated fields: capitalForLoan1, loan2IncludesParachevements
 *
 * v2 format: { capitalApporte, capitalForLoan1, capitalForLoan2 }
 * v3 format: { capitalApporte (signature capital), capitalForLoan2 (construction capital) }
 */
export function migrateParticipantV2ToV3(participant: Participant | ParticipantV2): Participant {
  // Already in v3 format (no capitalForLoan1)
  if (!isV2Format(participant)) {
    // Still remove loan2IncludesParachevements if present
    const { loan2IncludesParachevements: _, ...rest } = participant as Participant & { loan2IncludesParachevements?: boolean };
    return rest;
  }

  const { capitalForLoan1, loan2IncludesParachevements: _, ...rest } = participant;

  // If two-loan mode is enabled and capitalForLoan1 was set,
  // use capitalForLoan1 as the new capitalApporte (signature capital)
  if (participant.useTwoLoans && capitalForLoan1 !== undefined) {
    return {
      ...rest,
      capitalApporte: capitalForLoan1,  // Signature capital
      // capitalForLoan2 stays as-is
      // loan2RenovationAmount stays as-is (now optional override)
    };
  }

  // Single-loan mode or no capitalForLoan1 set: keep capitalApporte unchanged
  return rest;
}

/**
 * Migrate an array of Participants from v2 to v3 format
 */
export function migrateParticipants(participants: (Participant | ParticipantV2)[]): Participant[] {
  return participants.map(migrateParticipantV2ToV3);
}

/**
 * Check if any participant in the array needs v2→v3 migration
 */
export function needsV2Migration(participants: (Participant | ParticipantV2)[]): boolean {
  return participants.some(p => 'capitalForLoan1' in p || 'loan2IncludesParachevements' in p);
}
