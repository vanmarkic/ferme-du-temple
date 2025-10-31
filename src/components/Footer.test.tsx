import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Footer } from './Footer';

// Mock the useToast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockContent = {
    title: 'Contact',
    address: '227 avenue Joseph Wauters',
    city: '7080 Frameries, Belgique',
    membersTitle: 'Membres du projet',
    partnersTitle: 'Partenaires',
    copyright: '',
    tagline: '2025 - Habitat partagé',
    newsletterTitle: 'Restez informé',
    newsletterDescription: 'Inscrivez-vous pour recevoir des nouvelles du projet sans engagement.',
    newsletterPlaceholder: 'Votre email',
    newsletterButton: "S'inscrire",
    newsletterButtonLoading: 'Inscription...',
  };

  const mockBody = `# Membres

- Annabelle Czyz
- Cathy Weyders

# Partenaires

**Architectes:** Carton 123`;

  describe('Newsletter section', () => {
    it('should render newsletter section when newsletterTitle is provided', () => {
      render(<Footer content={mockContent} body={mockBody} />);

      expect(screen.getByText('Restez informé')).toBeInTheDocument();
      expect(
        screen.getByText('Inscrivez-vous pour recevoir des nouvelles du projet sans engagement.')
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Votre email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
    });

    it('should not render newsletter section when newsletterTitle is not provided', () => {
      const contentWithoutNewsletter = { ...mockContent, newsletterTitle: undefined };
      render(<Footer content={contentWithoutNewsletter} body={mockBody} />);

      expect(screen.queryByPlaceholderText('Votre email')).not.toBeInTheDocument();
    });

    it('should submit newsletter email successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<Footer content={mockContent} body={mockBody} />);

      const emailInput = screen.getByPlaceholderText('Votre email');
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/submit-inscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            newsletterOnly: true,
          }),
        });
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Inscription réussie !',
          description: 'Merci pour votre intérêt. Vous recevrez bientôt nos nouvelles.',
        });
      });

      // Email input should be cleared after successful submission
      expect(emailInput).toHaveValue('');
    });

    it('should show loading state while submitting', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                }),
              100
            );
          })
      );

      render(<Footer content={mockContent} body={mockBody} />);

      const emailInput = screen.getByPlaceholderText('Votre email');
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      // Should show loading text
      await waitFor(() => {
        expect(screen.getByText('Inscription...')).toBeInTheDocument();
      });

      // Button should be disabled
      expect(submitButton).toBeDisabled();

      // Wait for submission to complete
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled();
      });
    });

    it('should handle API errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Cette adresse email est déjà inscrite.' }),
      });

      render(<Footer content={mockContent} body={mockBody} />);

      const emailInput = screen.getByPlaceholderText('Votre email');
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Erreur',
          description: 'Cette adresse email est déjà inscrite.',
          variant: 'destructive',
        });
      });

      // Email should NOT be cleared on error
      expect(emailInput).toHaveValue('existing@example.com');
    });

    it('should handle network errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<Footer content={mockContent} body={mockBody} />);

      const emailInput = screen.getByPlaceholderText('Votre email');
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Erreur',
          description: 'Une erreur est survenue. Veuillez réessayer.',
          variant: 'destructive',
        });
      });
    });

    it('should require email input', () => {
      render(<Footer content={mockContent} body={mockBody} />);

      const emailInput = screen.getByPlaceholderText('Votre email');
      expect(emailInput).toBeRequired();
    });

    it('should validate email format', () => {
      render(<Footer content={mockContent} body={mockBody} />);

      const emailInput = screen.getByPlaceholderText('Votre email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Contact section', () => {
    it('should render contact information', () => {
      render(<Footer content={mockContent} body={mockBody} />);

      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('227 avenue Joseph Wauters')).toBeInTheDocument();
      expect(screen.getByText('7080 Frameries, Belgique')).toBeInTheDocument();
    });

    it('should render members list', () => {
      render(<Footer content={mockContent} body={mockBody} />);

      expect(screen.getByText('Annabelle Czyz')).toBeInTheDocument();
      expect(screen.getByText('Cathy Weyders')).toBeInTheDocument();
    });

    it('should render partners section', () => {
      render(<Footer content={mockContent} body={mockBody} />);

      expect(screen.getByText(/Architectes/)).toBeInTheDocument();
      expect(screen.getByText(/Carton 123/)).toBeInTheDocument();
    });
  });
});
