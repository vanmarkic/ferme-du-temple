import { useState } from 'react';
import { GuidePasswordGate } from './GuidePasswordGate';
import { GuideNavigation } from './GuideNavigation';
import { GuideContent } from './GuideContent';
import type { GuideSection } from '@/lib/utils';

interface GuidePageProps {
  sections: GuideSection[];
  password: string;
}

export function GuidePage({ sections, password }: GuidePageProps) {
  const [activeSection, setActiveSection] = useState('');

  return (
    <GuidePasswordGate correctPassword={password}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <GuideNavigation sections={sections} activeSection={activeSection} />
        <div className="md:ml-64 lg:ml-72 pt-[57px] md:pt-0">
          <GuideContent sections={sections} onActiveSection={setActiveSection} />
        </div>
      </div>
    </GuidePasswordGate>
  );
}
