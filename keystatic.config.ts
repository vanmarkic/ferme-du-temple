import { config, fields, singleton } from '@keystatic/core';

// Use local storage in development, GitHub in production
const isProd = process.env.NODE_ENV === 'production';

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: 'vanmarkic/ferme-du-temple',
      }
    : {
        kind: 'local',
      },
  ui: {
    brand: {
      name: 'Ferme du Temple',
    },
  },
  singletons: {
    // ==================== LANDING PAGE ====================

    hero: singleton({
      label: 'Hero Section',
      path: 'src/content/hero/hero',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        mainTitle: fields.text({ label: 'Titre principal' }),
        mainSubtitle: fields.text({ label: 'Sous-titre principal' }),
        secondaryTitle: fields.text({ label: 'Titre secondaire' }),
        tagline1: fields.text({ label: 'Slogan ligne 1' }),
        tagline2: fields.text({ label: 'Slogan ligne 2' }),
        tagline3: fields.text({ label: 'Slogan ligne 3' }),
        imageAlt1: fields.text({ label: 'Alt image 1' }),
        imageAlt2: fields.text({ label: 'Alt image 2' }),
        imageAlt3: fields.text({ label: 'Alt image 3' }),
        imageAlt4: fields.text({ label: 'Alt image 4' }),
        communityCaption: fields.text({ label: 'Légende communauté' }),
        imagesTitle: fields.text({ label: 'Titre section images' }),
        content: fields.mdx({ label: 'Contenu additionnel' }),
      },
    }),

    navigation: singleton({
      label: 'Navigation',
      path: 'src/content/navigation/navigation',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        brandName: fields.text({ label: 'Nom du site' }),
        menuItems: fields.array(
          fields.object({
            label: fields.text({ label: 'Libellé' }),
            href: fields.text({ label: 'Lien (href)' }),
          }),
          {
            label: 'Éléments du menu',
            itemLabel: (props) => props.fields.label.value || 'Élément',
          }
        ),
        content: fields.mdx({ label: 'Notes' }),
      },
    }),

    project: singleton({
      label: 'Section Projet',
      path: 'src/content/project/project',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre de section' }),
        subtitle: fields.text({ label: 'Sous-titre', multiline: true }),
        content: fields.mdx({
          label: 'Contenu du projet',
          description: 'Contenu markdown (pôles, infos collectif)',
        }),
      },
    }),

    collaboration: singleton({
      label: 'Section Collaboration',
      path: 'src/content/collaboration/collaboration',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre de section' }),
        alignment: fields.select({
          label: 'Alignement du texte',
          options: [
            { label: 'Gauche', value: 'left' },
            { label: 'Centre', value: 'center' },
            { label: 'Droite', value: 'right' },
          ],
          defaultValue: 'center',
        }),
        content: fields.mdx({
          label: 'Contenu collaboration',
          description: 'Contenu markdown sur la gouvernance',
        }),
      },
    }),

    location: singleton({
      label: 'Section Localisation',
      path: 'src/content/location/location',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre de section' }),
        address: fields.text({ label: 'Adresse' }),
        city: fields.text({ label: 'Ville' }),
        region: fields.text({ label: 'Région' }),
        tagline: fields.text({ label: 'Slogan', multiline: true }),
        photosTitle: fields.text({ label: 'Titre photos' }),
        imagesTitle: fields.text({ label: 'Titre images' }),
        mapTitle: fields.text({ label: 'Titre carte' }),
        transportRailTitle: fields.text({ label: 'Titre transport ferroviaire' }),
        transportRoadTitle: fields.text({ label: 'Titre transport routier' }),
        transportAirTitle: fields.text({ label: 'Titre aéroport' }),
        heritageTitle: fields.text({ label: 'Titre patrimoine' }),
        domaineTitle: fields.text({ label: 'Titre domaine' }),
        content: fields.mdx({
          label: 'Contenu localisation',
          description: 'Infos transport, patrimoine, caractéristiques du domaine',
        }),
      },
    }),

    pricing: singleton({
      label: 'Section Prix',
      path: 'src/content/pricing/pricing',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre de section' }),
        availability: fields.text({ label: 'Texte disponibilité' }),
        offerTitle: fields.text({ label: 'Titre offre' }),
        offerSubtitle: fields.text({ label: 'Sous-titre offre' }),
        offerDetails: fields.text({ label: 'Détails offre', multiline: true }),
        content: fields.mdx({
          label: 'Exemples de prix',
          description: 'Contenu markdown avec exemples de prix',
        }),
      },
    }),

    timeline: singleton({
      label: 'Section Planning',
      path: 'src/content/timeline/timeline',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre de section' }),
        subtitle: fields.text({ label: 'Sous-titre', multiline: true }),
        content: fields.mdx({
          label: 'Contenu planning',
          description: 'Jalons du projet (utiliser # pour les années)',
        }),
      },
    }),

    inscription: singleton({
      label: 'Formulaire Inscription',
      path: 'src/content/inscription/inscription',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre de section' }),
        subtitle: fields.text({ label: 'Sous-titre', multiline: true }),
        formNotice: fields.text({ label: 'Notice du formulaire', multiline: true }),
        formTitle: fields.text({ label: 'Titre du formulaire' }),
        fields: fields.object({
          nom: fields.object({
            label: fields.text({ label: 'Libellé' }),
            placeholder: fields.text({ label: 'Placeholder' }),
            required: fields.checkbox({ label: 'Requis' }),
          }),
          prenom: fields.object({
            label: fields.text({ label: 'Libellé' }),
            placeholder: fields.text({ label: 'Placeholder' }),
            required: fields.checkbox({ label: 'Requis' }),
          }),
          email: fields.object({
            label: fields.text({ label: 'Libellé' }),
            placeholder: fields.text({ label: 'Placeholder' }),
            required: fields.checkbox({ label: 'Requis' }),
          }),
          telephone: fields.object({
            label: fields.text({ label: 'Libellé' }),
            placeholder: fields.text({ label: 'Placeholder' }),
            required: fields.checkbox({ label: 'Requis' }),
          }),
          motivation: fields.object({
            label: fields.text({ label: 'Libellé' }),
            placeholder: fields.text({ label: 'Placeholder', multiline: true }),
            required: fields.checkbox({ label: 'Requis' }),
          }),
          infosPrioritaires: fields.object({
            label: fields.text({ label: 'Libellé' }),
            placeholder: fields.text({ label: 'Placeholder', multiline: true }),
            required: fields.checkbox({ label: 'Requis' }),
          }),
          besoinsSpecifiques: fields.object({
            label: fields.text({ label: 'Libellé' }),
            placeholder: fields.text({ label: 'Placeholder', multiline: true }),
            required: fields.checkbox({ label: 'Requis' }),
          }),
        }),
        button: fields.object({
          label: fields.text({ label: 'Libellé bouton' }),
          loading: fields.text({ label: 'Texte chargement' }),
        }),
        privacyNotice: fields.text({ label: 'Notice confidentialité', multiline: true }),
        successTitle: fields.text({ label: 'Titre succès' }),
        successMessage: fields.text({ label: 'Message succès', multiline: true }),
        signature: fields.text({ label: 'Signature' }),
        backButtonLabel: fields.text({ label: 'Libellé bouton retour' }),
        content: fields.mdx({ label: 'Contenu additionnel' }),
      },
    }),

    footer: singleton({
      label: 'Pied de page',
      path: 'src/content/footer/footer',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre' }),
        address: fields.text({ label: 'Adresse' }),
        city: fields.text({ label: 'Ville' }),
        membersTitle: fields.text({ label: 'Titre section membres' }),
        partnersTitle: fields.text({ label: 'Titre section partenaires' }),
        copyright: fields.text({ label: 'Copyright' }),
        tagline: fields.text({ label: 'Slogan' }),
        newsletterTitle: fields.text({ label: 'Titre newsletter' }),
        newsletterDescription: fields.text({ label: 'Description newsletter' }),
        newsletterPlaceholder: fields.text({ label: 'Placeholder newsletter' }),
        newsletterButton: fields.text({ label: 'Bouton newsletter' }),
        newsletterButtonLoading: fields.text({ label: 'Texte chargement newsletter' }),
        content: fields.mdx({
          label: 'Contenu pied de page',
          description: 'Liste des membres et partenaires',
        }),
      },
    }),

    notFound: singleton({
      label: 'Page 404',
      path: 'src/content/not-found/not-found',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre' }),
        message: fields.text({ label: 'Message', multiline: true }),
        backButtonLabel: fields.text({ label: 'Libellé bouton retour' }),
        content: fields.mdx({ label: 'Contenu additionnel' }),
      },
    }),

    // ==================== GUIDE SECTION ====================

    guideAccess: singleton({
      label: 'Page accès guide',
      path: 'src/content/guide-access/guide-access',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre' }),
        description: fields.text({ label: 'Description', multiline: true }),
        passwordPlaceholder: fields.text({ label: 'Placeholder mot de passe' }),
        submitButton: fields.text({ label: 'Libellé bouton' }),
        errorMessage: fields.text({ label: 'Message erreur' }),
        content: fields.mdx({ label: 'Contenu additionnel' }),
      },
    }),

    guideNavigation: singleton({
      label: 'Navigation guide',
      path: 'src/content/guide-navigation/guide-navigation',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre navigation' }),
        toggleMenuLabel: fields.text({ label: 'Libellé toggle menu' }),
        content: fields.mdx({ label: 'Contenu additionnel' }),
      },
    }),

    guide: singleton({
      label: 'Contenu du Guide',
      path: 'src/content/guide/guide',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        content: fields.mdx({
          label: 'Contenu du guide',
          description: 'Guide complet Habitat Beaver en markdown',
        }),
      },
    }),

    // ==================== HISTORIQUE SECTION ====================

    historiqueAccess: singleton({
      label: 'Page accès historique',
      path: 'src/content/historique-access/historique-access',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Titre' }),
        description: fields.text({ label: 'Description', multiline: true }),
        passwordPlaceholder: fields.text({ label: 'Placeholder mot de passe' }),
        submitButton: fields.text({ label: 'Libellé bouton' }),
        errorMessage: fields.text({ label: 'Message erreur' }),
        content: fields.mdx({ label: 'Contenu additionnel' }),
      },
    }),

    historique: singleton({
      label: 'Contenu historique',
      path: 'src/content/historique/historique',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        content: fields.mdx({
          label: 'Contenu historique',
          description: 'Contenu de la section historique',
        }),
      },
    }),
  },
});
