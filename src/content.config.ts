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
    imagesTitle: z.string(),
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
    transportRailTitle: z.string(),
    transportRoadTitle: z.string(),
    transportAirTitle: z.string(),
    heritageTitle: z.string(),
    domaineTitle: z.string(),
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
    formNotice: z.string().optional(),
    formTitle: z.string(),
    fields: z.object({
      nom: z.object({
        label: z.string(),
        placeholder: z.string(),
        required: z.boolean(),
      }),
      prenom: z.object({
        label: z.string(),
        placeholder: z.string(),
        required: z.boolean(),
      }),
      email: z.object({
        label: z.string(),
        placeholder: z.string(),
        required: z.boolean(),
      }),
      telephone: z.object({
        label: z.string(),
        placeholder: z.string(),
        required: z.boolean(),
      }),
      motivation: z.object({
        label: z.string(),
        placeholder: z.string(),
        required: z.boolean(),
      }),
      besoinsSpecifiques: z.object({
        label: z.string(),
        placeholder: z.string(),
        required: z.boolean(),
      }),
      infosPrioritaires: z.object({
        label: z.string(),
        placeholder: z.string(),
        required: z.boolean(),
      }),
    }),
    button: z.object({
      label: z.string(),
      loading: z.string(),
    }),
    privacyNotice: z.string(),
    successTitle: z.string(),
    successMessage: z.string(),
    signature: z.string(),
    backButtonLabel: z.string(),
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
    newsletterTitle: z.string().optional(),
    newsletterDescription: z.string().optional(),
    newsletterPlaceholder: z.string().optional(),
    newsletterButton: z.string().optional(),
    newsletterButtonLoading: z.string().optional(),
  }),
});

// Not Found Collection
const notFound = defineCollection({
  loader: glob({ pattern: 'not-found.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    message: z.string(),
    backButtonLabel: z.string(),
  }),
});

// Guide Access Collection
const guideAccess = defineCollection({
  loader: glob({ pattern: 'guide-access.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    passwordPlaceholder: z.string(),
    submitButton: z.string(),
    errorMessage: z.string(),
  }),
});

// Guide Navigation Collection
const guideNavigation = defineCollection({
  loader: glob({ pattern: 'guide-navigation.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    toggleMenuLabel: z.string(),
  }),
});

// Historique Access Collection
const historiqueAccess = defineCollection({
  loader: glob({ pattern: 'historique-access.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    passwordPlaceholder: z.string(),
    submitButton: z.string(),
    errorMessage: z.string(),
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
  notFound,
  guideAccess,
  guideNavigation,
  historiqueAccess,
};
