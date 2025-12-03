import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const paymentSteps = [
  {
    id: 'adhesion',
    title: 'Adhésion',
    icon: '📝',
    date: 'Maintenant',
    description: 'Participation aux frais courants',
    detail: 'Quelques centaines €/mois',
    bgColor: 'bg-butter-yellow',
    textColor: 'text-rich-black'
  },
  {
    id: 'acte',
    title: 'Acte notarié',
    icon: '🏛️',
    date: 'Mars 2026 — Janvier 2027',
    description: 'Prix d\'achat + droits d\'enregistrement',
    detail: 'Acte collectif (mars 2026) ou révélation de lot (jusqu\'à janvier 2027)',
    bgColor: 'bg-magenta',
    textColor: 'text-white'
  },
  {
    id: 'tranche1',
    title: 'Travaux — Phase 1',
    icon: '🔨',
    date: 'Janvier 2027',
    description: 'Gros œuvre, isolation, techniques',
    detail: 'Démarrage des travaux par zones',
    bgColor: 'bg-nature-leaf',
    textColor: 'text-rich-black'
  },
  {
    id: 'tranche2',
    title: 'Travaux — Phase 2',
    icon: '🎨',
    date: '2027 — 2028',
    description: 'Finitions (à votre rythme)',
    detail: 'Certaines zones habitables avant la fin',
    bgColor: 'bg-butter-yellow',
    textColor: 'text-rich-black'
  },
  {
    id: 'emmenagement',
    title: 'Emménagement',
    icon: '🏠',
    date: 'Fin 2028',
    description: 'Frais courants partagés',
    detail: 'Toutes les zones terminées',
    bgColor: 'bg-magenta',
    textColor: 'text-white'
  }
];

export default function PaymentTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

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

    // Subtitle
    if (subtitleRef.current) {
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 1
        }
      });
    }

    // Timeline line grows
    if (lineRef.current) {
      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: lineRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1
        }
      });
    }

    // Steps cascade
    stepsRef.current.forEach((step, index) => {
      if (!step) return;

      gsap.from(step, {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          end: 'top 65%',
          scrub: 1
        }
      });
    });

  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-rich-black"
    >
      <div className="max-w-4xl mx-auto w-full">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl font-display font-bold text-center mb-6 text-butter-yellow"
        >
          Les paiements dans le temps
        </h2>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white/80 text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-white font-bold">Vous ne payez pas tout d'un coup !</span>
          <br />
          <span className="text-white/60">L'investissement s'étale sur plusieurs mois.</span>
        </p>

        {/* Timeline vertical - Bauhaus style */}
        <div className="relative">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-butter-yellow transform md:-translate-x-1/2"
          />

          {/* Steps */}
          <div className="space-y-8">
            {paymentSteps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => { stepsRef.current[index] = el; }}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Dot on timeline */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-butter-yellow transform -translate-x-1/2 z-10" />

                {/* Content card */}
                <div className={`ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className={`${step.bgColor} p-5`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 ${step.textColor === 'text-white' ? 'bg-white/20' : 'bg-rich-black/10'} flex items-center justify-center`}>
                        <span className="text-xl">{step.icon}</span>
                      </div>
                      <div>
                        <h3 className={`text-lg font-display font-bold ${step.textColor}`}>{step.title}</h3>
                        <p className={`text-xs font-semibold ${step.textColor === 'text-white' ? 'text-butter-yellow' : 'text-magenta'}`}>{step.date}</p>
                      </div>
                    </div>
                    <p className={`${step.textColor} opacity-90 mb-1`}>{step.description}</p>
                    <p className={`text-sm ${step.textColor} opacity-70`}>→ {step.detail}</p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-5/12" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom message */}
        <div className="mt-16 text-center">
          <div className="inline-block px-8 py-4 bg-nature-leaf">
            <p className="text-lg text-rich-black">
              <span className="font-bold">💡 Pour les finitions,</span> vous pouvez même mettre la main à la pâte !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
