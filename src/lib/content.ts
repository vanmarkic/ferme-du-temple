// Content types
export interface ContentData {
  frontmatter: Record<string, any>;
  sections: Record<string, string[]>;
}

// Import all JSON content files
import heroContent from '@/content/hero.json';
import pricingContent from '@/content/pricing.json';
import footerContent from '@/content/footer.json';
import collaborationContent from '@/content/collaboration.json';
import timelineContent from '@/content/timeline.json';
import projectContent from '@/content/project.json';
import locationContent from '@/content/location.json';
import inscriptionContent from '@/content/inscription.json';

// Content registry
const contentRegistry: Record<string, ContentData> = {
  'hero.json': heroContent,
  'pricing.json': pricingContent,
  'footer.json': footerContent,
  'collaboration.json': collaborationContent,
  'timeline.json': timelineContent,
  'project.json': projectContent,
  'location.json': locationContent,
  'inscription.json': inscriptionContent,
  // Support old .md extensions for backward compatibility
  'hero.md': heroContent,
  'pricing.md': pricingContent,
  'footer.md': footerContent,
  'collaboration.md': collaborationContent,
  'timeline.md': timelineContent,
  'project.md': projectContent,
  'location.md': locationContent,
  'inscription.md': inscriptionContent,
};

// Content loader utility - now synchronous
export const loadContent = (path: string): ContentData => {
  const content = contentRegistry[path];
  
  if (!content) {
    console.error(`Content not found: ${path}`);
    return { frontmatter: {}, sections: {} };
  }
  
  return content;
};

// Parse markdown sections - kept for backward compatibility but no longer needed
export const parseMarkdownSections = (content: string): Record<string, string[]> => {
  const sections: Record<string, string[]> = {};
  const lines = content.split('\n');
  let currentSection = '';
  
  lines.forEach(line => {
    if (line.startsWith('# ')) {
      currentSection = line.replace('# ', '').trim();
      sections[currentSection] = [];
    } else if (currentSection && line.trim()) {
      sections[currentSection].push(line.trim());
    }
  });
  
  return sections;
};
