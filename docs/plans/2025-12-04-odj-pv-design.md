# Design : Outil ODJ & PV

## Résumé

Outil de gestion des réunions BEAVER avec :
- Création d'ordres du jour (ODJ) avec drag & drop
- Prise de notes en temps réel avec autosave
- Finalisation avec envoi de missions par email
- Base de données des décisions classées par importance

Route : `/admin/odj-pv`

## Stack technique

- **Frontend** : Astro + React (existant)
- **Base de données** : Supabase (existant)
- **Export DOCX** : librairie `docx` (npm)
- **Emails** : Resend (existant)

## Tables Supabase

```sql
-- Membres BEAVER
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Historique des rôles (pour règle d'écart maximal)
CREATE TABLE member_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id),
  meeting_id UUID REFERENCES meetings(id),
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Réunions
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  what_to_bring TEXT,
  status TEXT DEFAULT 'draft', -- draft | odj_ready | in_progress | finalized
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sujets de l'ordre du jour
CREATE TABLE agenda_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  responsible TEXT,
  duration_minutes INTEGER DEFAULT 5,
  methodology TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Versions automatiques (snapshots pour recovery)
CREATE TABLE meeting_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  snapshot_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Décisions
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  agenda_item_id UUID REFERENCES agenda_items(id),
  content TEXT NOT NULL,
  impact_level TEXT NOT NULL, -- long_term | medium_term | daily
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Missions assignées
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  agenda_item_id UUID REFERENCES agenda_items(id),
  member_id UUID REFERENCES members(id),
  description TEXT NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Rôles tournants

Liste des rôles :
- Président.e (+ co-président.e = même rôle)
- Secrétaire
- Gestionnaire de la parole
- Maître.sse du temps
- Serpent
- Plage

### Algorithme de suggestion

Optimise l'écart temporel maximal entre 2 occurrences identiques :

1. Pour chaque rôle à attribuer, calculer un score pour chaque membre
2. Score = nombre de réunions depuis la dernière fois qu'il a eu ce rôle
3. Jamais eu le rôle → score maximum (prioritaire)
4. Attribution globale optimisée pour maximiser l'écart moyen

```typescript
function suggestRoles(members: Member[], roleHistory: RoleHistory[]): RoleSuggestion {
  const roles = ['president', 'secretaire', 'parole', 'temps', 'serpent', 'plage'];
  const suggestions: Record<string, string[]> = {};
  const assigned = new Set<string>();

  for (const role of roles) {
    const scores = members
      .filter(m => !assigned.has(m.id))
      .map(member => {
        const lastOccurrence = findLastRoleOccurrence(member.id, role, roleHistory);
        const gap = lastOccurrence === -1 ? Infinity : roleHistory.length - lastOccurrence;
        return { member, gap };
      })
      .sort((a, b) => b.gap - a.gap);

    const selected = scores[0].member;
    suggestions[role] = [selected.id];
    assigned.add(selected.id);
  }

  return suggestions;
}
```

## Interfaces

### 1. Liste des réunions (`/admin/odj-pv`)

- Réunions à venir avec statut (ODJ, En cours)
- Réunions passées (Finalisé)
- Bouton "Nouvelle réunion"
- Lien vers page décisions

### 2. Mode ODJ (préparation)

- Infos réunion : date, horaires, lieu, quoi apporter
- Rôles tournants avec suggestion auto et alerte si écart faible
- Liste des sujets avec drag & drop pour réordonner
- Édition inline : titre, responsable, durée, méthodologie
- Durée totale calculée automatiquement
- Export DOCX de l'ODJ
- Bouton "Passer en mode PV"

### 3. Mode PV (prise de notes)

- Timer global de la réunion
- Accès aux versions : T-5min, T-10min, T-20min, T-30min, puis toutes les 10min
- Pour chaque sujet :
  - Timer individuel avec Start/Pause
  - Zone de notes libre
  - Boutons "+ Décision" et "+ Mission"
- Autosave toutes les 10 secondes
- Export DOCX brouillon
- Boutons "Retour ODJ" et "Finaliser"

### 4. Mode Finalisation

- Résumé des décisions par niveau d'importance (🔴 long terme, 🟠 moyen terme, 🟡 quotidien)
- Liste des missions avec checkbox pour sélection envoi email
- Aperçu du mail avant envoi
- Export DOCX final
- Bouton "Envoyer les emails"
- Bouton "Clôturer" (sauvegarde définitive)

### 5. Page Décisions (`/admin/odj-pv/decisions`)

- Historique filtrable par année et niveau d'importance
- Recherche textuelle
- Export possible

## Système de versioning

Versions créées automatiquement pendant la prise de notes :
- Sauvegarde toutes les 10 secondes (écrase la précédente si < 5min)
- Versions conservées : T-5min, T-10min, T-20min, T-30min
- Puis une version toutes les 10 minutes
- Nettoyage des versions intermédiaires à la finalisation (garde uniquement les jalons)

```typescript
async function autoSave(meetingId: string, data: MeetingSnapshot) {
  const now = new Date();
  const lastVersion = await getLastVersion(meetingId);

  // Toujours sauvegarder la version courante
  await upsertCurrentSnapshot(meetingId, data);

  // Créer version jalonnée si seuil atteint
  if (lastVersion) {
    const gap = (now - lastVersion.created_at) / 1000 / 60; // minutes
    if (gap >= 5 && !hasVersionAt(meetingId, 5)) {
      await createVersionSnapshot(meetingId, data, 'T-5');
    }
    // ... etc pour T-10, T-20, T-30, puis toutes les 10min
  }
}
```

## Structure des fichiers

```
apps/web/src/
├── pages/admin/odj-pv/
│   ├── index.astro          # Liste des réunions
│   ├── [id].astro           # Détail réunion (ODJ/PV/Finalisation)
│   └── decisions.astro      # Historique décisions
├── components/odj-pv/
│   ├── MeetingList.tsx
│   ├── MeetingForm.tsx
│   ├── AgendaEditor.tsx     # Mode ODJ avec drag & drop
│   ├── RoleSuggester.tsx    # Attribution des rôles
│   ├── NoteTaker.tsx        # Mode PV
│   ├── TimerWidget.tsx
│   ├── DecisionForm.tsx
│   ├── MissionForm.tsx
│   ├── Finalizer.tsx        # Mode finalisation
│   ├── VersionHistory.tsx
│   └── DocxExporter.tsx
├── lib/odj-pv/
│   ├── supabase.ts          # Requêtes BDD
│   ├── roles.ts             # Algorithme suggestion rôles
│   ├── versioning.ts        # Gestion versions
│   ├── docx-generator.ts    # Génération DOCX
│   └── email.ts             # Envoi missions
└── api/odj-pv/
    ├── meetings.ts
    ├── autosave.ts
    └── send-missions.ts
```

## Format DOCX

Reproduit la structure du document exemple :
- En-tête : "RÉUNION HABITAT BEAVER PRÉSENTIELLE DU [date]"
- Titre : "ORDRE DU JOUR et P.V."
- Tableau infos : horaires, lieu, quoi apporter
- Tableau rôles tournants
- Rappel gouvernance (texte fixe)
- Rappel fonctionnement (texte fixe)
- Tableau ODJ avec colonnes : Points, Qui?, Temps?, Méthodologie, P.V., Missions et Décisions
- Mise en forme : missions en jaune, décisions en rouge
