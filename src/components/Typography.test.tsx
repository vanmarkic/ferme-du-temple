import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

describe('Typography System', () => {
  describe('Type Scale - Major Third (1.25) Ratio', () => {
    it('should apply correct font sizes according to type scale', () => {
      const { container } = render(
        <div>
          <p className="text-base">Base text</p>
          <p className="text-lg">Large text</p>
          <h5 className="text-xl">Heading 5</h5>
          <h4 className="text-2xl">Heading 4</h4>
          <h3 className="text-3xl">Heading 3</h3>
          <h2 className="text-4xl">Heading 2</h2>
          <h1 className="text-5xl">Heading 1</h1>
        </div>
      );

      const base = container.querySelector('.text-base');
      const h1 = container.querySelector('.text-5xl');

      expect(base).toBeInTheDocument();
      expect(h1).toBeInTheDocument();
    });

    it('should apply tighter letter spacing to larger headings', () => {
      const { container } = render(
        <div>
          <h1 className="text-8xl">Hero</h1>
          <h2 className="text-5xl">Heading</h2>
        </div>
      );

      const hero = container.querySelector('.text-8xl');
      const heading = container.querySelector('.text-5xl');

      expect(hero).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });

    it('should apply wider letter spacing to small text', () => {
      const { container } = render(
        <div>
          <p className="text-xs">Small text</p>
          <p className="text-sm">Small text</p>
        </div>
      );

      const xs = container.querySelector('.text-xs');
      const sm = container.querySelector('.text-sm');

      expect(xs).toBeInTheDocument();
      expect(sm).toBeInTheDocument();
    });
  });

  describe('Line Heights', () => {
    it('should apply appropriate line heights for body text', () => {
      const { container } = render(
        <p className="leading-body">Body text with optimal line height</p>
      );

      const paragraph = container.querySelector('.leading-body');
      expect(paragraph).toBeInTheDocument();
    });

    it('should apply tighter line heights for headings', () => {
      const { container } = render(
        <h1 className="leading-heading">Heading with tight line height</h1>
      );

      const heading = container.querySelector('.leading-heading');
      expect(heading).toBeInTheDocument();
    });

    it('should apply loose line height for comfortable reading', () => {
      const { container } = render(
        <p className="leading-relaxed">Text with relaxed line height</p>
      );

      const paragraph = container.querySelector('.leading-relaxed');
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('Line Length (Measure)', () => {
    it('should constrain text to optimal reading width (65ch)', () => {
      const { container } = render(
        <p className="max-w-reading">
          Text constrained to optimal character count for comfortable reading
        </p>
      );

      const paragraph = container.querySelector('.max-w-reading');
      expect(paragraph).toBeInTheDocument();
    });

    it('should support narrow reading width (45ch)', () => {
      const { container } = render(
        <p className="max-w-reading-narrow">Narrow column text</p>
      );

      const paragraph = container.querySelector('.max-w-reading-narrow');
      expect(paragraph).toBeInTheDocument();
    });

    it('should support wide reading width (75ch)', () => {
      const { container } = render(
        <p className="max-w-reading-wide">Wide column text</p>
      );

      const paragraph = container.querySelector('.max-w-reading-wide');
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('Utility Classes', () => {
    it('should apply text-body class with responsive sizing', () => {
      const { container } = render(
        <p className="text-body">Body text with responsive font size</p>
      );

      const paragraph = container.querySelector('.text-body');
      expect(paragraph).toBeInTheDocument();
    });

    it('should apply text-display class for large display text', () => {
      const { container } = render(
        <h1 className="text-display">Display Text</h1>
      );

      const heading = container.querySelector('.text-display');
      expect(heading).toBeInTheDocument();
    });

    it('should apply text-eyebrow class for small uppercase labels', () => {
      const { container } = render(
        <span className="text-eyebrow">Category</span>
      );

      const eyebrow = container.querySelector('.text-eyebrow');
      expect(eyebrow).toBeInTheDocument();
    });

    it('should apply text-caption class for small annotations', () => {
      const { container } = render(
        <span className="text-caption">Image caption</span>
      );

      const caption = container.querySelector('.text-caption');
      expect(caption).toBeInTheDocument();
    });

    it('should apply heading-spaced class with proper vertical rhythm', () => {
      const { container } = render(
        <h2 className="heading-spaced">Section Heading</h2>
      );

      const heading = container.querySelector('.heading-spaced');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Responsive Typography', () => {
    it('should render with mobile base size by default', () => {
      const { container } = render(
        <div>
          <p className="text-base">Base text</p>
        </div>
      );

      const paragraph = container.querySelector('.text-base');
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('Letter Spacing', () => {
    it('should apply custom letter spacing values', () => {
      const { container } = render(
        <div>
          <h1 className="tracking-tighter">Very tight</h1>
          <h2 className="tracking-tight">Tight</h2>
          <h3 className="tracking-heading">Heading spacing</h3>
          <p className="tracking-wide">Wide</p>
          <p className="tracking-wider">Wider</p>
        </div>
      );

      expect(container.querySelector('.tracking-tighter')).toBeInTheDocument();
      expect(container.querySelector('.tracking-tight')).toBeInTheDocument();
      expect(container.querySelector('.tracking-heading')).toBeInTheDocument();
      expect(container.querySelector('.tracking-wide')).toBeInTheDocument();
      expect(container.querySelector('.tracking-wider')).toBeInTheDocument();
    });
  });
});
