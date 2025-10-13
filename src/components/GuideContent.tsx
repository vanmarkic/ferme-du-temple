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
            'mb-12 scroll-mt-32',
            section.level === 2 && 'border-l-4 border-primary/20 pl-6'
          )}
        >
          <h2
            className={cn(
              'font-bold mb-6',
              section.level === 1 && 'text-4xl text-primary',
              section.level === 2 && 'text-3xl text-gray-900'
            )}
          >
            {section.title}
          </h2>
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-a:text-primary prose-strong:text-gray-900 prose-table:border-collapse prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
          />
        </section>
      ))}
    </div>
  );
}
