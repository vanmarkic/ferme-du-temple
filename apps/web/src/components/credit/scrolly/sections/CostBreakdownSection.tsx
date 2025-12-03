import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const costComponents = [
  {
    id: 'achat',
    title: 'Prix d\'achat',
    description: 'Votre part du bâtiment (650 000€ total ÷ quotités)',
    icon: '🏠',
    bgColor: 'bg-butter-yellow',
    textColor: 'text-rich-black'
  },
  {
    id: 'droits',
    title: 'Droits d\'enregistrement',
    description: '3% ou 12,5% selon votre situation',
    subtext: 'Récupération possible de 60% si revente du 1er bien dans les 2 ans',
    icon: '📋',
    bgColor: 'bg-magenta',
    textColor: 'text-white'
  },
  {
    id: 'travaux',
    title: 'Travaux rénovation',
    description: 'CASCO : 1 400 - 1 700€/m² HTVA',
    subtext: 'Isolation chanvre, peinture argile, géothermie...',
    icon: '🔨',
    bgColor: 'bg-nature-leaf',
    textColor: 'text-rich-black'
  },
  {
    id: 'partages',
    title: 'Frais partagés',
    description: 'Frais généraux, honoraires architectes',
    subtext: 'Répartis équitablement entre tous',
    icon: '🤝',
    bgColor: 'bg-butter-yellow',
    textColor: 'text-rich-black'
  }
];

export default function CostBreakdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
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

    // Cards stack up one by one
    cardsRef.current.forEach((card) => {
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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-background"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl font-display font-bold text-center mb-12 text-rich-black"
        >
          Les 4 composantes du coût
        </h2>

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
                  <div className="w-10 h-10 bg-butter-yellow flex items-center justify-center">
                    <span className="text-2xl text-rich-black font-bold">+</span>
                  </div>
                </div>
              )}

              {/* Card - Bauhaus style */}
              <div
                ref={(el) => { cardsRef.current[index] = el; }}
                className={`${cost.bgColor} p-6`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${cost.textColor === 'text-white' ? 'bg-white/20' : 'bg-rich-black/10'} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-2xl">{cost.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-xl font-display font-bold ${cost.textColor} mb-1`}>
                      {cost.title}
                    </h3>
                    <p className={`${cost.textColor} opacity-90`}>
                      {cost.description}
                    </p>
                    {cost.subtext && (
                      <p className={`text-sm ${cost.textColor} opacity-70 mt-1`}>
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
        <div className="mt-8 p-4 bg-magenta/10 border-l-4 border-magenta">
          <p className="text-sm text-rich-black">
            <strong>Note :</strong> Droits d'enregistrement de 12,5% en Wallonie.
            Récupération possible de 60% si revente du 1er bien dans les 2 ans.
          </p>
        </div>
      </div>
    </section>
  );
}
