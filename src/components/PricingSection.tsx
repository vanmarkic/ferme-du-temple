import { Check } from "lucide-react";
import { NumberBadge } from "./NumberBadge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface PricingContent {
  title?: string;
  availability?: string;
  offerTitle?: string;
  offerSubtitle?: string;
  offerDetails?: string;
}

interface PricingSectionProps {
  content?: PricingContent;
  body?: string;
}

export const PricingSection = ({ content, body }: PricingSectionProps = {}) => {
  const {
    title,
    availability,
    offerTitle,
    offerSubtitle,
    offerDetails,
  } = content || {};

  // Parse units from markdown body
  const parseUnits = (bodyContent?: string): Array<{
    size: string;
    price: string;
    breakdown: Array<{ label: string; amount: string }>;
    popular: boolean;
  }> => {
    if (!bodyContent) return [];

    const units: Array<{
      size: string;
      price: string;
      breakdown: Array<{ label: string; amount: string }>;
      popular: boolean;
    }> = [];

    // Match unit sections
    const unitRegex = /# Unité (\d+ M²)\s+([\s\S]*?)(?=\n# Unité|$)/g;
    let match;

    while ((match = unitRegex.exec(bodyContent)) !== null) {
      const size = match[1].trim();
      const section = match[2].trim();

      // Extract price
      const priceMatch = section.match(/## Prix total estimé\s+([0-9 €]+)/);
      const price = priceMatch ? priceMatch[1].trim() : "";

      // Extract breakdown
      const breakdownMatch = section.match(/## Breakdown\s+((?:- .+\n?)+)/);
      const breakdown: Array<{ label: string; amount: string }> = [];

      if (breakdownMatch) {
        const lines = breakdownMatch[1].split('\n').filter(l => l.trim().startsWith('-'));
        for (const line of lines) {
          const parts = line.replace(/^- /, '').split(':');
          if (parts.length === 2) {
            breakdown.push({
              label: parts[0].trim(),
              amount: parts[1].trim()
            });
          }
        }
      }

      // Extract popular status
      const popularMatch = section.match(/## Popular\s+(true|false)/);
      const popular = popularMatch ? popularMatch[1] === 'true' : false;

      units.push({ size, price, breakdown, popular });
    }

    return units;
  };

  const units = parseUnits(body);

  // Scroll reveal hooks for pricing cards
  const { elementRef: unit1Ref, isVisible: unit1Visible } = useScrollReveal({ threshold: 0.15 });
  const { elementRef: unit2Ref, isVisible: unit2Visible } = useScrollReveal({ threshold: 0.15 });

  return <section data-testid="pricing-section" className="py-48 bg-background overflow-hidden overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Title - Bauhaus Asymmetric */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-2"></div>
          <div className="col-span-12 md:col-span-8">
            <div className="relative overflow-hidden">
              <div className="hidden md:block absolute -top-16 right-0 w-48 h-48 bg-butter-yellow/30"></div>
              <h2 className="text-5xl md:text-7xl font-display text-foreground mb-12 relative z-10 break-words">
                {title}
              </h2>
              <div className="bg-magenta text-white p-8 block md:inline-block">
                <p className="text-2xl font-bold">
                  {availability.split(' ').map((word, i, arr) =>
                    i === 2 ? <span key={`${i}-${word}`}><br />{word} </span> : <span key={`${i}-${word}`}>{word} </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Units - Reduced Overlap with Reading Flow Indicators */}
        {units.length >= 2 && (
          <div className="grid grid-cols-12 gap-0 mb-64">
            {/* First unit */}
            <div
              ref={unit1Ref}
              className={`col-span-12 md:col-span-5 mb-16 md:mb-0 relative z-20 fade-in ${unit1Visible ? 'visible' : ''}`}
            >
              <div className="bg-background border-4 border-rich-black p-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <NumberBadge number={1} variant="default" className="mb-4" />
                <p className="text-lg text-muted-foreground uppercase tracking-wider mb-2">Surface</p>
                <div className="text-6xl font-bold font-display text-foreground mb-8">
                  {units[0].size}
                </div>
                <div className="mb-8">
                  <div className="text-4xl font-bold text-magenta mb-2">
                    {units[0].price}
                  </div>
                  <p className="text-sm uppercase tracking-wider text-muted-foreground">
                    Prix total estimé
                  </p>
                </div>
                <div className="space-y-4 border-t-2 border-rich-black pt-8">
                  {units[0].breakdown.map((item, i) => <div key={i} className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
                      <span className="font-bold text-foreground ml-4">{item.amount}</span>
                    </div>)}
                </div>
              </div>
            </div>

            {/* Second unit - Reduced Overlap */}
            <div
              ref={unit2Ref}
              className={`col-span-12 md:col-span-6 md:col-start-6 md:-mt-12 relative z-30 fade-in fade-in-stagger-1 ${unit2Visible ? 'visible' : ''}`}
            >
              <div className="relative overflow-hidden">
                <div className="hidden md:block absolute -bottom-12 -right-12 w-32 h-32 bg-magenta z-0"></div>
                <div className="bg-butter-yellow p-12 relative z-10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <NumberBadge number={2} variant="light" />
                    <p className="text-lg text-rich-black uppercase tracking-wider">Surface</p>
                  </div>
                  <div className="text-6xl font-bold font-display text-rich-black mb-8">
                    {units[1].size}
                  </div>
                  <div className="mb-8">
                    <div className="text-4xl font-bold text-magenta mb-2">
                      {units[1].price}
                    </div>
                    <p className="text-sm uppercase tracking-wider text-rich-black">
                      Prix total estimé
                    </p>
                  </div>
                  <div className="space-y-4 border-t-2 border-rich-black pt-8">
                    {units[1].breakdown.map((item, i) => <div key={i} className="flex justify-between items-start">
                        <span className="text-sm text-rich-black flex-1">{item.label}</span>
                        <span className="font-bold text-rich-black ml-4">{item.amount}</span>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Total Offer - Bold Statement */}
        <div className="grid grid-cols-12 gap-4 md:gap-16">
          <div className="col-span-12 md:col-span-8 md:col-start-3 px-4 md:px-0">
            <div className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-magenta"></div>
              <div className="ml-8 md:ml-12">
                <h3 className="text-5xl md:text-7xl font-display text-foreground mb-8 md:mb-12 uppercase break-words">
                  {offerTitle}
                </h3>
                <div className="bg-butter-yellow/30 p-6 md:p-12 border-2 border-butter-yellow">
                  <div className="mb-6 md:mb-8">
                    <p className="text-lg md:text-2xl font-bold text-foreground uppercase tracking-wider break-words">
                      {offerSubtitle}
                    </p>
                  </div>
                  <div className="space-y-4 md:space-y-6 text-sm md:text-lg">
                    <div className="pt-4">
                      <span className="text-muted-foreground block mb-2">Achat en division</span>
                      <p className="font-bold text-foreground">
                        {offerDetails}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};