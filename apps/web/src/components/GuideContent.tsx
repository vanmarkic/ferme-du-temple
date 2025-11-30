import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { GuideSection } from '@/lib/utils';
import { marked } from 'marked';

interface GuideContentProps {
  sections: GuideSection[];
  onActiveSection: (sectionId: string) => void;
}

marked.setOptions({
  gfm: true,
  breaks: true,
});

function renderMarkdown(content: string): string {
  return marked.parse(content) as string;
}

export function GuideContent({ sections, onActiveSection }: GuideContentProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            onActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections, onActiveSection]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={cn(
            'scroll-mt-32',
            section.level === 1 && 'mb-16',
            section.level === 2 && 'mb-12 border-l-4 border-primary/20 pl-6',
            section.level === 3 && 'mb-10 ml-4',
            section.level === 4 && 'mb-8 ml-8',
            section.level === 5 && 'mb-6 ml-12'
          )}
        >
          <h2
            className={cn(
              'font-bold mb-6',
              section.level === 1 && 'text-4xl text-primary',
              section.level === 2 && 'text-3xl text-gray-900',
              section.level === 3 && 'text-2xl text-gray-800',
              section.level === 4 && 'text-xl text-gray-700',
              section.level === 5 && 'text-lg text-gray-600'
            )}
          >
            {section.title}
          </h2>
          <div
            className={cn(
              'prose max-w-none prose-headings:font-bold prose-a:text-primary prose-strong:text-gray-900 prose-table:border-collapse prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100',
              section.level <= 2 && 'prose-lg',
              section.level === 3 && 'prose-base',
              section.level >= 4 && 'prose-sm',
              section.level >= 3 && 'ml-4'
            )}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
          />
        </section>
      ))}
    </div>
  );
}
