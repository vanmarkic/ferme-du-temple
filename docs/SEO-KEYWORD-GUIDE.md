# SEO Keyword Placement Guide - Ferme du Temple

## ✅ Part 1: Meta Descriptions Enhanced

All meta descriptions have been optimized with strategic keywords:

### Target Keywords
- **Primary**: habitat partagé, cohabitat, habitat groupé
- **Location**: Frameries, Mons, Belgique
- **Attributes**: écologique, solidaire, communauté, vie durable
- **Brand**: Ferme du Temple, Collectif Beaver

### Updated Meta Descriptions

#### Homepage (index.astro:48-49)
```
Title: "Habitat Partagé Écologique Frameries Mons | Ferme du Temple Beaver"
Description: "Habitat partagé écologique à Frameries près de Mons. Cohabitat solidaire, communauté de vie durable, habitat groupé en Belgique. Projet participatif sur 2,5 hectares avec le Collectif Beaver."
```

#### Guide Page (guide.astro:41-42)
```
Title: "Guide d'accueil Habitat Partagé - Collectif Beaver | Ferme du Temple"
Description: "Guide d'accueil pour nouveaux membres de l'habitat partagé Ferme du Temple. Informations pratiques pour intégrer notre communauté de cohabitat écologique près de Mons."
```

#### Historique Page (historique.astro:26-27)
```
Title: "Historique - Ferme du Temple | Histoire du Projet Habitat Partagé"
Description: "Histoire de la Ferme du Temple à Frameries. Découvrez l'évolution de notre projet d'habitat partagé et les grandes étapes du Collectif Beaver depuis sa création."
```

#### 404 Page (404.astro:10-11)
```
Title: "Page Non Trouvée | Habitat Partagé Ferme du Temple"
Description: "Page introuvable. Retour à l'accueil pour découvrir notre projet d'habitat partagé écologique à Frameries, cohabitat solidaire du Collectif Beaver près de Mons."
```

#### Thank You Page (inscription-merci.astro:9-10)
```
Title: "Candidature Reçue | Habitat Partagé Ferme du Temple"
Description: "Candidature reçue ! Merci pour votre intérêt pour notre habitat partagé écologique à Frameries. Le Collectif Beaver vous contactera pour rejoindre notre communauté."
```

---

## 📍 Part 2: Where to Add Keywords in Page Content

### Priority Locations for SEO Keywords

#### 1. **Hero Section** - `/src/content/hero.md`
**Current Status**: Good basic structure
**Location**: Lines 2-7

**Keyword Opportunities**:
```markdown
---
mainTitle: "L'HABITAT"
mainSubtitle: "PARTAGÉ ÉCOLOGIQUE"  # ADD: écologique
secondaryTitle: "DE LA FERME DU TEMPLE À FRAMERIES"  # ADD: location
tagline1: "Un projet de cohabitat ancré dans le territoire,"  # ADD: cohabitat
tagline2: "Communauté de vie durable et productive,"  # ADD: communauté + vie durable
tagline3: "S'articulant autour de la culture des arts et de la terre"
---
```

**Why**: H1 headings are the most important for SEO after page title

---

#### 2. **Project Section** - `/src/content/project.md`
**Current Status**: Well-written but missing key SEO terms
**Location**: Lines 1-30

**Keyword Opportunities**:

**Line 3** - Add keywords to subtitle:
```markdown
subtitle: "L'habitat partagé écologique de La Ferme du Temple est un projet de cohabitat solidaire et innovant à Frameries près de Mons, articulé autour de trois pôles principaux qui s'enrichissent mutuellement."
```

**Line 8** - Enhance PÔLE HABITAT:
```markdown
# PÔLE HABITAT GROUPÉ

Une dizaine d'habitations autonomes en copropriété dans notre habitat groupé avec des espaces communs : cuisine collective, salle polyvalente, ateliers, espaces d'accueil pour notre communauté.
```

**Add new section after line 30** - Location details:
```markdown
## Localisation

Notre habitat partagé se situe à Frameries, à proximité de Mons en Belgique, sur un terrain de 2,5 hectares offrant un cadre de vie écologique et préservé.
```

**Why**: Body content with natural keyword usage is the strongest SEO signal

---

#### 3. **Collaboration Section** - `/src/content/collaboration.md`
**Current Status**: Focused on governance, missing community keywords
**Location**: Lines 1-21

**Keyword Opportunities**:

**Line 6** - Add community context:
```markdown
La gouvernance partagée est au centre du fonctionnement de notre habitat groupé. Dans notre communauté de cohabitat, nous adoptons une approche horizontale...
```

**Add new section after line 16**:
```markdown
# Notre Communauté

Le Collectif Beaver forme une communauté de vie durable à la Ferme du Temple. Notre projet d'habitat partagé réunit des personnes engagées dans une démarche écologique et solidaire.
```

**Why**: Reinforces community and shared living aspects throughout the page

---

#### 4. **Location Section** - `/src/content/location.md`
**Need to check this file** - Most important for local SEO

Check if it includes:
- "Frameries" (city)
- "Mons" (nearby major city)
- "Hainaut" (province)
- "Belgique" (country)
- "habitat partagé" + location combination

---

### SEO Content Hierarchy (Order of Importance)

1. **H1 Heading** (Hero Section mainTitle + subtitle)
2. **First Paragraph** (Project subtitle - first 100 words)
3. **H2 Headings** (Section titles: PÔLE HABITAT, etc.)
4. **Body Content** (Natural keyword usage throughout)
5. **Image Alt Text** (Already good in hero.md)

---

## 🎯 Recommended Keyword Density

For best SEO without keyword stuffing:

| Keyword | Target Count | Current | Status |
|---------|--------------|---------|--------|
| habitat partagé | 5-8 times | ~3 | ⚠️ Add more |
| cohabitat | 2-4 times | 0 | ❌ Missing |
| habitat groupé | 2-4 times | 0 | ❌ Missing |
| Frameries | 3-5 times | ~1 | ⚠️ Add more |
| Mons | 2-3 times | 0 | ❌ Missing |
| écologique | 3-5 times | ~1 | ⚠️ Add more |
| communauté | 3-5 times | ~1 | ⚠️ Add more |
| Collectif Beaver | 2-4 times | 2 | ✅ Good |

---

## 🔍 Where Search Engines Look (Priority Order)

1. ✅ **`<title>` tag** - DONE (all pages optimized)
2. ✅ **`<meta description>`** - DONE (all pages optimized)
3. ⚠️ **`<h1>` heading** - NEEDS IMPROVEMENT (add keywords to hero.md)
4. ⚠️ **First paragraph** - NEEDS IMPROVEMENT (add keywords to project.md subtitle)
5. ⚠️ **`<h2>` headings** - GOOD (but can enhance)
6. ⚠️ **Body content** - GOOD (but add more strategic keywords)
7. ✅ **Image alt text** - GOOD (already descriptive)
8. ✅ **URL structure** - GOOD (clean URLs)
9. ✅ **JSON-LD Schema** - DONE (Organization + LocalBusiness)

---

## 📝 Quick Action Checklist

### Highest Impact Changes (Do These First):

- [ ] Update hero.md mainSubtitle to include "ÉCOLOGIQUE"
- [ ] Add "À FRAMERIES" to hero.md secondaryTitle
- [ ] Enhance project.md subtitle with location keywords
- [ ] Add "GROUPÉ" to "PÔLE HABITAT" heading
- [ ] Add location paragraph in project.md
- [ ] Check and enhance location.md with all location keywords

### Medium Impact Changes:

- [ ] Add "cohabitat" naturally 2-3 times in collaboration.md
- [ ] Add "communauté de vie durable" to collaboration section
- [ ] Review all content for natural keyword placement

### Tools to Verify:

After making changes, test with:
- Google Search Console (check keyword rankings)
- Google PageSpeed Insights (SEO audit)
- Rich Results Test (verify structured data)
- Manual search: "habitat partagé Frameries" on Google

---

## ⚠️ Important SEO Rules

1. **Natural Language**: Keywords must flow naturally, never force them
2. **User First**: Write for humans first, search engines second
3. **No Stuffing**: Don't repeat keywords unnaturally (Google penalizes this)
4. **Context**: Use variations (habitat partagé, cohabitat, habitat groupé) instead of repeating the same phrase
5. **Readability**: Content must remain engaging and well-written

---

## Current SEO Score Progress

- **Before All Changes**: 74/100
- **After Meta Tags**: 85-90/100
- **After Content Keywords**: Expected 90-95/100

The meta descriptions are now optimized. Implementing the content changes above will maximize your SEO potential!
