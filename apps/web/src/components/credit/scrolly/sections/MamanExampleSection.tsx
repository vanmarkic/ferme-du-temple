import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Calculs basés sur les paramètres du projet
// Surface: 55m²
// Prix achat 55m² = 55 × 1066 = ~58 600€
// Droits 12.5% = 58 600 × 0.125 = ~7 325€
// CASCO: 55m² × 1550€/m² × 1.06 TVA = ~90 365€
// Frais partagés: ~15 000€

const breakdown = [
  { label: 'Prix d\'achat (55m²)', amount: 58000, color: 'bg-pink-500' },
  { label: 'Droits enregistrement (12,5%)', amount: 7300, color: 'bg-purple-500' },
  { label: 'Travaux CASCO', amount: 90000, color: 'bg-amber-500', subtext: '55m² × 1 550€ × 1.06 TVA' },
  { label: 'Frais partagés', amount: 15000, color: 'bg-green-500' }
];

const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
const budget = 200000;
const marge = budget - total;

export default function MamanExampleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const totalRef = useRef<HTMLDivElement>(null);
  const margeRef = useRef<HTMLDivElement>(null);
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

    // Marge
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

    // Message collectif
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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-800 to-slate-900"
    >
      <div className="max-w-5xl mx-auto w-full">
        <h2
          ref={titleRef}
          className="text-3xl md:text-5xl font-bold text-center mb-12"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
            Exemple : Maman seule
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Profile card */}
          <div
            ref={profileRef}
            className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-3xl p-8 border border-pink-500/30"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <span className="text-5xl">👩‍👧</span>
              </div>
            </div>

            {/* Info */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">Maman seule</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Surface</span>
                  <span className="text-xl font-bold text-white">55m²</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Budget</span>
                  <span className="text-xl font-bold text-pink-400">200 000€</span>
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
              className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-xl p-4 border-2 border-pink-500/50 mt-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">TOTAL</span>
                <span className="text-2xl font-bold font-mono text-pink-400">{formatCurrency(total)}</span>
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
                    Budget 200k€ → Marge de {formatCurrency(marge)}
                  </p>
                  <p className="text-sm text-green-300/70">
                    Pour finitions et imprévus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message sur la vie collective */}
        <div
          ref={messageRef}
          className="mt-12 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-center"
        >
          <p className="text-lg text-slate-300">
            <span className="text-pink-400">La vie en collectif permet de mutualiser :</span>
            <br />
            <span className="text-white">buanderie, jardin, salle de jeux pour les enfants...</span>
          </p>
        </div>
      </div>
    </section>
  );
}
