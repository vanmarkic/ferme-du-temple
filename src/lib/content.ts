// Type definitions
export interface HeroContent {
  mainTitle: string;
  mainSubtitle: string;
  secondaryTitle: string;
  tagline1: string;
  tagline2: string;
  tagline3: string;
  imageAlt1: string;
  imageAlt2: string;
  imageAlt3: string;
  imageAlt4: string;
  communityCaption: string;
}

export interface ProjectContent {
  title: string;
  subtitle: string;
  poles: Array<{ title: string; description: string }>;
  beaverTitle: string;
  beaverDescription: string[];
  members: string[];
  professions: string[];
}

export interface CollaborationContent {
  title: string;
  sections: Record<string, string[]>;
}

export interface FooterContent {
  title: string;
  address: string;
  city: string;
  members: string[];
  partners: Array<{ role: string; name: string }>;
  copyright: string;
  tagline: string;
}

// Manual frontmatter parser (browser-compatible)
const parseFrontmatter = (text: string) => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = text.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content: text };
  }
  
  const [, frontmatterText, content] = match;
  const frontmatter: Record<string, any> = {};
  
  // Parse simple YAML frontmatter
  const lines = frontmatterText.split('\n');
  let currentKey = '';
  let currentArray: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Array item
    if (trimmed.startsWith('- ')) {
      currentArray.push(trimmed.substring(2).trim());
    }
    // Key-value pair
    else if (trimmed.includes(':')) {
      // Save previous array if exists
      if (currentKey && currentArray.length > 0) {
        frontmatter[currentKey] = currentArray;
        currentArray = [];
      }
      
      const colonIndex = trimmed.indexOf(':');
      currentKey = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      
      // If value is empty, this might be the start of an array
      if (!value) {
        currentArray = [];
      } else {
        frontmatter[currentKey] = value;
        currentKey = '';
      }
    }
  });
  
  // Save final array if exists
  if (currentKey && currentArray.length > 0) {
    frontmatter[currentKey] = currentArray;
  }
  
  return { frontmatter, content };
};

// Content loader utility
export const loadContent = async (path: string) => {
  try {
    const response = await fetch(`/content/${path}`);
    const text = await response.text();
    const { frontmatter, content } = parseFrontmatter(text);
    return { frontmatter, content };
  } catch (error) {
    console.error(`Error loading content from ${path}:`, error);
    return { frontmatter: {}, content: '' };
  }
};

// Parse markdown sections
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
