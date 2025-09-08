import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const units = [
    {
      size: "60 M²",
      count: "6 UNITÉS",
      price: "187 500 €",
      breakdown: [
        { label: "Redevance", amount: "50 000 €" },
        { label: "Achat lot privatif (Emphytéose)", amount: "17 500 €" },
        { label: "Travaux estimés (2000€/M²)", amount: "120 000 €" }
      ],
      popular: false
    },
    {
      size: "120 M²",
      count: "1 UNITÉ",
      price: "341 000 €",
      breakdown: [
        { label: "Redevance", amount: "66 000 €" },
        { label: "Achat lot privatif (Emphytéose)", amount: "35 000 €" },
        { label: "Travaux estimés (2000€/M²)", amount: "240 000 €" }
      ],
      popular: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-nature-beige to-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            INVESTISSEMENT ET FINANCEMENT
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Il nous reste <span className="font-semibold text-nature-green">6 sur 10 unités</span> de m² variables à acquérir. 
            Les typologies restent à imaginer ensemble.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {units.map((unit, index) => (
            <Card key={index} className={`relative ${unit.popular ? 'border-nature-green shadow-warm' : ''}`}>
              {unit.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-nature-green">
                  Exemple disponible
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {unit.count}
                </CardTitle>
                <p className="text-lg text-muted-foreground">{unit.size}</p>
                <div className="text-3xl font-bold text-nature-green">
                  {unit.price}
                </div>
                <p className="text-sm text-muted-foreground">
                  Prix total estimé + mensualité remboursement emprunt fondation
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unit.breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white shadow-warm">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  STRUCTURE JURIDIQUE
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-nature-green mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Fondation de la Ferme du Temple</h4>
                      <p className="text-sm text-muted-foreground">
                        Propriétaire des terres et espaces communs selon le principe du Community Land Trust
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-nature-green mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Droit d'emphytéose</h4>
                      <p className="text-sm text-muted-foreground">
                        Chaque entité propriétaire de son lot de bâti avec pleine jouissance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-nature-green mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Pérennité des valeurs</h4>
                      <p className="text-sm text-muted-foreground">
                        La fondation assure la cohérence de tous les projets du lieu
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  COÛT TOTAL DU PROJET
                </h3>
                <div className="bg-nature-beige/50 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-nature-green mb-2">
                      839 500 €
                    </div>
                    <p className="text-lg font-semibold text-foreground">LA FERME DU TEMPLE</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix achat terres et ferme</span>
                      <span className="font-semibold">730 000 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frais enregistrement + notaire</span>
                      <span className="font-semibold">109 500 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Attention :</strong> Ces prix sont uniquement indiqués pour donner un ordre de grandeur et ne sont pas garantis.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};