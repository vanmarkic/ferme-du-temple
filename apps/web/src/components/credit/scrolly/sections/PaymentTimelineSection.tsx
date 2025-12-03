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
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'acte',
    title: 'Acte notarié',
    icon: '🏛️',
    date: 'Mars 2026 — Janvier 2027',
    description: 'Prix d\'achat + droits d\'enregistrement',
    detail: 'Acte collectif (mars 2026) ou révélation de lot (jusqu\'à janvier 2027)',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'tranche1',
    title: 'Travaux — Phase 1',
    icon: '🔨',
    date: 'Janvier 2027',
    description: 'Gros œuvre, isolation, techniques',
    detail: 'Démarrage des travaux par zones',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'tranche2',
    title: 'Travaux — Phase 2',
    icon: '🎨',
    date: '2027 — 2028',
    description: 'Finitions (à votre rythme)',
    detail: 'Certaines zones habitables avant la fin',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  },
  {
    id: 'emmenagement',
    title: 'Emménagement',
    icon: '🏠',
    date: 'Fin 2028',
    description: 'Frais courants partagés',
    detail: 'Toutes les zones terminées',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/30'
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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-900 to-slate-800"
    >
      <div className="max-w-4xl mx-auto w-full">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold text-center mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
            Les paiements dans le temps
          </span>
        </h2>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-slate-300 text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-white font-bold">Vous ne payez pas tout d'un coup !</span>
          <br />
          <span className="text-slate-400">L'investissement s'étale sur plusieurs mois.</span>
        </p>

        {/* Timeline vertical */}
        <div className="relative">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-amber-500 to-pink-500 rounded-full transform md:-translate-x-1/2"
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
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-white border-4 border-slate-900 transform -translate-x-1/2 z-10" />

                {/* Content card */}
                <div className={`ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className={`${step.bgColor} rounded-2xl p-5 border ${step.borderColor}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                        <span className="text-xl">{step.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{step.title}</h3>
                        <p className="text-xs font-semibold text-amber-400">{step.date}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-1">{step.description}</p>
                    <p className="text-sm text-slate-400">→ {step.detail}</p>
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
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl border border-green-500/20">
            <p className="text-lg text-green-300">
              <span className="font-bold">💡 Pour les finitions,</span> vous pouvez même mettre la main à la pâte !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
