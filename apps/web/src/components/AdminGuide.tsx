import { AdminSidebar } from './AdminSidebar';

const DRIVE_BASE_URL = 'https://drive.google.com/drive/folders/1bAAUo8qFu1KaRZ22o_r4EGzoysJea19w';

export function AdminGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 flex flex-col md:flex-row">
      <AdminSidebar currentPage="guide" />
      <div className="flex-1 p-4 md:p-6 pt-20 md:pt-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header accent bar */}
          <div className="w-16 md:w-20 h-2 bg-magenta mb-6 md:mb-8" />

          <h1 className="text-3xl md:text-5xl font-black text-rich-black mb-2 tracking-tight">
            Guide Drive Beaver
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-6 md:mb-8">
            Bienvenue sur le Drive partage d'Habitat Beaver !
          </p>

          {/* Intro box */}
          <div className="bg-butter-yellow p-6 mb-8 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-magenta" />
            <p className="ml-2">
              Ce document t'aide a naviguer et comprendre l'organisation de nos fichiers.
            </p>
          </div>

          {/* Table of contents */}
          <nav className="bg-white p-6 border-2 border-rich-black mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-magenta mb-4">
              Sommaire
            </h2>
            <ul className="space-y-0">
              {[
                { href: '#principe', label: 'Principe d\'organisation' },
                { href: '#plan', label: 'Plan du Drive' },
                { href: '#raccourcis', label: 'Raccourcis' },
                { href: '#commencer', label: 'Par ou commencer ?' },
                { href: '#source', label: 'Documents SOURCE' },
                { href: '#pratiques', label: 'Bonnes pratiques' },
              ].map((item, i, arr) => (
                <li
                  key={item.href}
                  className={`py-3 ${i < arr.length - 1 ? 'border-b border-warm-beige' : ''}`}
                >
                  <a
                    href={item.href}
                    className="text-text-dark font-medium hover:text-magenta transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <hr className="border-none h-0.5 bg-warm-beige my-10" />

          {/* Principe d'organisation */}
          <section id="principe">
            <h2 className="text-2xl font-bold text-rich-black mb-4 pl-4 border-l-4 border-magenta">
              Principe d'organisation
            </h2>
            <p className="mb-6">Notre Drive est organise selon <strong>deux logiques</strong> :</p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 border-2 border-magenta bg-white">
                <h3 className="text-lg font-semibold text-magenta mb-1">SOURCE/</h3>
                <p className="text-sm text-gray-500 italic mb-3">La memoire du projet</p>
                <p className="font-semibold mb-2">On consulte souvent, on modifie rarement</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Charte, statuts, valeurs</li>
                  <li>Modeles financiers valides</li>
                  <li>Documentation sur le lieu</li>
                  <li>Plans architecturaux</li>
                </ul>
              </div>
              <div className="p-6 border-2 border-butter-yellow bg-white">
                <h3 className="text-lg font-semibold text-text-dark mb-1">Autres dossiers</h3>
                <p className="text-sm text-gray-500 italic mb-3">Le travail quotidien</p>
                <p className="font-semibold mb-2">Modifie regulierement</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Reunions en cours</li>
                  <li>Projets des GT</li>
                  <li>Communications</li>
                  <li>Administration courante</li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-none h-0.5 bg-warm-beige my-10" />

          {/* Plan du Drive */}
          <section id="plan">
            <h2 className="text-2xl font-bold text-rich-black mb-4 pl-4 border-l-4 border-magenta">
              Plan du Drive
            </h2>

            <a
              href={DRIVE_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-magenta text-white px-6 py-3 font-semibold hover:bg-magenta-dark transition-colors mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.71 3.5L1.15 15l4.58 7.5h13.54l4.58-7.5L17.29 3.5H7.71zm-.35 1h9.28l5.5 9.5H2.86l5.5-9.5zm4.64 2a.5.5 0 00-.43.75l3 5.25a.5.5 0 00.86 0l3-5.25a.5.5 0 00-.43-.75h-6z"/>
              </svg>
              Ouvrir le Drive Beaver
            </a>

            <DriveTree driveUrl={DRIVE_BASE_URL} />

            {/* Detail tables */}
            <h3 className="text-lg font-semibold mt-8 mb-3">SOURCE/ - Detail</h3>
            <Table
              headers={['Sous-dossier', 'Contenu']}
              rows={[
                ['Gouvernance/', 'Charte, processus decision, roles'],
                ['Finance/', 'Budget, repartition lots, credit Castor'],
                ['Projet-Archi/', 'Plans, devis, programmation'],
                ['Ferme-du-Temple/', 'Histoire, photos, doc technique'],
              ]}
            />

            <h3 className="text-lg font-semibold mt-8 mb-3">Groupes de Travail/ - Detail</h3>
            <Table
              headers={['GT', 'Mission']}
              rows={[
                ['Accueil', 'Integration nouveaux membres, candidatures'],
                ['Architectes', 'Suivi projet architectural'],
                ['Finance', 'Montage financier, banques'],
                ['Gouvernance', 'Organisation interne'],
                ['Investisseurs', 'Relations avec investisseurs'],
                ['Planification', 'Planning general, strategie'],
              ]}
            />

            <h3 className="text-lg font-semibold mt-8 mb-3">Reunions/ - Detail</h3>
            <Table
              headers={['Sous-dossier', 'Contenu']}
              rows={[
                ['PV & ODJ/', 'Tous les ordres du jour et proces-verbaux'],
                ['Enregistrements/', 'Enregistrements Google Meet'],
                ['Frigo/', 'Sujets mis de cote pour plus tard'],
              ]}
            />
          </section>

          <hr className="border-none h-0.5 bg-warm-beige my-10" />

          {/* Raccourcis */}
          <section id="raccourcis">
            <h2 className="text-2xl font-bold text-rich-black mb-4 pl-4 border-l-4 border-magenta">
              Raccourcis (→)
            </h2>
            <p className="mb-4">Des raccourcis a la racine permettent d'acceder rapidement aux dossiers frequents :</p>
            <Table
              headers={['Raccourci', 'Destination']}
              rows={[
                ['→ SOURCE', 'Dossier SOURCE'],
                ['→ GT Accueil', 'Groupes de Travail/Accueil'],
                ['→ GT Finance', 'Groupes de Travail/Finance'],
                ['→ PV & ODJ', 'Reunions/PV & ODJ'],
              ]}
            />
          </section>

          <hr className="border-none h-0.5 bg-warm-beige my-10" />

          {/* Par ou commencer */}
          <section id="commencer">
            <h2 className="text-2xl font-bold text-rich-black mb-4 pl-4 border-l-4 border-magenta">
              Par ou commencer ?
            </h2>

            <TipBox title="Nouveau membre ?">
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>SOURCE/Gouvernance/Charte/</strong> — Nos valeurs et engagements</li>
                <li><strong>SOURCE/Ferme-du-Temple/</strong> — Decouvrir le lieu</li>
                <li><strong>SOURCE/Finance/Repartition-lots/</strong> — Comprendre le montage</li>
              </ol>
            </TipBox>

            <Table
              headers={['Tu es...', 'Commence par...']}
              rows={[
                ['Nouveau membre', 'SOURCE/Gouvernance/Charte/'],
                ['Membre actif', 'Reunions/PV & ODJ/ + ton GT'],
                ['En recherche d\'un doc de reference', 'SOURCE/'],
                ['En recherche d\'un doc recent', 'Groupes de Travail/'],
              ]}
            />
          </section>

          <hr className="border-none h-0.5 bg-warm-beige my-10" />

          {/* SOURCE section (from INDEX SOURCE) */}
          <section id="source">
            <h2 className="text-2xl font-bold text-rich-black mb-4 pl-4 border-l-4 border-magenta">
              Documents SOURCE
            </h2>

            <div className="bg-butter-yellow p-6 mb-8 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-magenta" />
              <p className="ml-2">
                <strong className="block mb-2">On consulte souvent, on modifie rarement.</strong>
                Ce dossier contient les documents fondateurs, stabilises et de reference du projet Habitat Beaver.
              </p>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-3 flex items-center gap-3">
              <span className="w-8 h-8 bg-magenta text-white flex items-center justify-center font-bold text-sm">1</span>
              Gouvernance/
            </h3>
            <p className="mb-3">Documents definissant comment on fonctionne ensemble.</p>
            <Table
              headers={['Document', 'Description']}
              rows={[
                ['Charte/', 'Valeurs, engagements, vision commune'],
                ['Processus-decision/', 'Comment on prend des decisions (roles en reunion, etc.)'],
                ['Carte mentale gouvernance', 'Vue d\'ensemble de notre organisation'],
                ['Les GT.docx', 'Structure et role des Groupes de Travail'],
                ['RECAPITULATIF...', 'Gouvernance strategique, operationnelle, regulation'],
              ]}
            />

            <h3 className="text-lg font-semibold mt-8 mb-3 flex items-center gap-3">
              <span className="w-8 h-8 bg-magenta text-white flex items-center justify-center font-bold text-sm">2</span>
              Finance/
            </h3>
            <p className="mb-3">Modeles financiers et projections stabilisees.</p>
            <Table
              headers={['Sous-dossier', 'Contenu']}
              rows={[
                ['Budget-previsionnel/', 'Budget global, projections de faisabilite (V8)'],
                ['Repartition-lots/', 'Schema de projection - comment on divise les couts'],
                ['Credit-Castor/', 'Calculateurs pour le credit collectif'],
                ['Formes Juridiques/', 'Documentation sur les structures juridiques possibles'],
              ]}
            />

            <h3 className="text-lg font-semibold mt-8 mb-3 flex items-center gap-3">
              <span className="w-8 h-8 bg-magenta text-white flex items-center justify-center font-bold text-sm">3</span>
              Projet-Archi/
            </h3>
            <p className="mb-3">Plans et documentation technique du projet architectural.</p>
            <Table
              headers={['Sous-dossier', 'Contenu']}
              rows={[
                ['Plans/', 'Plans architecturaux de la Ferme'],
                ['Devis/', 'Devis geometres et autres'],
                ['Programmation Archi', 'Besoins et espaces programmes'],
                ['OSA_WAU227...', 'Document de delegation maitrise d\'ouvrage'],
              ]}
            />

            <h3 className="text-lg font-semibold mt-8 mb-3 flex items-center gap-3">
              <span className="w-8 h-8 bg-magenta text-white flex items-center justify-center font-bold text-sm">4</span>
              Ferme-du-Temple/
            </h3>
            <p className="mb-3">Tout ce qu'il faut savoir sur le lieu.</p>
            <Table
              headers={['Sous-dossier', 'Contenu']}
              rows={[
                ['Histoire/', 'Sources historiques, documents d\'archives, carnet Godin'],
                ['Photos/', 'Photos du batiment (par zone, fissures, etc.)'],
                ['Doc-technique/', 'Analyses sol, merule, diagnostics'],
                ['Presentation FDT...', 'Presentation officielle (InDesign)'],
              ]}
            />
          </section>

          <hr className="border-none h-0.5 bg-warm-beige my-10" />

          {/* Bonnes pratiques */}
          <section id="pratiques">
            <h2 className="text-2xl font-bold text-rich-black mb-4 pl-4 border-l-4 border-magenta">
              Bonnes pratiques
            </h2>
            <Table
              headers={['Regle', 'Exemple']}
              rows={[
                ['Nommer clairement', '20251128 - PV reunion.docx'],
                ['Ranger au bon endroit', 'Actif → GT, Stabilise → SOURCE'],
                ['Pas de fichiers a la racine', 'Tout va dans un dossier'],
                ['Archiver l\'obsolete', '→ _Archives/'],
              ]}
            />
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t-2 border-warm-beige text-sm text-gray-500">
            Derniere mise a jour : Novembre 2025
          </footer>
        </div>
      </div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse bg-white min-w-[300px]">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="bg-rich-black text-white font-semibold uppercase text-xs tracking-wide p-2 md:p-3 text-left border border-warm-beige"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-soft-cream' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="p-2 md:p-3 border border-warm-beige text-sm md:text-base">
                  {j === 0 ? <strong className="text-magenta-dark">{cell}</strong> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TipBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-butter-yellow border-l-4 border-l-magenta p-6 mb-6">
      <strong className="block mb-3 text-magenta-dark">{title}</strong>
      {children}
    </div>
  );
}

function DriveTree({ driveUrl }: { driveUrl: string }) {
  const Line = ({ children }: { children: React.ReactNode }) => (
    <div className="flex">{children}</div>
  );
  const Comment = ({ children }: { children: React.ReactNode }) => (
    <span className="text-magenta/70">{children}</span>
  );
  const Link = ({ children }: { children: React.ReactNode }) => (
    <a href={driveUrl} target="_blank" rel="noopener noreferrer" className="text-white bg-magenta/30 px-1 underline decoration-magenta decoration-2 underline-offset-2 hover:bg-magenta hover:text-white hover:decoration-white transition-colors">
      {children}
    </a>
  );

  return (
    <pre className="bg-rich-black text-butter-yellow p-3 md:p-6 font-mono text-[10px] md:text-xs leading-relaxed overflow-x-auto mb-6 whitespace-pre">
      <Line>DRIVE BEAVER/</Line>
      <Line>│</Line>
      <Line>├── <Link>SOURCE/</Link>                    <Comment>← REFERENCE</Comment></Line>
      <Line>│   ├── Gouvernance/</Line>
      <Line>│   ├── Finance/</Line>
      <Line>│   ├── Projet-Archi/</Line>
      <Line>│   └── Ferme-du-Temple/</Line>
      <Line>│</Line>
      <Line>├── <Link>Groupes de Travail/</Link>        <Comment>← TRAVAIL ACTIF</Comment></Line>
      <Line>│   ├── Accueil/</Line>
      <Line>│   ├── Architectes/</Line>
      <Line>│   ├── Finance/</Line>
      <Line>│   ├── Gouvernance/</Line>
      <Line>│   ├── Investisseurs/</Line>
      <Line>│   └── Planification/</Line>
      <Line>│</Line>
      <Line>├── <Link>Reunions/</Link>                  <Comment>← VIE COLLECTIVE</Comment></Line>
      <Line>│   ├── PV &amp; ODJ/</Line>
      <Line>│   ├── Enregistrements/</Line>
      <Line>│   └── Frigo/</Line>
      <Line>│</Line>
      <Line>├── Ferme du temple/           <Comment>← ACQUISITION</Comment></Line>
      <Line>│   └── Acquisition/</Line>
      <Line>│</Line>
      <Line>├── Admin &amp; Compta/            <Comment>← GESTION</Comment></Line>
      <Line>│   ├── Administratif/</Line>
      <Line>│   └── Comptabilite/</Line>
      <Line>│</Line>
      <Line>├── Communication/             <Comment>← EXTERNE</Comment></Line>
      <Line>│   ├── Templates/</Line>
      <Line>│   ├── Presentations/</Line>
      <Line>│   ├── Contacts/</Line>
      <Line>│   └── Site Web/</Line>
      <Line>│</Line>
      <Line>├── Documentation/             <Comment>← RESSOURCES</Comment></Line>
      <Line>├── Partenaires/               <Comment>← PARTENAIRES</Comment></Line>
      <Line>├── Photos/                    <Comment>← MEDIATHEQUE</Comment></Line>
      <Line>└── _Archives/                 <Comment>← HISTORIQUE</Comment></Line>
    </pre>
  );
}
