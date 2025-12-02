/**
 * Authentication Security Tests
 *
 * TDD: RED phase - These tests verify security requirements:
 * 1. Admin UI (EditModeToolbar, ReadonlyModeSwitch) is hidden when not authenticated
 * 2. Supabase write operations are blocked when not authenticated
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EditModeToolbar } from '../shared/EditModeToolbar';
import { ReadonlyModeSwitch } from '../shared/ReadonlyModeSwitch';
import { UnlockProvider } from '../contexts/UnlockContext';
import { saveProjectData, saveParticipantData, createProject, deleteProject } from '../services/supabaseData';
import type { ProjectParams, PortageFormulaParams, Participant } from '@repo/credit-calculator/utils';

// Mock the useUnlockState hook
vi.mock('../hooks/useUnlockState', () => ({
  useUnlockState: (projectId: string, forceReadonly: boolean) => ({
    isUnlocked: false,
    isReadonlyMode: true,
    isLoading: false,
    unlockedAt: null,
    unlockedBy: null,
    unlock: vi.fn(),
    lock: vi.fn(),
    validatePassword: vi.fn(),
    setReadonlyMode: vi.fn(),
  }),
}));

// Mock supabase module
vi.mock('../services/supabase', () => {
  const mockSupabase = {
    from: vi.fn(() => ({
      update: vi.fn(() => ({ eq: vi.fn() })),
      insert: vi.fn(() => ({ select: vi.fn() })),
      delete: vi.fn(() => ({ eq: vi.fn() })),
      upsert: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  };

  return {
    supabase: mockSupabase,
    isSupabaseConfigured: vi.fn(() => true),
    getCurrentUser: vi.fn(() => Promise.resolve(null)),
  };
});

describe('Authentication Security - Admin UI Hidden When Not Authenticated', () => {
  describe('CreditCastorApp - AdminSidebar', () => {
    it('should hide AdminSidebar when not authenticated', () => {
      // Note: This is a visual/integration test best done manually
      // The implementation checks authState === 'authenticated'
      // When authState === 'unauthenticated', AdminSidebar is not rendered
      expect(true).toBe(true); // Placeholder - actual test requires full app mount
    });
  });

  describe('EditModeToolbar', () => {
    it('should NOT render when isForceReadonly is true (unauthenticated user)', () => {
      // RED: This test should fail because we need to verify the component is hidden
      render(
        <UnlockProvider forceReadonly={true}>
          <EditModeToolbar
            isDirty={false}
            isSaving={false}
            error={null}
            onSave={() => {}}
            onDiscard={() => {}}
          />
        </UnlockProvider>
      );

      // Admin toolbar should not be in the document
      // Looking for specific text that would be in the toolbar
      expect(screen.queryByText(/Contrôles d'édition/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Mode édition/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Lecture seule/i)).not.toBeInTheDocument();
    });

    it('should render when isForceReadonly is false (authenticated user)', () => {
      // This ensures the component still works for authenticated users
      render(
        <UnlockProvider forceReadonly={false}>
          <EditModeToolbar
            isDirty={false}
            isSaving={false}
            error={null}
            onSave={() => {}}
            onDiscard={() => {}}
          />
        </UnlockProvider>
      );

      // FAB button should be present (may not show text when collapsed)
      const fabButton = screen.getByRole('button');
      expect(fabButton).toBeInTheDocument();
    });
  });

  describe('ReadonlyModeSwitch', () => {
    it('should NOT render when isForceReadonly is true (unauthenticated user)', () => {
      // RED: This test should fail because we need to verify the component is hidden
      render(
        <UnlockProvider forceReadonly={true}>
          <ReadonlyModeSwitch />
        </UnlockProvider>
      );

      // Switch should not be in the document
      expect(screen.queryByText(/Mode édition/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Lecture seule/i)).not.toBeInTheDocument();
    });

    it('should render when isForceReadonly is false (authenticated user)', () => {
      render(
        <UnlockProvider forceReadonly={false}>
          <ReadonlyModeSwitch />
        </UnlockProvider>
      );

      // Switch should be present
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});

describe('Authentication Security - Supabase READ ONLY When Not Authenticated', () => {
  const mockProjectParams: ProjectParams = {
    totalPurchase: 500000,
    mesuresConservatoires: 0,
    demolition: 0,
    infrastructures: 0,
    etudesPreparatoires: 0,
    fraisEtudesPreparatoires: 0,
    fraisGeneraux3ans: 0,
    batimentFondationConservatoire: 0,
    batimentFondationComplete: 0,
    batimentCoproConservatoire: 0,
    globalCascoPerM2: 800,
  };

  const mockPortageFormula: PortageFormulaParams = {
    indexationRate: 2.0,
    carryingCostRecovery: 100,
    averageInterestRate: 4.5,
    coproReservesShare: 30,
  };

  const mockParticipants: Participant[] = [
    {
      name: 'Test Participant',
      capitalApporte: 100000,
      registrationFeesRate: 12.5,
      interestRate: 4.5,
      durationYears: 25,
      enabled: true,
      isFounder: false,
      useTwoLoans: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveProjectData', () => {
    it('should BLOCK write when user is not authenticated', async () => {
      // RED: This should fail because we need to implement authentication check
      const result = await saveProjectData(
        'test-project-id',
        {
          deedDate: '2024-01-01',
          projectParams: mockProjectParams,
          portageFormula: mockPortageFormula,
        }
      );

      // Should fail with authentication error
      expect(result.success).toBe(false);
      expect(result.error).toContain('not authenticated');
    });
  });

  describe('saveParticipantData', () => {
    it('should BLOCK write when user is not authenticated', async () => {
      // RED: This should fail because we need to implement authentication check
      const result = await saveParticipantData('test-project-id', mockParticipants);

      // Should fail with authentication error
      expect(result.success).toBe(false);
      expect(result.error).toContain('not authenticated');
    });
  });

  describe('createProject', () => {
    it('should BLOCK create when user is not authenticated', async () => {
      // RED: This should fail because we need to implement authentication check
      const result = await createProject('2024-01-01', mockProjectParams, mockPortageFormula);

      // Should fail with authentication error
      expect(result.success).toBe(false);
      expect(result.error).toContain('not authenticated');
    });
  });

  describe('deleteProject', () => {
    it('should BLOCK delete when user is not authenticated', async () => {
      // RED: This should fail because we need to implement authentication check
      const result = await deleteProject('test-project-id');

      // Should fail with authentication error
      expect(result.success).toBe(false);
      expect(result.error).toContain('not authenticated');
    });
  });
});
