import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { GuideSection } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface GuideNavigationProps {
  sections: GuideSection[];
  activeSection: string;
}

export function GuideNavigation({ sections, activeSection }: GuideNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const topLevelSections = sections.filter(s => s.level <= 2);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const cleanTitle = (title: string) => {
    return title.replace(/^[🏡📋📅⏰🚪🔄💰📜🏗️🔀🏛️🏠👶🎨🏕️📞🌱]+\s*/, '');
  };

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-primary">Guide Habitat Beaver</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 mt-[57px]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <nav className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-xl">
            <div className="p-4 space-y-1">
              {topLevelSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-md transition-colors text-sm font-medium',
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                  )}
                >
                  {cleanTitle(section.title)}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 lg:w-72 bg-white border-r border-gray-200 shadow-sm overflow-y-auto z-30">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary mb-6">Guide Habitat Beaver</h1>
          <nav className="space-y-1">
            {topLevelSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-md transition-colors text-sm font-medium',
                  activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                )}
              >
                {cleanTitle(section.title)}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
