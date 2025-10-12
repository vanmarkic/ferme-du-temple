import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'src/content');

interface FrontMatter {
  [key: string]: string;
}

function parseFrontMatter(filePath: string): { frontMatter: FrontMatter; body: string } {
  const content = readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontMatter: {}, body: content };
  }

  const [, frontMatterStr, body] = match;
  const frontMatter: FrontMatter = {};

  frontMatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontMatter[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });

  return { frontMatter, body };
}

describe('Content Collections - File Availability', () => {
  const contentFiles = [
    'hero.md',
    'project.md',
    'collaboration.md',
    'location.md',
    'pricing.md',
    'timeline.md',
    'inscription.md',
    'footer.md',
  ];

  contentFiles.forEach(file => {
    it(`should have ${file} file`, () => {
      const filePath = join(CONTENT_DIR, file);
      expect(existsSync(filePath)).toBe(true);
    });
  });
});

describe('Content Collections - Required Fields', () => {
  describe('Hero Content', () => {
    const { frontMatter } = parseFrontMatter(join(CONTENT_DIR, 'hero.md'));

    it('should have all required hero fields', () => {
      expect(frontMatter.mainTitle).toBeDefined();
      expect(frontMatter.mainSubtitle).toBeDefined();
      expect(frontMatter.secondaryTitle).toBeDefined();
      expect(frontMatter.tagline1).toBeDefined();
      expect(frontMatter.tagline2).toBeDefined();
      expect(frontMatter.tagline3).toBeDefined();
      expect(frontMatter.imageAlt1).toBeDefined();
      expect(frontMatter.imageAlt2).toBeDefined();
      expect(frontMatter.imageAlt3).toBeDefined();
      expect(frontMatter.imageAlt4).toBeDefined();
      expect(frontMatter.communityCaption).toBeDefined();
    });
  });

  describe('Project Content', () => {
    const { frontMatter, body } = parseFrontMatter(join(CONTENT_DIR, 'project.md'));

    it('should have all required project fields', () => {
      expect(frontMatter.title).toBeDefined();
      expect(frontMatter.subtitle).toBeDefined();
    });

    it('should have project body content', () => {
      expect(body.trim()).not.toBe('');
    });
  });

  describe('Collaboration Content', () => {
    const { frontMatter, body } = parseFrontMatter(join(CONTENT_DIR, 'collaboration.md'));

    it('should have all required collaboration fields', () => {
      expect(frontMatter.title).toBeDefined();
    });

    it('should have collaboration body content', () => {
      expect(body.trim()).not.toBe('');
    });
  });

  describe('Location Content', () => {
    const { frontMatter, body } = parseFrontMatter(join(CONTENT_DIR, 'location.md'));

    it('should have all required location fields', () => {
      expect(frontMatter.title).toBeDefined();
      expect(frontMatter.address).toBeDefined();
      expect(frontMatter.city).toBeDefined();
      expect(frontMatter.region).toBeDefined();
      expect(frontMatter.tagline).toBeDefined();
      expect(frontMatter.photosTitle).toBeDefined();
      expect(frontMatter.imagesTitle).toBeDefined();
      expect(frontMatter.mapTitle).toBeDefined();
    });

    it('should have location body content', () => {
      expect(body.trim()).not.toBe('');
    });

    it('should have "Le domaine aujourd\'hui" section in body', () => {
      expect(body).toContain('Le domaine aujourd\'hui');
      expect(body).toContain('7 hectares de prairies arborées');
      expect(body).toContain('Ruisseau traversant la parcelle');
      expect(body).toContain('Serre de 80 mètres');
    });
  });

  describe('Pricing Content', () => {
    const { frontMatter, body } = parseFrontMatter(join(CONTENT_DIR, 'pricing.md'));

    it('should have all required pricing fields', () => {
      expect(frontMatter.title).toBeDefined();
      expect(frontMatter.availability).toBeDefined();
      expect(frontMatter.offerTitle).toBeDefined();
      expect(frontMatter.offerSubtitle).toBeDefined();
      expect(frontMatter.offerDetails).toBeDefined();
    });

    it('should have pricing body content', () => {
      expect(body.trim()).not.toBe('');
    });
  });

  describe('Timeline Content', () => {
    const { frontMatter, body } = parseFrontMatter(join(CONTENT_DIR, 'timeline.md'));

    it('should have all required timeline fields', () => {
      expect(frontMatter.title).toBeDefined();
      expect(frontMatter.subtitle).toBeDefined();
    });

    it('should have timeline body content', () => {
      expect(body.trim()).not.toBe('');
    });
  });

  describe('Inscription Content', () => {
    const { frontMatter } = parseFrontMatter(join(CONTENT_DIR, 'inscription.md'));

    it('should have all required inscription fields', () => {
      expect(frontMatter.title).toBeDefined();
      expect(frontMatter.subtitle).toBeDefined();
      expect(frontMatter.formTitle).toBeDefined();
    });
  });

  describe('Footer Content', () => {
    const { frontMatter, body } = parseFrontMatter(join(CONTENT_DIR, 'footer.md'));

    it('should have all required footer fields', () => {
      expect(frontMatter.title).toBeDefined();
      expect(frontMatter.address).toBeDefined();
      expect(frontMatter.city).toBeDefined();
      expect(frontMatter.membersTitle).toBeDefined();
      expect(frontMatter.partnersTitle).toBeDefined();
      expect(frontMatter.copyright).toBeDefined();
      expect(frontMatter.tagline).toBeDefined();
    });

    it('should have footer body content', () => {
      expect(body.trim()).not.toBe('');
    });
  });
});
