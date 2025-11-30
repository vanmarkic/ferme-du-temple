/**
 * Tests for Supabase Data Service
 *
 * These tests verify the granular participant and project update logic
 * without requiring actual Supabase connections.
 */

import { describe, it, expect } from 'vitest';
import type { Participant, ProjectParams, PortageFormulaParams } from '@repo/credit-calculator/utils';

// Import the pure functions we'll create to detect changes
import { detectParticipantChanges, detectProjectChanges } from './supabaseData';

describe('detectParticipantChanges', () => {
  const baseParticipant: Participant = {
    name: 'Test Participant',
    capitalApporte: 100000,
    registrationFeesRate: 12.5,
    unitId: 1,
    surface: 100,
    interestRate: 4.5,
    durationYears: 25,
    quantity: 1,
    parachevementsPerM2: 500,
    isFounder: true,
    entryDate: new Date('2023-02-01'),
  };

  it('should detect no changes when participants are identical', () => {
    const original = [baseParticipant];
    const current = [{ ...baseParticipant }];

    const changes = detectParticipantChanges(original, current);

    expect(changes.added).toHaveLength(0);
    expect(changes.removed).toHaveLength(0);
    expect(changes.updated).toHaveLength(0);
  });

  it('should detect when a single field is changed on one participant', () => {
    const original = [
      { ...baseParticipant, unitId: 1 },
      { ...baseParticipant, name: 'Participant 2', unitId: 2 },
    ];
    const current = [
      { ...baseParticipant, unitId: 1, capitalApporte: 150000 }, // Only this changed
      { ...baseParticipant, name: 'Participant 2', unitId: 2 },
    ];

    const changes = detectParticipantChanges(original, current);

    expect(changes.added).toHaveLength(0);
    expect(changes.removed).toHaveLength(0);
    expect(changes.updated).toHaveLength(1);
    expect(changes.updated[0].index).toBe(0);
    expect(changes.updated[0].participant.capitalApporte).toBe(150000);
  });

  it('should not mark unchanged participants as updated', () => {
    const original = [
      { ...baseParticipant, unitId: 1 },
      { ...baseParticipant, name: 'Participant 2', unitId: 2 },
      { ...baseParticipant, name: 'Participant 3', unitId: 3 },
    ];
    const current = [
      { ...baseParticipant, unitId: 1, capitalApporte: 150000 },
      { ...baseParticipant, name: 'Participant 2', unitId: 2 }, // Unchanged
      { ...baseParticipant, name: 'Participant 3', unitId: 3 }, // Unchanged
    ];

    const changes = detectParticipantChanges(original, current);

    expect(changes.updated).toHaveLength(1);
    expect(changes.updated[0].index).toBe(0);
  });

  it('should detect added participants', () => {
    const original = [{ ...baseParticipant, unitId: 1 }];
    const current = [
      { ...baseParticipant, unitId: 1 },
      { ...baseParticipant, name: 'New Participant', unitId: 2 },
    ];

    const changes = detectParticipantChanges(original, current);

    expect(changes.added).toHaveLength(1);
    expect(changes.added[0].index).toBe(1);
    expect(changes.added[0].participant.name).toBe('New Participant');
    expect(changes.removed).toHaveLength(0);
    expect(changes.updated).toHaveLength(0);
  });

  it('should detect removed participants', () => {
    const original = [
      { ...baseParticipant, unitId: 1 },
      { ...baseParticipant, name: 'To Remove', unitId: 2 },
    ];
    const current = [{ ...baseParticipant, unitId: 1 }];

    const changes = detectParticipantChanges(original, current);

    expect(changes.added).toHaveLength(0);
    expect(changes.removed).toHaveLength(1);
    expect(changes.removed[0].unitId).toBe(2);
    expect(changes.updated).toHaveLength(0);
  });

  it('should handle complex scenario: add, remove, and update simultaneously', () => {
    const original = [
      { ...baseParticipant, unitId: 1 },
      { ...baseParticipant, name: 'To Remove', unitId: 2 },
      { ...baseParticipant, name: 'To Update', unitId: 3 },
    ];
    const current = [
      { ...baseParticipant, unitId: 1 }, // Unchanged
      { ...baseParticipant, name: 'To Update', unitId: 3, capitalApporte: 200000 }, // Updated
      { ...baseParticipant, name: 'New One', unitId: 4 }, // Added
    ];

    const changes = detectParticipantChanges(original, current);

    expect(changes.added).toHaveLength(1);
    expect(changes.added[0].participant.unitId).toBe(4);

    expect(changes.removed).toHaveLength(1);
    expect(changes.removed[0].unitId).toBe(2);

    expect(changes.updated).toHaveLength(1);
    expect(changes.updated[0].participant.unitId).toBe(3);
    expect(changes.updated[0].participant.capitalApporte).toBe(200000);
  });

  it('should detect changes in nested lotsOwned', () => {
    const withLots: Participant = {
      ...baseParticipant,
      lotsOwned: [
        {
          lotId: 1,
          surface: 100,
          unitId: 1,
          isPortage: false,
          acquiredDate: new Date('2023-02-01'),
        },
      ],
    };

    const original = [withLots];
    const current = [
      {
        ...withLots,
        lotsOwned: [
          {
            lotId: 1,
            surface: 150, // Changed surface
            unitId: 1,
            isPortage: false,
            acquiredDate: new Date('2023-02-01'),
          },
        ],
      },
    ];

    const changes = detectParticipantChanges(original, current);

    expect(changes.updated).toHaveLength(1);
  });

  it('should detect changes in useTwoLoans field', () => {
    const original = [{ ...baseParticipant, useTwoLoans: false }];
    const current = [{ ...baseParticipant, useTwoLoans: true }];

    const changes = detectParticipantChanges(original, current);

    expect(changes.updated).toHaveLength(1);
  });
});

describe('detectProjectChanges', () => {
  const baseProjectParams: ProjectParams = {
    totalPurchase: 500000,
    mesuresConservatoires: 10000,
    demolition: 5000,
    infrastructures: 20000,
    etudesPreparatoires: 3000,
    fraisEtudesPreparatoires: 2000,
    fraisGeneraux3ans: 15000,
    batimentFondationConservatoire: 50000,
    batimentFondationComplete: 100000,
    batimentCoproConservatoire: 80000,
    globalCascoPerM2: 800,
  };

  const basePortageFormula: PortageFormulaParams = {
    indexationRate: 2.0,
    carryingCostRecovery: 100,
    averageInterestRate: 4.5,
    coproReservesShare: 30,
  };

  it('should detect no changes when project data is identical', () => {
    const original = {
      deedDate: '2023-02-01',
      projectParams: { ...baseProjectParams },
      portageFormula: { ...basePortageFormula },
    };
    const current = {
      deedDate: '2023-02-01',
      projectParams: { ...baseProjectParams },
      portageFormula: { ...basePortageFormula },
    };

    const changes = detectProjectChanges(original, current);

    expect(changes.deedDateChanged).toBe(false);
    expect(changes.projectParamsChanged).toBe(false);
    expect(changes.portageFormulaChanged).toBe(false);
    expect(changes.hasChanges).toBe(false);
  });

  it('should detect when only deedDate changes', () => {
    const original = {
      deedDate: '2023-02-01',
      projectParams: { ...baseProjectParams },
      portageFormula: { ...basePortageFormula },
    };
    const current = {
      deedDate: '2024-03-15',
      projectParams: { ...baseProjectParams },
      portageFormula: { ...basePortageFormula },
    };

    const changes = detectProjectChanges(original, current);

    expect(changes.deedDateChanged).toBe(true);
    expect(changes.projectParamsChanged).toBe(false);
    expect(changes.portageFormulaChanged).toBe(false);
    expect(changes.hasChanges).toBe(true);
  });

  it('should detect when only projectParams changes', () => {
    const original = {
      deedDate: '2023-02-01',
      projectParams: { ...baseProjectParams },
      portageFormula: { ...basePortageFormula },
    };
    const current = {
      deedDate: '2023-02-01',
      projectParams: { ...baseProjectParams, totalPurchase: 600000 },
      portageFormula: { ...basePortageFormula },
    };

    const changes = detectProjectChanges(original, current);

    expect(changes.deedDateChanged).toBe(false);
    expect(changes.projectParamsChanged).toBe(true);
    expect(changes.portageFormulaChanged).toBe(false);
    expect(changes.hasChanges).toBe(true);
  });

  it('should detect when only portageFormula changes', () => {
    const original = {
      deedDate: '2023-02-01',
      projectParams: { ...baseProjectParams },
      portageFormula: { ...basePortageFormula },
    };
    const current = {
      deedDate: '2023-02-01',
      projectParams: { ...baseProjectParams },
      portageFormula: { ...basePortageFormula, indexationRate: 3.0 },
    };

    const changes = detectProjectChanges(original, current);

    expect(changes.deedDateChanged).toBe(false);
    expect(changes.projectParamsChanged).toBe(false);
    expect(changes.portageFormulaChanged).toBe(true);
    expect(changes.hasChanges).toBe(true);
  });

  it('should detect multiple changes at once', () => {
    const original = {
      deedDate: '2023-02-01',
      projectParams: { ...baseProjectParams },
      portageFormula: { ...basePortageFormula },
    };
    const current = {
      deedDate: '2024-03-15',
      projectParams: { ...baseProjectParams, globalCascoPerM2: 900 },
      portageFormula: { ...basePortageFormula, averageInterestRate: 5.0 },
    };

    const changes = detectProjectChanges(original, current);

    expect(changes.deedDateChanged).toBe(true);
    expect(changes.projectParamsChanged).toBe(true);
    expect(changes.portageFormulaChanged).toBe(true);
    expect(changes.hasChanges).toBe(true);
  });
});
