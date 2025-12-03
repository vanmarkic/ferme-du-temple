import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Calculs basés sur les paramètres du projet
// Surface: 80m²
// Prix achat total: 650 000€
// Surface totale estimée: ~610m² (donne ~1066€/m²)
// Prix achat 80m² = 80 × 1066 = ~85 000€
// Droits 12.5% = 85 000 × 0.125 = ~10 600€
// CASCO: 80m² × 1550€/m² × 1.06 TVA = ~131 440€
// Frais partagés: ~15 000€

const breakdown = [
  { label: 'Prix d\'achat (80m²)', amount: 85000, color: 'bg-blue-500' },
  { label: 'Droits enregistrement (12,5%)', amount: 10600, color: 'bg-purple-500' },
  { label: 'Travaux CASCO', amount: 132000, color: 'bg-amber-500', subtext: '80m² × 1 550€ × 1.06 TVA' },
  { label: 'Frais partagés', amount: 15000, color: 'bg-green-500' }
];

const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
const budget = 300000;
const marge = budget - total;

export default function CoupleExampleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const totalRef = useRef<HTMLDivElement>(null);
  const margeRef = useRef<HTMLDivElement>(null);

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

    // Profile card
    if (profileRef.current) {
      gsap.from(profileRef.current, {
        opacity: 0,
        x: -50,
        scrollTrigger: {
          trigger: profileRef.current,
          start: 'top 80%',
          end: 'top 60%',
          scrub: 1
        }
      });
    }

    // Lines appear one by one
    linesRef.current.forEach((line, index) => {
      if (!line) return;

      gsap.from(line, {
        opacity: 0,
        x: 50,
        scrollTrigger: {
          trigger: line,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      });
    });

    // Total
    if (totalRef.current) {
      gsap.from(totalRef.current, {
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: totalRef.current,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      });
    }

    // Marge (positive message)
    if (margeRef.current) {
      gsap.from(margeRef.current, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: margeRef.current,
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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-900 to-slate-800"
    >
      <div className="max-w-5xl mx-auto w-full">
        <h2
          ref={titleRef}
          className="text-3xl md:text-5xl font-bold text-center mb-12"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Exemple : Couple avec enfant
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Profile card */}
          <div
            ref={profileRef}
            className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-3xl p-8 border border-blue-500/30"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-5xl">👨‍👩‍👧</span>
              </div>
            </div>

            {/* Info */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">Couple avec enfant</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Surface</span>
                  <span className="text-xl font-bold text-white">80m²</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Budget max</span>
                  <span className="text-xl font-bold text-blue-400">300 000€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-300 mb-4">Décomposition</h3>

            {breakdown.map((item, index) => (
              <div
                key={item.label}
                ref={(el) => { linesRef.current[index] = el; }}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-xl font-mono text-white">{formatCurrency(item.amount)}</span>
                </div>
                {item.subtext && (
                  <p className="text-xs text-slate-500">{item.subtext}</p>
                )}
                {/* Progress bar */}
                <div className="h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.amount / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Total */}
            <div
              ref={totalRef}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 border-2 border-blue-500/50 mt-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">TOTAL</span>
                <span className="text-2xl font-bold font-mono text-blue-400">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Marge positive */}
            <div
              ref={margeRef}
              className="bg-green-500/20 rounded-xl p-4 border border-green-500/30"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="text-green-400 font-bold">
                    Budget 300k€ → Marge de {formatCurrency(marge)}
                  </p>
                  <p className="text-sm text-green-300/70">
                    Pour finitions personnalisées ou atelier partagé
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
