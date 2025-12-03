import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Données basées sur le simulateur de crédit
// Couple avec enfant - 80m² - Entrée 01/02/2027
const coupleData = {
  id: 'couple',
  title: 'Couple avec enfant',
  icon: '👨‍👩‍👧',
  surface: '80m²',
  unite: 'Unité 7',
  entree: '01/02/2027',
  bgColor: 'bg-magenta',
  textColor: 'text-white',
  // Parcours de paiement
  signature: {
    label: 'Signature',
    subtitle: 'Je deviens propriétaire',
    amount: 86647,
    icon: '🔑'
  },
  construction: {
    label: 'Construction',
    subtitle: 'Mon logement prend forme',
    amount: 164876,
    icon: '🏗️'
  },
  emmenagement: {
    label: 'Emménagement',
    subtitle: 'J\'emménage chez moi',
    amount: 40000,
    icon: '🏠'
  },
  // Financement
  coutTotal: 291523,
  aEmprunter: 161479,
  capitalPropre: 100000,
  mensualite: 886,
  tauxInteret: 4,
  duree: 25
};

// Maman seule - 55m²
const mamanData = {
  id: 'maman',
  title: 'Maman seule',
  icon: '👩‍👧',
  surface: '55m²',
  unite: 'Unité 4',
  entree: '01/02/2027',
  bgColor: 'bg-butter-yellow',
  textColor: 'text-rich-black',
  // Parcours de paiement (proportionnel)
  signature: {
    label: 'Signature',
    subtitle: 'Je deviens propriétaire',
    amount: 65300,
    icon: '🔑'
  },
  construction: {
    label: 'Construction',
    subtitle: 'Mon logement prend forme',
    amount: 105000,
    icon: '🏗️'
  },
  emmenagement: {
    label: 'Emménagement',
    subtitle: 'J\'emménage chez moi',
    amount: 30000,
    icon: '🏠'
  },
  // Financement
  coutTotal: 200300,
  aEmprunter: 120300,
  capitalPropre: 80000,
  mensualite: 635,
  tauxInteret: 4,
  duree: 25
};

const profiles = [coupleData, mamanData];

export default function ComparativeExamplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const profilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const parcoursRef = useRef<(HTMLDivElement | null)[]>([]);
  const financementRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Title
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        }
      });
    }

    // Profile cards
    profilesRef.current.forEach((profile, index) => {
      if (!profile) return;
      gsap.from(profile, {
        opacity: 0,
        x: index === 0 ? -50 : 50,
        scrollTrigger: {
          trigger: profile,
          start: 'top 80%',
          end: 'top 60%',
          scrub: 1
        }
      });
    });

    // Parcours rows
    parcoursRef.current.forEach((row) => {
      if (!row) return;
      gsap.from(row, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      });
    });

    // Financement rows
    financementRef.current.forEach((row) => {
      if (!row) return;
      gsap.from(row, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: row,
          start: 'top 90%',
          end: 'top 75%',
          scrub: 1
        }
      });
    });

  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-BE') + ' €';
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-background"
    >
      <div className="max-w-6xl mx-auto w-full">
        <h2
          ref={titleRef}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-12 text-rich-black"
        >
          Deux exemples concrets
        </h2>

        {/* Profile headers side by side */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              ref={(el) => { profilesRef.current[index] = el; }}
              className={`${profile.bgColor} p-6`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">{profile.icon}</span>
                </div>
                <div>
                  <h3 className={`text-xl font-display font-bold ${profile.textColor}`}>
                    {profile.title}
                  </h3>
                  <p className={`text-sm ${profile.textColor} opacity-70`}>
                    {profile.unite} • {profile.surface} • Entrée: {profile.entree}
                  </p>
                </div>
              </div>

              {/* Résumé financier */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className={`p-2 ${profile.textColor === 'text-white' ? 'bg-white/10' : 'bg-rich-black/5'}`}>
                  <p className={`text-xs ${profile.textColor} opacity-60`}>Coût Total</p>
                  <p className={`text-sm font-bold ${profile.textColor}`}>{formatCurrency(profile.coutTotal)}</p>
                </div>
                <div className={`p-2 ${profile.textColor === 'text-white' ? 'bg-white/10' : 'bg-rich-black/5'}`}>
                  <p className={`text-xs ${profile.textColor} opacity-60`}>À emprunter</p>
                  <p className={`text-sm font-bold ${profile.textColor}`}>{formatCurrency(profile.aEmprunter)}</p>
                </div>
                <div className={`p-2 ${profile.textColor === 'text-white' ? 'bg-white/10' : 'bg-rich-black/5'}`}>
                  <p className={`text-xs ${profile.textColor} opacity-60`}>Mensualité</p>
                  <p className={`text-sm font-bold ${profile.textColor}`}>{profile.mensualite} €/mois</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Parcours de paiement - Timeline */}
        <div
          ref={(el) => { parcoursRef.current[0] = el; }}
          className="mb-8"
        >
          <h3 className="text-lg font-display font-bold text-rich-black mb-4 text-center">
            Parcours de paiement
          </h3>

          {/* Timeline progress bar */}
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            {profiles.map((profile) => (
              <div key={`timeline-${profile.id}`} className="flex items-center justify-between px-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-amber-500" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-green-500" />
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            ))}
          </div>

          {/* Phase cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <div key={`phases-${profile.id}`} className="space-y-3">
                {/* Signature */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{profile.signature.icon}</span>
                    <span className="font-display font-bold text-rich-black">{profile.signature.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{profile.signature.subtitle}</p>
                  <p className="text-xl font-mono font-bold text-rich-black mt-2">
                    {formatCurrency(profile.signature.amount)}
                  </p>
                </div>

                {/* Construction */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{profile.construction.icon}</span>
                    <span className="font-display font-bold text-rich-black">{profile.construction.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{profile.construction.subtitle}</p>
                  <p className="text-xl font-mono font-bold text-rich-black mt-2">
                    {formatCurrency(profile.construction.amount)}
                  </p>
                </div>

                {/* Emménagement */}
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{profile.emmenagement.icon}</span>
                    <span className="font-display font-bold text-rich-black">{profile.emmenagement.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{profile.emmenagement.subtitle}</p>
                  <p className="text-xl font-mono font-bold text-rich-black mt-2">
                    {formatCurrency(profile.emmenagement.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financement détaillé */}
        <div
          ref={(el) => { financementRef.current[0] = el; }}
          className="grid md:grid-cols-2 gap-6"
        >
          {profiles.map((profile, index) => (
            <div
              key={`financement-${profile.id}`}
              ref={(el) => { financementRef.current[index + 1] = el; }}
              className="bg-white border-2 border-rich-black/10 p-4"
            >
              <h4 className="font-display font-bold text-rich-black mb-3">
                Financement
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capital propre</span>
                  <span className="font-mono font-bold">{formatCurrency(profile.capitalPropre)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">À emprunter</span>
                  <span className="font-mono font-bold text-magenta">{formatCurrency(profile.aEmprunter)}</span>
                </div>
                <div className="border-t border-rich-black/10 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taux • Durée</span>
                    <span className="font-mono">{profile.tauxInteret}% • {profile.duree} ans</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Mensualité</span>
                    <span className="font-mono font-bold text-lg text-magenta">{profile.mensualite} €/mois</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-rich-black/5 border-l-4 border-rich-black/20">
          <p className="text-sm text-muted-foreground">
            Hypothèses : taux 4%, durée 25 ans, 2 prêts (signature + construction).
            Le simulateur complet permet d'ajuster tous les paramètres.
          </p>
        </div>
      </div>
    </section>
  );
}
