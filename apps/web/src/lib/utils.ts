import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  level: number;
  children?: GuideSection[];
}

export function parseMarkdownGuide(markdown: string): GuideSection[] {
  const sections: GuideSection[] = [];
  const lines = markdown.split('\n');

  let currentSection: GuideSection | null = null;
  let contentBuffer: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headerMatch) {
      if (currentSection) {
        currentSection.content = contentBuffer.join('\n').trim();
        sections.push(currentSection);
        contentBuffer = [];
      }

      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      const id = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      currentSection = {
        id,
        title,
        content: '',
        level
      };
    } else if (currentSection) {
      contentBuffer.push(line);
    }
  }

  if (currentSection) {
    currentSection.content = contentBuffer.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}

export function buildSectionTree(sections: GuideSection[]): GuideSection[] {
  const tree: GuideSection[] = [];
  const stack: GuideSection[] = [];

  for (const section of sections) {
    const item: GuideSection = { ...section, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }

    stack.push(item);
  }

  return tree;
}
