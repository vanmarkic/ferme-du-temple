import { useState, useMemo } from 'react';
import { GuidePasswordGate } from './GuidePasswordGate';
import { GuideNavigation, type GuideNavigationContent } from './GuideNavigation';
import { GuideContent } from './GuideContent';
import { buildSectionTree } from '@/lib/utils';
import type { GuideSection } from '@/lib/utils';

interface GuideAccessContent {
  title: string;
  description: string;
  passwordPlaceholder: string;
  submitButton: string;
  errorMessage: string;
}

interface GuidePageProps {
  sections: GuideSection[];
  password: string;
  guideAccessContent: GuideAccessContent;
  guideNavigationContent: GuideNavigationContent;
}

export function GuidePage({
  sections,
  password,
  guideAccessContent,
  guideNavigationContent,
}: GuidePageProps) {
  const [activeSection, setActiveSection] = useState('');

  // Build the tree structure for navigation
  const sectionTree = useMemo(() => buildSectionTree(sections), [sections]);

  return (
    <GuidePasswordGate correctPassword={password} content={guideAccessContent}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <GuideNavigation
          sections={sectionTree}
          activeSection={activeSection}
          content={guideNavigationContent}
        />
        <div className="md:ml-80 lg:ml-96 xl:ml-[32rem] pt-[57px] md:pt-0">
          <GuideContent sections={sections} onActiveSection={setActiveSection} />
        </div>
      </div>
    </GuidePasswordGate>
  );
}
