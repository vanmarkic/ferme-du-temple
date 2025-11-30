/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentTimeline } from './PaymentTimeline';
import type { PhaseCosts } from '@repo/credit-calculator/utils';

describe('PaymentTimeline', () => {
  const mockPhaseCosts: PhaseCosts = {
    signature: {
      purchaseShare: 35000,
      registrationFees: 5200,
      notaryFees: 5000,
      total: 45200,
    },
    construction: {
      casco: 60000,
      travauxCommuns: 12500,
      commun: 15000,
      total: 87500,
    },
    emmenagement: {
      parachevements: 25000,
      total: 25000,
    },
    grandTotal: 157700,
  };

  it('should display all three phases with icons and subtitles', () => {
    render(
      <PaymentTimeline
        phaseCosts={mockPhaseCosts}
        capitalApporte={30000}
        monthlyPayment={639}
      />
    );

    expect(screen.getByText('SIGNATURE')).toBeInTheDocument();
    expect(screen.getByText('CONSTRUCTION')).toBeInTheDocument();
    expect(screen.getByText('EMMÉNAGEMENT')).toBeInTheDocument();

    // Emotional subtitles
    expect(screen.getByText('Je deviens propriétaire')).toBeInTheDocument();
    expect(screen.getByText('Mon logement prend forme')).toBeInTheDocument();
    expect(screen.getByText("J'emménage chez moi")).toBeInTheDocument();

    expect(screen.getByText('45 200 €')).toBeInTheDocument();
    expect(screen.getByText('87 500 €')).toBeInTheDocument();
    expect(screen.getByText('25 000 €')).toBeInTheDocument();
  });

  it('should display summary bar with total, to finance, and monthly payment', () => {
    render(
      <PaymentTimeline
        phaseCosts={mockPhaseCosts}
        capitalApporte={30000}
        monthlyPayment={639}
      />
    );

    // Summary bar - answers key questions at a glance
    expect(screen.getByText('TOTAL')).toBeInTheDocument();
    expect(screen.getByText('157 700 €')).toBeInTheDocument();
    expect(screen.getByText('À FINANCER')).toBeInTheDocument();
    expect(screen.getByText('127 700 €')).toBeInTheDocument(); // 157700 - 30000
    expect(screen.getByText('MENSUALITÉ')).toBeInTheDocument();
    expect(screen.getByText('~639 €/mois')).toBeInTheDocument();
  });

  it('should display timeline header with title', () => {
    render(
      <PaymentTimeline
        phaseCosts={mockPhaseCosts}
        capitalApporte={30000}
        monthlyPayment={639}
      />
    );

    expect(screen.getByText('MON PARCOURS DE PAIEMENT')).toBeInTheDocument();
  });

  it('should only show 3 timeline dots (phases only, not total)', () => {
    const { container } = render(
      <PaymentTimeline
        phaseCosts={mockPhaseCosts}
        capitalApporte={30000}
        monthlyPayment={639}
      />
    );

    // Timeline should have exactly 3 dots for 3 phases
    const dots = container.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots).toHaveLength(3);
  });

  describe('Two-loan mode', () => {
    const twoLoanBreakdown = {
      loan1Amount: 15200, // signature: 45200 - 30000 capital
      loan1MonthlyPayment: 76,
      loan2Amount: 77500, // construction: 87500 - 10000 capitalForLoan2
      loan2MonthlyPayment: 390,
      signatureCosts: 45200,
      constructionCosts: 87500,
    };

    it('should display two-loan summary bar instead of single-loan summary when twoLoanBreakdown is provided', () => {
      render(
        <PaymentTimeline
          phaseCosts={mockPhaseCosts}
          capitalApporte={30000}
          monthlyPayment={639}
          twoLoanBreakdown={twoLoanBreakdown}
        />
      );

      // Two-loan mode should NOT show "À FINANCER" (that's single-loan mode)
      expect(screen.queryByText('À FINANCER')).not.toBeInTheDocument();

      // Should show loan amounts per phase with "À emprunter" labels
      const emprunterLabels = screen.getAllByText('À emprunter');
      expect(emprunterLabels.length).toBeGreaterThanOrEqual(2);
    });

    it('should display correct loan amounts per phase in two-loan mode', () => {
      render(
        <PaymentTimeline
          phaseCosts={mockPhaseCosts}
          capitalApporte={30000}
          monthlyPayment={639}
          twoLoanBreakdown={twoLoanBreakdown}
        />
      );

      // Signature loan amount (15 200 €)
      expect(screen.getByText('15 200 €')).toBeInTheDocument();

      // Construction loan amount (77 500 €)
      expect(screen.getByText('77 500 €')).toBeInTheDocument();

      // Total loan amount (15200 + 77500 = 92 700 €)
      expect(screen.getByText('92 700 €')).toBeInTheDocument();
    });

    it('should display monthly payments per phase in two-loan mode', () => {
      render(
        <PaymentTimeline
          phaseCosts={mockPhaseCosts}
          capitalApporte={30000}
          monthlyPayment={639}
          twoLoanBreakdown={twoLoanBreakdown}
        />
      );

      // Monthly payments
      expect(screen.getByText('76 €/mois')).toBeInTheDocument();
      expect(screen.getByText('390 €/mois')).toBeInTheDocument();

      // Combined max monthly (76 + 390 = 466)
      expect(screen.getByText('~466 €/mois (max)')).toBeInTheDocument();
    });

    it('should show phase labels in two-loan summary bar', () => {
      render(
        <PaymentTimeline
          phaseCosts={mockPhaseCosts}
          capitalApporte={30000}
          monthlyPayment={639}
          twoLoanBreakdown={twoLoanBreakdown}
        />
      );

      // Summary bar should show phase labels
      // The SIGNATURE label appears twice (once in phase card, once in summary)
      const signatureLabels = screen.getAllByText('SIGNATURE');
      expect(signatureLabels.length).toBe(2);

      const constructionLabels = screen.getAllByText('CONSTRUCTION');
      expect(constructionLabels.length).toBe(2);
    });
  });

  describe('Expected payback total', () => {
    it('should display expected payback card when expectedPaybackTotal is provided', () => {
      render(
        <PaymentTimeline
          phaseCosts={mockPhaseCosts}
          capitalApporte={30000}
          monthlyPayment={639}
          expectedPaybackTotal={71168}
        />
      );

      expect(screen.getByText('Total récupéré')).toBeInTheDocument();
      expect(screen.getByText('71 168 €')).toBeInTheDocument();
    });

    it('should not display expected payback card when expectedPaybackTotal is 0', () => {
      render(
        <PaymentTimeline
          phaseCosts={mockPhaseCosts}
          capitalApporte={30000}
          monthlyPayment={639}
          expectedPaybackTotal={0}
        />
      );

      expect(screen.queryByText('Total récupéré')).not.toBeInTheDocument();
    });

    it('should not display expected payback card when expectedPaybackTotal is undefined', () => {
      render(
        <PaymentTimeline
          phaseCosts={mockPhaseCosts}
          capitalApporte={30000}
          monthlyPayment={639}
        />
      );

      expect(screen.queryByText('Total récupéré')).not.toBeInTheDocument();
    });
  });
});
