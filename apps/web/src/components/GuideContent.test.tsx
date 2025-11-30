import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { GuideContent } from './GuideContent';
import type { GuideSection } from '@/lib/utils';

describe('GuideContent', () => {
  let mockIntersectionObserver: any;
  let observerCallback: IntersectionObserverCallback;
  let observedElements: Map<Element, IntersectionObserver>;

  beforeEach(() => {
    observedElements = new Map();

    mockIntersectionObserver = vi.fn((callback: IntersectionObserverCallback) => {
      observerCallback = callback;
      return {
        observe: vi.fn((element: Element) => {
          observedElements.set(element, mockIntersectionObserver);
        }),
        unobserve: vi.fn((element: Element) => {
          observedElements.delete(element);
        }),
        disconnect: vi.fn(() => {
          observedElements.clear();
        }),
      };
    });

    global.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockSections: GuideSection[] = [
    {
      id: 'section-1',
      title: 'Introduction',
      level: 2,
      content: 'First section content',
    },
    {
      id: 'section-2',
      title: 'Overview',
      level: 2,
      content: 'Second section content',
    },
    {
      id: 'section-3',
      title: 'Details',
      level: 3,
      content: 'Third section content',
    },
  ];

  it('should render all sections', () => {
    const onActiveSection = vi.fn();
    const { container } = render(
      <GuideContent sections={mockSections} onActiveSection={onActiveSection} />
    );

    expect(container.querySelector('#section-1')).toBeTruthy();
    expect(container.querySelector('#section-2')).toBeTruthy();
    expect(container.querySelector('#section-3')).toBeTruthy();
  });

  it('should setup IntersectionObserver for all sections', () => {
    const onActiveSection = vi.fn();
    render(<GuideContent sections={mockSections} onActiveSection={onActiveSection} />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '-120px 0px -50% 0px',
        threshold: [0, 0.1, 0.5, 1],
      })
    );

    expect(observedElements.size).toBe(3);
  });

  it('should call onActiveSection when a section is intersecting', () => {
    const onActiveSection = vi.fn();
    render(<GuideContent sections={mockSections} onActiveSection={onActiveSection} />);

    const mockEntry: Partial<IntersectionObserverEntry> = {
      target: document.getElementById('section-1')!,
      isIntersecting: true,
      boundingClientRect: { top: 100 } as DOMRectReadOnly,
    };

    act(() => {
      observerCallback([mockEntry as IntersectionObserverEntry], mockIntersectionObserver);
    });

    expect(onActiveSection).toHaveBeenCalledWith('section-1');
  });

  it('should activate the topmost section when multiple sections are intersecting', () => {
    const onActiveSection = vi.fn();
    render(<GuideContent sections={mockSections} onActiveSection={onActiveSection} />);

    const mockEntries: Partial<IntersectionObserverEntry>[] = [
      {
        target: document.getElementById('section-2')!,
        isIntersecting: true,
        boundingClientRect: { top: 200 } as DOMRectReadOnly,
      },
      {
        target: document.getElementById('section-1')!,
        isIntersecting: true,
        boundingClientRect: { top: 100 } as DOMRectReadOnly,
      },
      {
        target: document.getElementById('section-3')!,
        isIntersecting: true,
        boundingClientRect: { top: 300 } as DOMRectReadOnly,
      },
    ];

    act(() => {
      observerCallback(mockEntries as IntersectionObserverEntry[], mockIntersectionObserver);
    });

    expect(onActiveSection).toHaveBeenCalledWith('section-1');
  });

  it('should keep current section highlighted when scrolling past it', () => {
    const onActiveSection = vi.fn();
    render(<GuideContent sections={mockSections} onActiveSection={onActiveSection} />);

    const section1Entry: Partial<IntersectionObserverEntry> = {
      target: document.getElementById('section-1')!,
      isIntersecting: true,
      boundingClientRect: { top: 100 } as DOMRectReadOnly,
    };

    act(() => {
      observerCallback([section1Entry as IntersectionObserverEntry], mockIntersectionObserver);
    });

    expect(onActiveSection).toHaveBeenCalledWith('section-1');

    onActiveSection.mockClear();

    const notIntersectingEntry: Partial<IntersectionObserverEntry> = {
      target: document.getElementById('section-1')!,
      isIntersecting: false,
      boundingClientRect: { top: -100 } as DOMRectReadOnly,
    };

    act(() => {
      observerCallback([notIntersectingEntry as IntersectionObserverEntry], mockIntersectionObserver);
    });

    expect(onActiveSection).not.toHaveBeenCalled();
  });

  it('should disconnect observer on unmount', () => {
    const onActiveSection = vi.fn();
    const { unmount } = render(
      <GuideContent sections={mockSections} onActiveSection={onActiveSection} />
    );

    const disconnect = mockIntersectionObserver.mock.results[0].value.disconnect;

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });

  it('should apply correct styling classes based on section level', () => {
    const onActiveSection = vi.fn();
    const { container } = render(
      <GuideContent sections={mockSections} onActiveSection={onActiveSection} />
    );

    const section1 = container.querySelector('#section-1');
    const section3 = container.querySelector('#section-3');

    expect(section1?.className).toContain('border-l-4');
    expect(section3?.className).toContain('ml-4');
  });
});
