import { useState, useMemo } from 'react';
import { GuidePasswordGate } from './GuidePasswordGate';
import { GuideNavigation } from './GuideNavigation';
import { GuideContent } from './GuideContent';
import { buildSectionTree } from '@/lib/utils';
import type { GuideSection } from '@/lib/utils';

interface GuidePageProps {
  sections: GuideSection[];
  password: string;
}

export function GuidePage({ sections, password }: GuidePageProps) {
  const [activeSection, setActiveSection] = useState('');

  // Build the tree structure for navigation
  const sectionTree = useMemo(() => buildSectionTree(sections), [sections]);

  return (
    <GuidePasswordGate correctPassword={password}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <GuideNavigation sections={sectionTree} activeSection={activeSection} />
        <div className="md:ml-80 lg:ml-96 xl:ml-[32rem] pt-[57px] md:pt-0">
          <GuideContent sections={sections} onActiveSection={setActiveSection} />
        </div>
      </div>
    </GuidePasswordGate>
  );
}
