import matter from 'gray-matter';

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

// Content loader utility
export const loadContent = async (path: string) => {
  try {
    const response = await fetch(`/content/${path}`);
    const text = await response.text();
    const { data, content } = matter(text);
    return { frontmatter: data, content };
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
