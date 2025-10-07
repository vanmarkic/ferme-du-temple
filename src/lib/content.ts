import matter from 'gray-matter';

// Content loader utility
export const loadContent = async (path: string) => {
  try {
    const response = await fetch(`/src/content/${path}`);
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
