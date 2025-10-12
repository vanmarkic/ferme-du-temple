import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';

describe('Navigation', () => {
  const mockContent = {
    brandName: 'Ferme du Temple',
    menuItems: [
      { label: 'Le Projet', href: '#projet' },
      { label: 'Collaboration', href: '#collaboration' },
      { label: 'Localisation', href: '#localisation' },
      { label: 'Finances', href: '#prix' },
      { label: 'Planning', href: '#timeline' },
      { label: 'Inscription', href: '#inscription' },
    ],
  };

  it('should render navigation menu', () => {
    render(<Navigation content={mockContent} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeTruthy();
  });

  it('should display all menu items from content', () => {
    render(<Navigation content={mockContent} />);

    expect(screen.getByText('Le Projet')).toBeTruthy();
    expect(screen.getByText('Collaboration')).toBeTruthy();
    expect(screen.getByText('Localisation')).toBeTruthy();
    expect(screen.getByText('Finances')).toBeTruthy();
    expect(screen.getByText('Planning')).toBeTruthy();
    expect(screen.getByText('Inscription')).toBeTruthy();
  });

  it('should have correct href attributes for anchor links', () => {
    render(<Navigation content={mockContent} />);

    const projectLink = screen.getByText('Le Projet').closest('a');
    expect(projectLink?.getAttribute('href')).toBe('#projet');

    const collaborationLink = screen.getByText('Collaboration').closest('a');
    expect(collaborationLink?.getAttribute('href')).toBe('#collaboration');
  });

  it('should render brand name from content', () => {
    render(<Navigation content={mockContent} />);
    expect(screen.getByText('Ferme du Temple')).toBeTruthy();
  });

  it('should use default brand name when no content provided', () => {
    render(<Navigation />);
    expect(screen.getByText('Ferme du Temple')).toBeTruthy();
  });

  it('should render empty menu when no content provided', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeTruthy();
    // No menu items should be rendered
    expect(screen.queryByText('Le Projet')).toBeFalsy();
  });

  it('should have mobile menu toggle button', () => {
    render(<Navigation content={mockContent} />);
    const menuButton = screen.getByLabelText(/menu/i);
    expect(menuButton).toBeTruthy();
  });
});
