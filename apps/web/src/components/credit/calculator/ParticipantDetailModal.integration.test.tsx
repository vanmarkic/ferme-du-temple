import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ParticipantDetailModal from './ParticipantDetailModal';
import type {
  Participant,
  ProjectParams,
  ParticipantCalculation,
  CalculationResults,
  PortageFormulaParams,
  UnitDetails,
} from '@repo/credit-calculator/utils';
import type { Lot } from '@repo/credit-calculator/types';

// Mock the UnlockContext to avoid localStorage dependencies
vi.mock('../contexts/UnlockContext', () => ({
  useUnlock: () => ({
    isUnlocked: true,
    isReadonlyMode: false,
    isForceReadonly: false,
    unlockedAt: null,
    unlockedBy: null,
    unlock: vi.fn(),
    lock: vi.fn(),
    setReadonlyMode: vi.fn(),
    isLoading: false,
  }),
}));

describe('ParticipantDetailModal Integration', () => {
  const mockLot: Lot = {
    lotId: 1,
    unitId: 1,
    surface: 100,
    acquiredDate: new Date('2024-01-01'),
    soldDate: undefined,
    isPortage: false,
  };

  const mockParticipant: Participant = {
    name: 'Test User',
    capitalApporte: 30000,
    registrationFeesRate: 12.5,
    interestRate: 3.5,
    durationYears: 25,
    useTwoLoans: false,
    isFounder: false,
    entryDate: new Date('2024-01-01'),
    lotsOwned: [mockLot],
  };

  const mockProjectParams: ProjectParams = {
    totalPurchase: 350000,
    mesuresConservatoires: 0,
    demolition: 0,
    infrastructures: 0,
    etudesPreparatoires: 0,
    fraisEtudesPreparatoires: 0,
    fraisGeneraux3ans: 30000,
    batimentFondationConservatoire: 0,
    batimentFondationComplete: 0,
    batimentCoproConservatoire: 0,
    globalCascoPerM2: 600,
    cascoTvaRate: 6,
    renovationStartDate: '2024-03-01',
    travauxCommuns: {
      enabled: true,
      items: [],
    },
  };

  const mockCalc: ParticipantCalculation = {
    ...mockParticipant,
    surface: 100,
    unitId: 1,
    quantity: 1,
    pricePerM2: 350,
    purchaseShare: 35000,
    droitEnregistrements: 5200,
    fraisNotaireFixe: 5000,
    casco: 60000,
    parachevements: 25000,
    personalRenovationCost: 85000,
    constructionCost: 85000,
    constructionCostPerUnit: 85000,
    sharedCosts: 15000,
    travauxCommunsPerUnit: 12500,
    loanNeeded: 127700,
    monthlyPayment: 640,
    loan1MonthlyPayment: 0,
    loan2MonthlyPayment: 0,
    totalCost: 157700,
    financingRatio: 0.81,
    totalRepayment: 192000,
    totalInterest: 64300,
  };

  const mockCalculations: CalculationResults = {
    totalSurface: 100,
    pricePerM2: 350,
    sharedCosts: 15000,
    sharedPerPerson: 15000,
    participantBreakdown: [mockCalc],
    totals: {
      purchase: 35000,
      totalDroitEnregistrements: 5200,
      construction: 85000,
      shared: 15000,
      totalTravauxCommuns: 12500,
      travauxCommunsPerUnit: 12500,
      total: 157700,
      capitalTotal: 30000,
      totalLoansNeeded: 127700,
      averageLoan: 127700,
      averageCapital: 30000,
    },
  };

  const mockFormulaParams: PortageFormulaParams = {
    indexationRate: 2.0,
    carryingCostRecovery: 100,
    averageInterestRate: 4.5,
    coproReservesShare: 15,
  };

  const mockUnitDetails: UnitDetails = {
    '1': {
      casco: 600,
      parachevements: 250,
    },
  };

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    participantIndex: 0,
    participant: mockParticipant,
    participantBreakdown: mockCalc,
    deedDate: '2024-01-01',
    allParticipants: [mockParticipant],
    calculations: mockCalculations,
    projectParams: mockProjectParams,
    unitDetails: mockUnitDetails,
    formulaParams: mockFormulaParams,
    isPinned: false,
    onPin: vi.fn(),
    onUnpin: vi.fn(),
    onUpdateName: vi.fn(),
    onUpdateSurface: vi.fn(),
    onUpdateNotaryRate: vi.fn(),
    onUpdateInterestRate: vi.fn(),
    onUpdateDuration: vi.fn(),
    onUpdateQuantity: vi.fn(),
    onUpdateParachevementsPerM2: vi.fn(),
    onUpdateCascoSqm: vi.fn(),
    onUpdateParachevementsSqm: vi.fn(),
    onUpdateParticipant: vi.fn(),
    onAddPortageLot: vi.fn(),
    onRemovePortageLot: vi.fn(),
    onUpdatePortageLotSurface: vi.fn(),
    onUpdatePortageLotConstructionPayment: vi.fn(),
    onRemove: vi.fn(),
    totalParticipants: 1,
  };

  it('should display payment timeline with correct phase totals', () => {
    render(<ParticipantDetailModal {...defaultProps} />);

    // Verify timeline header
    expect(screen.getByText('MON PARCOURS DE PAIEMENT')).toBeInTheDocument();

    // Verify timeline phases are displayed
    expect(screen.getByText('SIGNATURE')).toBeInTheDocument();
    expect(screen.getByText('CONSTRUCTION')).toBeInTheDocument();
    expect(screen.getByText('EMMÉNAGEMENT')).toBeInTheDocument();

    // Verify emotional subtitles
    expect(screen.getByText('Je deviens propriétaire')).toBeInTheDocument();
    expect(screen.getByText('Mon logement prend forme')).toBeInTheDocument();
    expect(screen.getByText("J'emménage chez moi")).toBeInTheDocument();
  });

  it('should display summary bar with total and to-finance amounts', () => {
    render(<ParticipantDetailModal {...defaultProps} />);

    expect(screen.getByText('TOTAL')).toBeInTheDocument();
    expect(screen.getByText('À FINANCER')).toBeInTheDocument();
    expect(screen.getByText('MENSUALITÉ')).toBeInTheDocument();
  });

  it('should show loan section when clicked', () => {
    render(<ParticipantDetailModal {...defaultProps} />);

    // Find and click the Prêt section (renamed from Financement)
    const loanButton = screen.getByText(/Prêt/).closest('button');
    expect(loanButton).toBeInTheDocument();

    if (loanButton) {
      fireEvent.click(loanButton);
      // Should now see expanded loan details
      expect(screen.getByText("Frais d'enregistrement")).toBeInTheDocument();
      expect(screen.getByText(/Taux d'intérêt/)).toBeInTheDocument();
      expect(screen.getByText('Financement en deux prêts')).toBeInTheDocument();
    }
  });

  it('should show property section when expanded', () => {
    render(<ParticipantDetailModal {...defaultProps} />);

    // Find and click the "Bien immobilier" section (renamed from Paramètres)
    const propertyButton = screen.getByText('Bien immobilier').closest('button');
    expect(propertyButton).toBeInTheDocument();

    if (propertyButton) {
      fireEvent.click(propertyButton);
      // Should now see configuration fields (use getAllByText for multiple matches)
      expect(screen.getAllByText(/Surface totale/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Quantité/i)).toBeInTheDocument();
    }
  });

  it('should show expected paybacks for founders', () => {
    const founderParticipant: Participant = {
      ...mockParticipant,
      isFounder: true,
      lotsOwned: [mockLot],
    };

    const founderCalc = { ...mockCalc };

    render(
      <ParticipantDetailModal
        {...defaultProps}
        participant={founderParticipant}
        participantBreakdown={founderCalc}
      />
    );

    // Find the Remboursements section - should be visible for founders
    const paybacksButton = screen.getByText('Remboursements attendus').closest('button');
    expect(paybacksButton).toBeInTheDocument();
  });

  it('should not show expected paybacks for non-founders', () => {
    render(<ParticipantDetailModal {...defaultProps} />);

    // Remboursements section should not exist for non-founders
    const paybacksButton = screen.queryByText('Remboursements attendus');
    expect(paybacksButton).not.toBeInTheDocument();
  });

  it('should display participant name in header', () => {
    render(<ParticipantDetailModal {...defaultProps} />);

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
  });

  it('should display key financial metrics in header', () => {
    render(<ParticipantDetailModal {...defaultProps} />);

    expect(screen.getByText('Coût Total')).toBeInTheDocument();
    expect(screen.getAllByText('157 700 €').length).toBeGreaterThan(0);
    expect(screen.getByText('À emprunter')).toBeInTheDocument();
    expect(screen.getAllByText('127 700 €').length).toBeGreaterThan(0);
  });

  it('should show statut section when expanded', () => {
    render(<ParticipantDetailModal {...defaultProps} />);

    // Find and click the Statut section
    const statutButton = screen.getByText('Statut').closest('button');
    expect(statutButton).toBeInTheDocument();

    if (statutButton) {
      fireEvent.click(statutButton);
      // Should now see founder checkbox and entry date (use getAllByText for potential duplicates)
      expect(screen.getAllByText(/Fondateur/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Date d'entrée dans le projet/i)).toBeInTheDocument();
    }
  });

  it('should call onUpdateParticipant when loan type changes', () => {
    const onUpdateParticipant = vi.fn();
    render(
      <ParticipantDetailModal
        {...defaultProps}
        onUpdateParticipant={onUpdateParticipant}
      />
    );

    // Expand loan section (renamed from financing)
    const loanButton = screen.getByText(/Prêt/).closest('button');
    if (loanButton) {
      fireEvent.click(loanButton);

      // Click on "Financement en deux prêts" checkbox
      const twoLoansCheckbox = screen.getByText('Financement en deux prêts').closest('label')?.querySelector('input');
      if (twoLoansCheckbox) {
        fireEvent.click(twoLoansCheckbox);
        expect(onUpdateParticipant).toHaveBeenCalled();
      }
    }
  });

  it('should display timeline connector dots', () => {
    const { container } = render(<ParticipantDetailModal {...defaultProps} />);

    // Timeline should have exactly 3 dots for 3 phases
    const dots = container.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots).toHaveLength(3);
  });

  it('should display remove button when totalParticipants > 1', () => {
    render(
      <ParticipantDetailModal
        {...defaultProps}
        totalParticipants={2}
      />
    );

    expect(screen.getByText(/Retirer ce·tte participant·e/i)).toBeInTheDocument();
  });

  it('should not display remove button when totalParticipants = 1', () => {
    render(
      <ParticipantDetailModal
        {...defaultProps}
        totalParticipants={1}
      />
    );

    expect(screen.queryByText(/Retirer ce·tte participant·e/i)).not.toBeInTheDocument();
  });

  it('should render without crashing when isOpen is false', () => {
    const { container } = render(
      <ParticipantDetailModal
        {...defaultProps}
        isOpen={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should display print button', () => {
    const { container } = render(<ParticipantDetailModal {...defaultProps} />);

    // Check for print button
    const printButton = container.querySelector('button[title="Imprimer / PDF"]');
    expect(printButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ParticipantDetailModal
        {...defaultProps}
        onClose={onClose}
      />
    );

    // Find the X button (close button)
    const closeButtons = container.querySelectorAll('button');
    const closeButton = Array.from(closeButtons).find(
      btn => btn.querySelector('svg')?.classList.contains('lucide-x')
    );

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    }
  });

  describe('Two-loan mode display', () => {
    const twoLoanParticipant: Participant = {
      ...mockParticipant,
      useTwoLoans: true,
      capitalApporte: 50000,
      capitalForLoan2: 10000,
      loan2DelayYears: 2,
    };

    const twoLoanCalc: ParticipantCalculation = {
      ...mockCalc,
      useTwoLoans: true,
      capitalApporte: 50000,
      capitalForLoan2: 10000,
      loan1Amount: 5200, // signature costs - capitalApporte
      loan1MonthlyPayment: 26,
      loan1Interest: 2800,
      loan2Amount: 75000, // construction costs - capitalForLoan2
      loan2MonthlyPayment: 377,
      loan2Interest: 28100,
      loan2DurationYears: 23,
      loanNeeded: 80200, // loan1 + loan2
      totalInterest: 30900,
      totalRepayment: 111100,
    };

    it('should display two-loan summary instead of À FINANCER when useTwoLoans is true', () => {
      render(
        <ParticipantDetailModal
          {...defaultProps}
          participant={twoLoanParticipant}
          participantBreakdown={twoLoanCalc}
        />
      );

      // When two-loan mode is active, should NOT show "À FINANCER" label
      // (that label only appears in single-loan mode)
      expect(screen.queryByText('À FINANCER')).not.toBeInTheDocument();

      // Should show "À emprunter" labels in the two-loan summary
      const emprunterLabels = screen.getAllByText('À emprunter');
      expect(emprunterLabels.length).toBeGreaterThanOrEqual(2);
    });

    it('should display correct loan amounts per phase in two-loan mode', () => {
      render(
        <ParticipantDetailModal
          {...defaultProps}
          participant={twoLoanParticipant}
          participantBreakdown={twoLoanCalc}
        />
      );

      // The timeline should show loan1Amount for signature phase
      expect(screen.getByText('5 200 €')).toBeInTheDocument();

      // The timeline should show loan2Amount for construction phase
      expect(screen.getByText('75 000 €')).toBeInTheDocument();
    });

    it('should correctly account for capitalForLoan2 in total loan needed', () => {
      render(
        <ParticipantDetailModal
          {...defaultProps}
          participant={twoLoanParticipant}
          participantBreakdown={twoLoanCalc}
        />
      );

      // Total loan needed (loan1 + loan2 = 5200 + 75000 = 80200)
      // This value should appear in both header AND timeline summary
      const totalLoanAmounts = screen.getAllByText('80 200 €');
      expect(totalLoanAmounts.length).toBeGreaterThanOrEqual(2);
    });
  });
});
