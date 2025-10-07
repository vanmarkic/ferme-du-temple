import { loadContent } from "@/lib/content";

export const PricingSection = () => {
  const { frontmatter: content, sections } = loadContent('pricing.md');

  const getUnit = (key: string) => {
    const price = sections[key]?.find(l => !l.startsWith('##') && !l.startsWith('-'))?.trim();
    const details = sections[key]?.filter(l => l.startsWith('-')).map(l => l.replace(/^- /, '').split(' : '));
    return { price, details };
  };

  const unit60 = getUnit("Unité 60 M²");
  const unit120 = getUnit("Unité 120 M²");

  return <section data-testid="pricing-section" className="py-48 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Title - Bauhaus Asymmetric */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-2"></div>
          <div className="col-span-12 md:col-span-8">
            <div className="relative overflow-hidden">
              <div className="hidden md:block absolute -top-16 right-0 w-48 h-48 bg-butter-yellow/30"></div>
              <h2 className="text-3xl md:text-7xl font-display text-foreground mb-12 relative z-10 break-words">
                {content.title || "INVESTISSEMENT ET FINANCEMENT"}
              </h2>
              <div className="bg-magenta text-white p-8 inline-block">
                <p className="text-2xl font-bold">
                  6 sur 12 unités<br />disponibles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Units - Overlapping Cards */}
        <div className="grid grid-cols-12 gap-0 mb-64">
          {/* 60 M² */}
          <div className="col-span-12 md:col-span-5 mb-16 md:mb-0 relative z-20">
            <div className="bg-background border-4 border-rich-black p-12">
              <p className="text-lg text-muted-foreground uppercase tracking-wider mb-2">Surface</p>
              <div className="text-6xl font-bold font-display text-foreground mb-8">
                60 M²
              </div>
              <div className="mb-8">
                <div className="text-4xl font-bold text-magenta mb-2">
                  {unit60.price || "280 000 €"}
                </div>
                <p className="text-sm uppercase tracking-wider text-muted-foreground">
                  Prix total estimé
                </p>
              </div>
              <div className="space-y-4 border-t-2 border-rich-black pt-8">
                {unit60.details?.map((item, i) => <div key={i} className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground flex-1">{item[0]}</span>
                    <span className="font-bold text-foreground ml-4">{item[1]}</span>
                  </div>)}
              </div>
            </div>
          </div>

          {/* 120 M² - Offset and Overlapping */}
          <div className="col-span-12 md:col-span-6 md:col-start-6 md:-mt-24 relative z-30">
            <div className="relative overflow-hidden">
              <div className="hidden md:block absolute -bottom-12 -right-12 w-32 h-32 bg-magenta z-0"></div>
              <div className="bg-butter-yellow p-12 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-lg text-rich-black uppercase tracking-wider">Surface</p>
                </div>
                <div className="text-6xl font-bold font-display text-rich-black mb-8">
                  120 M²
                </div>
                <div className="mb-8">
                  <div className="text-4xl font-bold text-magenta mb-2">
                    {unit120.price || "480 000 €"}
                  </div>
                  <p className="text-sm uppercase tracking-wider text-rich-black">
                    Prix total estimé
                  </p>
                </div>
                <div className="space-y-4 border-t-2 border-rich-black pt-8">
                  {unit120.details?.map((item, i) => <div key={i} className="flex justify-between items-start">
                      <span className="text-sm text-rich-black flex-1">{item[0]}</span>
                      <span className="font-bold text-rich-black ml-4">{item[1]}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Offer - Bold Statement */}
        <div className="grid grid-cols-12 gap-4 md:gap-16">
          <div className="col-span-12 md:col-span-8 md:col-start-3 px-4 md:px-0">
            <div className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-magenta"></div>
              <div className="ml-8 md:ml-12">
                <h3 className="text-2xl md:text-3xl lg:text-5xl font-display text-foreground mb-8 md:mb-12 uppercase break-words">
                  {content.offerTitle || "Offre acceptée"}
                </h3>
                <div className="bg-butter-yellow/30 p-6 md:p-12 border-2 border-butter-yellow">
                  <div className="mb-6 md:mb-8">
                    <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-magenta mb-3 md:mb-4 break-words">
                      {content.offerPrice || "810 000 €"}
                    </div>
                    <p className="text-lg md:text-2xl font-bold text-foreground uppercase tracking-wider break-words">
                      {content.offerDetails || "Acquisition du terrain et de la ferme"}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-6 md:mt-8 italic">
                    (hors frais de notaire)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};