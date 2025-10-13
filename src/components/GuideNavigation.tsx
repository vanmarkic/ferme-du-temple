import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { GuideSection } from '@/lib/utils';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';

interface GuideNavigationProps {
  sections: GuideSection[];
  activeSection: string;
}

interface NavItemProps {
  section: GuideSection;
  activeSection: string;
  expandedSections: Set<string>;
  onToggle: (id: string) => void;
  onNavigate: (id: string) => void;
  depth?: number;
}

function NavItem({ section, activeSection, expandedSections, onToggle, onNavigate, depth = 0 }: NavItemProps) {
  const hasChildren = section.children && section.children.length > 0;
  const isExpanded = expandedSections.has(section.id);
  const isActive = activeSection === section.id;

  // Only show level 2 and 3 in navigation (level 1 is the main title)
  if (section.level === 1) return null;
  if (section.level > 3) return null;

  const handleClick = () => {
    if (hasChildren) {
      onToggle(section.id);
    }
    onNavigate(section.id);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'w-full text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center gap-2',
          depth === 0 && 'font-medium',
          depth > 0 && 'font-normal text-xs',
          isActive
            ? 'bg-primary text-white'
            : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
        )}
        style={{ paddingLeft: `${depth * 0.75 + 0.75}rem` }}
      >
        {hasChildren && (
          <span className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        <span className={cn('truncate', !hasChildren && 'ml-6')}>
          {section.title}
        </span>
      </button>

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {section.children?.map((child) => (
            <NavItem
              key={child.id}
              section={child}
              activeSection={activeSection}
              expandedSections={expandedSections}
              onToggle={onToggle}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GuideNavigation({ sections, activeSection }: GuideNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // The sections is a tree structure. Level 1 (main title) contains level 2 sections as children.
  // We want to display the level 2 sections and their children in the navigation.
  const topLevelSections = sections.length > 0 && sections[0].level === 1 && sections[0].children
    ? sections[0].children  // If first item is level 1, use its children (level 2 sections)
    : sections.filter(s => s.level === 2);  // Otherwise filter for level 2

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
                <NavItem
                  key={section.id}
                  section={section}
                  activeSection={activeSection}
                  expandedSections={expandedSections}
                  onToggle={toggleSection}
                  onNavigate={scrollToSection}
                />
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-80 lg:w-96 xl:w-[32rem] bg-white border-r border-gray-200 shadow-sm overflow-y-auto z-30">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary mb-6">Guide Habitat Beaver</h1>
          <nav className="space-y-1">
            {topLevelSections.map((section) => (
              <NavItem
                key={section.id}
                section={section}
                activeSection={activeSection}
                expandedSections={expandedSections}
                onToggle={toggleSection}
                onNavigate={scrollToSection}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
