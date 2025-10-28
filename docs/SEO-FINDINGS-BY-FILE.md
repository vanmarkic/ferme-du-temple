# SEO Implementation - Findings by File

## Critical Files with SEO Issues

### 1. `/src/layouts/BaseLayout.astro` - THE MAIN SEO FILE
**Importance:** 🔴 CRITICAL - This is the layout for ALL pages

#### Line-by-Line SEO Issues:

**Line 17:** ISSUE - Wrong language tag
```astro
<html lang="en">  <!-- ❌ SHOULD BE lang="fr" -->
```
- Fix: Change to `lang="fr"` (all content is in French)
- Impact: High - Affects search ranking for French queries

**Lines 19-23:** ✓ GOOD - Basic meta tags
```astro
<meta charset="UTF-8" />                    <!-- ✓ UTF-8 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />  <!-- ✓ Mobile responsive -->
<title>{title}</title>                      <!-- ✓ Dynamic -->
<meta name="description" content={description} />  <!-- ✓ Dynamic -->
<meta name="author" content="Collectif Beaver" />  <!-- ✓ Present -->
```

**Lines 24-33:** ✓ GOOD - Performance optimization
```astro
<link rel="dns-prefetch" href="https://fonts.googleapis.com">  <!-- ✓ DNS prefetch -->
<link rel="preconnect" href="https://fonts.googleapis.com">    <!-- ✓ Preconnect -->
<link rel="preload" as="font" ... />        <!-- ✓ Font preloading -->
```

**Lines 41-53:** ✓ GOOD - Image preloading
```astro
<link rel="preload" as="image"
  href="/images/carousel/property-5-mobile.avif"
  fetchpriority="high">                     <!-- ✓ LCP optimization -->
```

**Lines 55-60:** ✓ GOOD - Font optimization
```astro
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?...&display=optional">
                                            <!-- ✓ Font-display: optional prevents CLS -->
<link rel="stylesheet" ... media="print" onload="this.media='all'">
                                            <!-- ✓ Async CSS loading -->
```

**Lines 62-69:** ⚠ PARTIAL - Social media tags
```astro
<meta property="og:title" content={title} />          <!-- ✓ OK -->
<meta property="og:description" content={description} />  <!-- ✓ OK -->
<meta property="og:type" content="website" />         <!-- ✓ OK -->
<meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
                                            <!-- ❌ PLACEHOLDER - Use branded image -->

<meta name="twitter:card" content="summary_large_image" />  <!-- ✓ OK -->
<meta name="twitter:site" content="@lovable_dev" />  <!-- ❌ WRONG HANDLE -->
<meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
                                            <!-- ❌ PLACEHOLDER -->
```

**MISSING:** Critical tags not present
```astro
<!-- ❌ No canonical link (add after line 69):
<link rel="canonical" href={Astro.url.href} />
-->

<!-- ❌ No language alternatives (add after canonical):
<link rel="alternate" hreflang="fr" href={Astro.url.href} />
-->

<!-- ❌ No theme color (add for browser UI):
<meta name="theme-color" content="#330066" />
-->

<!-- ❌ No JSON-LD Schema (add before closing </head>):
<script type="application/ld+json">
{...organization schema...}
</script>
-->
```

---

### 2. `/astro.config.mjs` - Build Configuration
**Importance:** 🟡 MEDIUM

#### SEO-Relevant Settings:

**Line 7:** ✓ GOOD - Site URL configured
```javascript
site: 'https://lafermedutemple.be',  // ✓ Required for sitemap
```

**Line 8:** ✓ GOOD - Static output
```javascript
output: 'static',  // ✓ Best for SEO (pre-rendered HTML)
```

**Lines 16-18:** ✓ GOOD - Prefetch strategy
```javascript
prefetch: {
  prefetchAll: false,      // ✓ Only prefetch what's needed
  defaultStrategy: 'viewport', // ✓ Scroll-triggered prefetch
}
```

**Lines 20-76:** ✓ EXCELLENT - JavaScript optimization
```javascript
// Bundle React vendor (critical path)
if (id.includes('node_modules/react/')) return 'react-vendor';

// Separate non-critical chunks
if (id.includes('@radix-ui/react-dialog')) return 'dialog';
if (id.includes('leaflet')) return 'leaflet';
```

**MISSING:** @astrojs/sitemap not configured
```javascript
// ❌ Should add to integrations:
// import sitemap from '@astrojs/sitemap';
// 
// integrations: [
//   sitemap(),
//   react(),
//   tailwind(),
// ]
```

---

### 3. `/public/robots.txt` - Crawler Instructions
**Importance:** 🟡 MEDIUM

#### Current Content:
```
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
```

**Status:** ✓ Allows crawling but incomplete

**MISSING:** Line after "Allow: /"
```
# ❌ Missing sitemap reference (add after final Allow: /):
Sitemap: https://lafermedutemple.be/sitemap-index.xml
```

---

### 4. `/src/content.config.ts` - Content Collections
**Importance:** 🟢 GOOD

#### Line-by-Line Review:

**Lines 1-3:** ✓ GOOD - Proper imports
```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
```

**Lines 5-21:** ✓ GOOD - Hero collection with validation
```typescript
const hero = defineCollection({
  loader: glob({ pattern: 'hero.md', base: './src/content' }),
  schema: z.object({
    mainTitle: z.string(),
    mainSubtitle: z.string(),
    imageAlt1: z.string(),  // ✓ Alt text tracked
    // ... more fields
  }),
});
```

**All collections:** ✓ Well-structured with Zod validation
- 12 collections defined
- All use glob pattern loading
- Schema validation enforced

**Status:** No SEO issues here - excellent content management

---

### 5. `/src/pages/index.astro` - Homepage
**Importance:** 🔴 CRITICAL

#### SEO Issues:

**Lines 40-42:** ⚠ PARTIAL - Uses default meta tags
```astro
<BaseLayout>
<!-- ❌ Uses default title and description from BaseLayout -->
<!-- Should customize for homepage -->
```

**Should be:**
```astro
<BaseLayout 
  title="La Ferme du Temple - Habitat Partagé Écologique | Belgique"
  description="Découvrez l'habitat partagé de la Ferme du Temple près de Mons. Un projet écologique, culturel et solidaire pour vivre autrement."
>
```

**Lines 51-68:** ✓ GOOD - Proper section IDs
```astro
<div id="projet">
<div id="collaboration">
<div id="localisation">
<div id="timeline">
<div id="inscription">
```
- ✓ Anchor links for navigation
- ✓ Section navigation support

**Status:** Main issue = default meta tags, structure is good

---

### 6. `/src/pages/guide.astro` - Guide Page
**Importance:** 🟡 MEDIUM

#### Line 40-42: ✓ GOOD - Custom meta tags
```astro
<BaseLayout
  title="Guide d'accueil - Habitat Beaver | Ferme du Temple"
  description="Guide d'accueil pour les nouveaux venus du projet Habitat Beaver à la Ferme du Temple"
>
```

**Status:** Good SEO setup for this page

---

### 7. `/src/pages/historique.astro` - History Page
**Importance:** 🟡 MEDIUM

#### Lines 25-27: ✓ GOOD - Has meta tags
```astro
<BaseLayout
  title="Historique - Ferme du Temple"
  description="L'histoire de la Ferme du Temple"
>
```

**Status:** Good but minimal description

---

### 8. `/src/pages/404.astro` - Error Page
**Importance:** 🟡 MEDIUM

#### Line 9: ✓ GOOD - Has title
```astro
<BaseLayout title="Page Non Trouvée | Ferme du Temple">
```

**Issue:** ⚠ No description
```astro
<!-- Should add description for completeness:
<BaseLayout 
  title="Page Non Trouvée | Ferme du Temple"
  description="La page demandée n'existe pas. Retournez à l'accueil."
>
-->
```

**Status:** Works but incomplete SEO

---

### 9. `/src/components/HeroSection.tsx` - Hero Component
**Importance:** 🔴 CRITICAL

#### Lines 51-56: ✓ GOOD - H1 + H2 structure
```tsx
<h1 className="text-4xl ... font-display">
  {mainTitle}
  <span className="block mt-2">{mainSubtitle}</span>
</h1>
<h2 className="text-xl ... font-display">
  {secondaryTitle}
</h2>
```

#### Image Alt Text:
**Lines 135, 180, 226:** ✓ GOOD - Descriptive alt text
```tsx
alt={imageAlt2}  // "Bâtiment extérieur de la ferme"
alt={imageAlt1}  // "Intérieur de la Ferme du Temple"
alt={imageAlt4}  // "Serres de la ferme"
```

#### Images Structure:
**Lines 104-141:** ✓ GOOD - Responsive picture element
```tsx
<picture>
  <source type="image/avif" media="(max-width: 640px)" />
  <source type="image/avif" media="(max-width: 1024px)" />
  <source type="image/avif" ... />
  <source type="image/webp" ... />
  <img src="..." alt={imageAlt2} loading="lazy" decoding="async" />
</picture>
```

**Status:** Excellent image optimization

---

### 10. `/src/components/PropertyCarousel.tsx` - Carousel
**Importance:** 🟢 GOOD

#### Lines 11-112: ✓ EXCELLENT - Complete image metadata
```javascript
propertyImages = [
  {
    src: "/images/carousel/property-5.jpg",
    srcMobile: "/images/carousel/property-5-mobile.jpg",
    webp: "/images/carousel/property-5.webp",
    webpMobile: "/images/carousel/property-5-mobile.webp",
    avif: "/images/carousel/property-5.avif",
    avifMobile: "/images/carousel/property-5-mobile.avif",
    alt: "Vue aérienne de la Ferme du Temple",  // ✓ GOOD
  },
  // 9 more images, all with alt text
]
```

**Status:** Perfect - all 10 images have descriptive French alt text

---

### 11. `/src/components/SectionTitle.tsx` - Section Titles
**Importance:** 🟡 MEDIUM

#### Line 34: ✓ GOOD - H2 heading
```tsx
<h2 className="text-3xl ... font-display">
  {children}
</h2>
```

**Status:** Proper heading hierarchy maintained

---

### 12. `/src/components/Footer.tsx` - Footer
**Importance:** 🟡 MEDIUM

#### Lines 1-122: ✓ GOOD - Contact structure
```tsx
const contacts = parseMembers(body);  // Extract members
const partners = parsePartners(body); // Extract partners

// Display in semantic structure
<h3 className="text-2xl font-display font-bold">{title}</h3>
<h4 className="font-semibold">{membersTitle}</h4>
<h4 className="font-semibold">{partnersTitle}</h4>
```

**Status:** Good information architecture

**MISSING:** Could add LocalBusiness schema here
```html
<!-- Add JSON-LD after footer content for local SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "La Ferme du Temple",
  "address": "227 rue Joseph Wauters, 7080 Frameries, Belgium",
  "telephone": "...",
  "foundingDate": "...",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "50.3993",
    "longitude": "3.9047"
  }
}
</script>
```

---

### 13. `/src/components/MapView.tsx` - Map Component
**Importance:** 🟢 GOOD

#### Line 48: ✓ GOOD - Marker alt attribute
```typescript
alt: 'La Ferme du Temple - Location marker'
```

#### Lines 55-56: ✓ GOOD - Accessibility attributes
```typescript
markerElement.setAttribute('aria-label', 'La Ferme du Temple - 227 rue Joseph Wauters, 7080 Frameries, Belgique');
markerElement.setAttribute('title', 'La Ferme du Temple - Click for details');
```

**Status:** Good accessibility implementation

---

## Summary Table

| File | SEO Issues | Priority | Time |
|------|-----------|----------|------|
| BaseLayout.astro | 4 major | 🔴 Critical | 30 min |
| astro.config.mjs | 1 (sitemap) | 🔴 Critical | 15 min |
| robots.txt | 1 (sitemap ref) | 🔴 Critical | 2 min |
| index.astro | 1 (default meta) | 🔴 Critical | 5 min |
| guide.astro | 0 | ✓ Good | - |
| historique.astro | 0 | ✓ Good | - |
| 404.astro | 1 (no description) | 🟡 Medium | 2 min |
| HeroSection.tsx | 0 | ✓ Good | - |
| PropertyCarousel.tsx | 0 | ✓ Good | - |
| SectionTitle.tsx | 0 | ✓ Good | - |
| Footer.tsx | 1 (no schema) | 🟡 Medium | 30 min |
| MapView.tsx | 0 | ✓ Good | - |

---

## Files NOT Reviewed But May Need Work

1. `/src/components/LocationSection.tsx` - May need LocalBusiness schema
2. `/src/components/TimelineSection.tsx` - Could use Event schema
3. `/src/components/InscriptionForm.tsx` - No schema for form
4. All other components - Check for missing ARIA labels

---

**Next Steps:**
1. Fix language tag: 2 min
2. Add sitemap: 15 min  
3. Update OG images: 5 min
4. Create canonical URLs: 10 min
5. Add JSON-LD schemas: 60 min

**Total Time to Grade A SEO:** ~90 minutes
