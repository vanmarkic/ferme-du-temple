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
        { label: "Achat lot privatif", amount: "67 500 €" },
        { label: "Travaux estimés (2000€/M²)", amount: "120 000 €" }
      ],
      popular: false
    },
    {
      size: "120 M²",
      count: "1 UNITÉ",
      price: "341 000 €",
      breakdown: [
        { label: "Achat lot privatif", amount: "101 000 €" },
        { label: "Travaux estimés (2000€/M²)", amount: "240 000 €" }
      ],
      popular: true
    }
  ];

  return (
    <section className="py-20 bg-background">
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
                  Prix total estimé
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
            <div className="mt-8 p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Attention :</strong> Ces prix sont uniquement indiqués pour donner un ordre de grandeur et ne sont pas garantis.
              </p>
            </div>
        </div>

        <Card className="bg-white shadow-warm">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  OFFRE ACCEPTÉE (hors frais de notaire)
                </h3>
                <div className="bg-nature-beige/50 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-nature-green mb-2">
                      650 000 €
                    </div>
                    <p className="text-lg font-semibold text-foreground">LA FERME DU TEMPLE</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix achat terres et ferme</span>
                      <span className="font-semibold">650 000 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Achat en division</span>
                      <span className="font-semibold">Divison en lots prévues entre le compromis et l'acte</span>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </section>
  );
};