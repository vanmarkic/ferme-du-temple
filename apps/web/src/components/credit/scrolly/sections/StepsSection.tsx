import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const steps = [
  {
    id: 'adhesion',
    title: 'Adhésion',
    description: 'Signature accord préalable',
    icon: '📝',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'compromis',
    title: 'Compromis',
    description: 'Dépôt chez le notaire (garantie)',
    icon: '🤝',
    color: 'from-cyan-500 to-teal-500'
  },
  {
    id: 'acte',
    title: 'Acte',
    description: 'Emprunt + Division parcellaire',
    icon: '🏛️',
    color: 'from-teal-500 to-green-500'
  },
  {
    id: 'travaux',
    title: 'Travaux',
    description: 'Rénovations par phases',
    icon: '🔨',
    color: 'from-green-500 to-amber-500'
  },
  {
    id: 'chezvous',
    title: 'Chez vous',
    description: 'Emménagement',
    icon: '🏠',
    color: 'from-amber-500 to-orange-500'
  }
];

export default function StepsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const connectorsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    // Steps appear one by one
    stepsRef.current.forEach((step, index) => {
      if (!step) return;

      gsap.from(step, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          end: 'top 60%',
          scrub: 1
        }
      });
    });

    // Connectors grow
    connectorsRef.current.forEach((connector) => {
      if (!connector) return;

      gsap.from(connector, {
        scaleX: 0,
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: connector,
          start: 'top 80%',
          end: 'top 60%',
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
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold text-center mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Le chemin vers votre habitat
          </span>
        </h2>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-slate-300 text-center max-w-3xl mx-auto mb-16"
        >
          Rejoindre la Ferme du Temple, c'est un chemin en plusieurs étapes.
          <br />
          <span className="text-slate-400">Pas de précipitation : chaque phase vous laisse le temps de vous projeter.</span>
        </p>

        {/* Timeline horizontal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step card */}
              <div
                ref={(el) => { stepsRef.current[index] = el; }}
                className="flex flex-col items-center"
              >
                {/* Icon circle */}
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-2xl`}>
                  <span className="text-3xl md:text-4xl">{step.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 text-center">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-400 text-center max-w-[120px]">
                  {step.description}
                </p>
              </div>

              {/* Connector arrow (not for last item) */}
              {index < steps.length - 1 && (
                <div
                  ref={(el) => { connectorsRef.current[index] = el; }}
                  className="hidden md:block w-12 lg:w-20 h-1 bg-gradient-to-r from-slate-600 to-slate-500 mx-2 rounded-full"
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical indicator */}
        <div className="md:hidden mt-8 text-center">
          <p className="text-slate-500 text-sm">↓ Scrollez pour continuer ↓</p>
        </div>
      </div>
    </section>
  );
}
