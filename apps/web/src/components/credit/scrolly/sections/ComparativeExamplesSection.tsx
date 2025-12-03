import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Couple avec enfant - 80m²
const coupleBreakdown = [
  { label: 'Prix d\'achat', amount: 85000 },
  { label: 'Droits enregistrement', amount: 10600 },
  { label: 'Travaux CASCO', amount: 132000, subtext: '80m² × 1 550€ × 1.06 TVA' },
  { label: 'Frais partagés', amount: 15000 }
];

// Maman seule - 55m²
const mamanBreakdown = [
  { label: 'Prix d\'achat', amount: 58000 },
  { label: 'Droits enregistrement', amount: 7300 },
  { label: 'Travaux CASCO', amount: 90000, subtext: '55m² × 1 550€ × 1.06 TVA' },
  { label: 'Frais partagés', amount: 15000 }
];

const coupleTotal = coupleBreakdown.reduce((sum, item) => sum + item.amount, 0);
const mamanTotal = mamanBreakdown.reduce((sum, item) => sum + item.amount, 0);

const coupleBudget = 300000;
const mamanBudget = 200000;

const coupleMarge = coupleBudget - coupleTotal;
const mamanMarge = mamanBudget - mamanTotal;

const profiles = [
  {
    id: 'couple',
    title: 'Couple avec enfant',
    icon: '👨‍👩‍👧',
    surface: '80m²',
    budget: coupleBudget,
    breakdown: coupleBreakdown,
    total: coupleTotal,
    marge: coupleMarge,
    bgColor: 'bg-magenta',
    accentColor: 'butter-yellow'
  },
  {
    id: 'maman',
    title: 'Maman seule',
    icon: '👩‍👧',
    surface: '55m²',
    budget: mamanBudget,
    breakdown: mamanBreakdown,
    total: mamanTotal,
    marge: mamanMarge,
    bgColor: 'bg-butter-yellow',
    accentColor: 'magenta'
  }
];

export default function ComparativeExamplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const profilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const breakdownRowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const totalsRef = useRef<(HTMLDivElement | null)[]>([]);
  const margesRef = useRef<(HTMLDivElement | null)[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);

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

    // Breakdown rows appear together
    breakdownRowsRef.current.forEach((row) => {
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

    // Totals
    totalsRef.current.forEach((total) => {
      if (!total) return;
      gsap.from(total, {
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: total,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      });
    });

    // Marges
    margesRef.current.forEach((marge) => {
      if (!marge) return;
      gsap.from(marge, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: marge,
          start: 'top 90%',
          end: 'top 75%',
          scrub: 1
        }
      });
    });

    // Message
    if (messageRef.current) {
      gsap.from(messageRef.current, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: messageRef.current,
          start: 'top 90%',
          end: 'top 75%',
          scrub: 1
        }
      });
    }

  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-BE') + '€';
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
              className={`${profile.bgColor} p-6 text-center`}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <span className="text-3xl">{profile.icon}</span>
                </div>
                <div className="text-left">
                  <h3 className={`text-xl font-display font-bold ${profile.bgColor === 'bg-magenta' ? 'text-white' : 'text-rich-black'}`}>
                    {profile.title}
                  </h3>
                  <p className={`text-sm ${profile.bgColor === 'bg-magenta' ? 'text-white/70' : 'text-rich-black/70'}`}>
                    {profile.surface} • Budget {formatCurrency(profile.budget)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown comparison - row by row */}
        <div className="space-y-3">
          {/* Header row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <span className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wide">
                Couple avec enfant
              </span>
            </div>
            <div className="text-center">
              <span className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wide">
                Maman seule
              </span>
            </div>
          </div>

          {/* Cost rows */}
          {coupleBreakdown.map((item, rowIndex) => (
            <div
              key={item.label}
              ref={(el) => { breakdownRowsRef.current[rowIndex] = el; }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Couple column */}
              <div className="bg-white border-2 border-rich-black/10 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-rich-black text-sm">{item.label}</span>
                  <span className="text-lg font-mono text-rich-black font-bold">
                    {formatCurrency(coupleBreakdown[rowIndex].amount)}
                  </span>
                </div>
                {coupleBreakdown[rowIndex].subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{coupleBreakdown[rowIndex].subtext}</p>
                )}
              </div>

              {/* Maman column */}
              <div className="bg-white border-2 border-rich-black/10 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-rich-black text-sm">{item.label}</span>
                  <span className="text-lg font-mono text-rich-black font-bold">
                    {formatCurrency(mamanBreakdown[rowIndex].amount)}
                  </span>
                </div>
                {mamanBreakdown[rowIndex].subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{mamanBreakdown[rowIndex].subtext}</p>
                )}
              </div>
            </div>
          ))}

          {/* Totals row */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {profiles.map((profile, index) => (
              <div
                key={`total-${profile.id}`}
                ref={(el) => { totalsRef.current[index] = el; }}
                className="bg-rich-black p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-display font-bold">TOTAL</span>
                  <span className="text-2xl font-bold font-mono text-butter-yellow">
                    {formatCurrency(profile.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Marge row */}
          <div className="grid md:grid-cols-2 gap-6">
            {profiles.map((profile, index) => (
              <div
                key={`marge-${profile.id}`}
                ref={(el) => { margesRef.current[index] = el; }}
                className="bg-nature-leaf p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="text-rich-black font-bold">
                      Marge de {formatCurrency(profile.marge)}
                    </p>
                    <p className="text-sm text-rich-black/70">
                      Pour finitions et imprévus
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message collectif */}
        <div
          ref={messageRef}
          className="mt-12 p-6 bg-magenta/10 border-2 border-magenta text-center"
        >
          <p className="text-lg text-rich-black">
            <span className="text-magenta font-bold">La vie en collectif permet de mutualiser :</span>
            <br />
            <span className="text-rich-black">buanderie, jardin, salle de jeux pour les enfants...</span>
          </p>
        </div>
      </div>
    </section>
  );
}
