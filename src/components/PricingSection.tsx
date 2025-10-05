import { Check } from "lucide-react";
export const PricingSection = () => {
  const units = [{
    size: "60 M²",
    price: "187 500 €",
    breakdown: [{
      label: "Achat lot privatif",
      amount: "67 500 €"
    }, {
      label: "Travaux estimés (2000€/M²)",
      amount: "120 000 €"
    }],
    popular: false
  }, {
    size: "120 M²",
    price: "341 000 €",
    breakdown: [{
      label: "Achat lot privatif",
      amount: "101 000 €"
    }, {
      label: "Travaux estimés (2000€/M²)",
      amount: "240 000 €"
    }],
    popular: true
  }];
  return <section className="py-48 bg-background">
      <div className="container mx-auto px-4">
        {/* Title - Bauhaus Asymmetric */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-2"></div>
          <div className="col-span-12 md:col-span-8">
            <div className="relative">
              <div className="absolute -top-16 right-0 w-48 h-48 bg-butter-yellow/30"></div>
              <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-12 relative z-10">
                INVESTISSEMENT<br />ET FINANCEMENT
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
              <div className="text-6xl font-bold text-foreground mb-8">
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

          {/* 120 M² - Offset and Overlapping */}
          <div className="col-span-12 md:col-span-6 md:col-start-6 md:-mt-24 relative z-30">
            <div className="relative">
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-magenta z-0"></div>
              <div className="bg-butter-yellow p-12 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-lg text-rich-black uppercase tracking-wider">Surface</p>
                  
                </div>
                <div className="text-6xl font-bold text-rich-black mb-8">
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

        {/* Total Offer - Bold Statement */}
        <div className="grid grid-cols-12 gap-16">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-magenta"></div>
              <div className="ml-12">
                <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-12 uppercase">
                  Offre acceptée
                </h3>
                <div className="bg-butter-yellow/30 p-12 border-2 border-butter-yellow">
                  <div className="mb-8">
                    <div className="text-6xl md:text-7xl font-bold text-magenta mb-4">
                      650 000 €
                    </div>
                    <p className="text-2xl font-bold text-foreground uppercase tracking-wider">
                      La Ferme du Temple
                    </p>
                  </div>
                  <div className="space-y-6 text-lg">
                    <div className="flex justify-between items-center pb-4 border-b-2 border-rich-black/20">
                      <span className="text-muted-foreground">Prix achat terres et ferme</span>
                      <span className="font-bold text-foreground">650 000 €</span>
                    </div>
                    <div className="pt-4">
                      <span className="text-muted-foreground">Achat en division</span>
                      <p className="font-bold text-foreground mt-2">
                        Division en lots prévue entre le compromis et l'acte
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-8 italic">
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