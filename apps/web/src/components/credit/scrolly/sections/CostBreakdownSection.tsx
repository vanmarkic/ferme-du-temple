import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const costComponents = [
  {
    id: 'achat',
    title: 'Prix d\'achat',
    description: 'Votre part du bâtiment (650 000€ total ÷ quotités)',
    icon: '🏠',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'droits',
    title: 'Droits d\'enregistrement',
    description: '3% ou 12,5% selon votre situation',
    subtext: 'Récupération possible de 60% si revente du 1er bien dans les 2 ans',
    icon: '📋',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'travaux',
    title: 'Travaux rénovation',
    description: 'CASCO : 1 400 - 1 700€/m² HTVA',
    subtext: 'Isolation chanvre, peinture argile, géothermie...',
    icon: '🔨',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'partages',
    title: 'Frais partagés',
    description: 'Frais généraux, honoraires architectes',
    subtext: 'Répartis équitablement entre tous',
    icon: '🤝',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  }
];

export default function CostBreakdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const plusSignsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Title animation
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        }
      });
    }

    // Subtitle animation
    if (subtitleRef.current) {
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 1
        }
      });
    }

    // Cards stack up one by one
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.from(card, {
        opacity: 0,
        x: -100,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 60%',
          scrub: 1
        }
      });
    });

    // Plus signs appear
    plusSignsRef.current.forEach((plus) => {
      if (!plus) return;

      gsap.from(plus, {
        opacity: 0,
        scale: 0,
        scrollTrigger: {
          trigger: plus,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      });
    });

  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-800 to-slate-900"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold text-center mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
            Combien ça coûte ?
          </span>
        </h2>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-slate-300 text-center max-w-3xl mx-auto mb-12"
        >
          Pas de surprise : voici ce qui compose le prix.
          <br />
          <span className="text-slate-400">Chaque euro est traçable.</span>
        </p>

        {/* Formula header */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <p className="text-lg text-white font-mono">
              <span className="text-slate-400">VOTRE COÛT TOTAL</span> = <span className="text-amber-400">4 composantes</span>
            </p>
          </div>
        </div>

        {/* Cost cards */}
        <div className="space-y-4">
          {costComponents.map((cost, index) => (
            <div key={cost.id}>
              {/* Plus sign (except first) */}
              {index > 0 && (
                <div
                  ref={(el) => { plusSignsRef.current[index - 1] = el; }}
                  className="flex justify-center my-3"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-2xl text-slate-300">+</span>
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                ref={(el) => { cardsRef.current[index] = el; }}
                className={`${cost.bgColor} rounded-2xl p-6 border ${cost.borderColor}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cost.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-2xl">{cost.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {cost.title}
                    </h3>
                    <p className="text-slate-300">
                      {cost.description}
                    </p>
                    {cost.subtext && (
                      <p className="text-sm text-slate-400 mt-1">
                        {cost.subtext}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note about droits */}
        <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <p className="text-sm text-purple-300 text-center">
            <strong>💡 Bon à savoir :</strong> Les droits d'enregistrement sont de 12,5% en Wallonie,
            mais vous pouvez récupérer 60% si vous revendez votre premier bien dans les 2 ans.
          </p>
        </div>
      </div>
    </section>
  );
}
