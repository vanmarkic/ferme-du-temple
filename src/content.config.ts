import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Hero Section Collection
const hero = defineCollection({
  loader: glob({ pattern: 'hero.md', base: './src/content' }),
  schema: z.object({
    mainTitle: z.string(),
    mainSubtitle: z.string(),
    secondaryTitle: z.string(),
    tagline1: z.string(),
    tagline2: z.string(),
    tagline3: z.string(),
    imageAlt1: z.string(),
    imageAlt2: z.string(),
    imageAlt3: z.string(),
    imageAlt4: z.string(),
    communityCaption: z.string(),
  }),
});

// Project Section Collection
const project = defineCollection({
  loader: glob({ pattern: 'project.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
});

// Collaboration Section Collection
const collaboration = defineCollection({
  loader: glob({ pattern: 'collaboration.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    alignment: z.string().optional(),
  }),
});

// Location Section Collection
const location = defineCollection({
  loader: glob({ pattern: 'location.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    address: z.string(),
    city: z.string(),
    region: z.string(),
    tagline: z.string(),
    photosTitle: z.string(),
    imagesTitle: z.string(),
    mapTitle: z.string(),
  }),
});

// Pricing Section Collection
const pricing = defineCollection({
  loader: glob({ pattern: 'pricing.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    availability: z.string(),
    offerTitle: z.string(),
    offerSubtitle: z.string(),
    offerDetails: z.string(),
  }),
});

// Timeline Section Collection
const timeline = defineCollection({
  loader: glob({ pattern: 'timeline.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
});

// Inscription Form Collection
const inscription = defineCollection({
  loader: glob({ pattern: 'inscription.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    formTitle: z.string(),
  }),
});

// Navigation Collection
const navigation = defineCollection({
  loader: glob({ pattern: 'navigation.md', base: './src/content' }),
  schema: z.object({
    brandName: z.string(),
    menuItems: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })),
  }),
});

// Footer Collection
const footer = defineCollection({
  loader: glob({ pattern: 'footer.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    address: z.string(),
    city: z.string(),
    membersTitle: z.string(),
    partnersTitle: z.string(),
    copyright: z.string(),
    tagline: z.string(),
  }),
});

export const collections = {
  hero,
  project,
  collaboration,
  location,
  pricing,
  timeline,
  inscription,
  navigation,
  footer,
};
