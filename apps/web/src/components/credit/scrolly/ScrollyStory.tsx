import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StepsSection from './sections/StepsSection';
import CostBreakdownSection from './sections/CostBreakdownSection';
import ComparativeExamplesSection from './sections/ComparativeExamplesSection';
import PaymentTimelineSection from './sections/PaymentTimelineSection';

export default function ScrollyStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register plugin client-side only
    gsap.registerPlugin(ScrollTrigger);

    // Global scroll smoothness
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Progress bar animation
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3
        }
      });
    }

    // Refresh ScrollTrigger when fonts load
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-background">
      {/* Progress indicator - Bauhaus style */}
      <div className="fixed top-0 left-0 w-full h-2 bg-rich-black/10 z-50">
        <div
          className="h-full bg-magenta"
          style={{
            width: '0%',
            transition: 'width 0.1s ease-out'
          }}
          id="progress-bar"
        />
      </div>

      {/* Story sections - Buyer-centered journey */}
      <StepsSection />
      <CostBreakdownSection />
      <ComparativeExamplesSection />
      <PaymentTimelineSection />
    </div>
  );
}
