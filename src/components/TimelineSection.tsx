import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Building, Home } from "lucide-react";

export const TimelineSection = () => {
  const timeline = [
    {
      year: "2023",
      status: "completed",
      icon: CalendarDays,
      events: [
        "Naissance du Collectif Beaver",
        "Première visite de la Ferme du Temple"
      ]
    },
    {
      year: "2024",
      status: "completed",
      icon: MapPin,
      events: [
        "Offre d'achat de la Ferme acceptée",
        "Création de la charte"
      ]
    },
    {
      year: "2025",
      status: "current",
      icon: Building,
      events: [
        "Nouvelles recrues Beaver",
        "Signature du compromis et de la vente",
        "Mesures conservatoires sur le bâtiment",
        "Faisabilité + programmation avec les architectes Carton 123"
      ]
    },
    {
      year: "2026-2027",
      status: "future",
      icon: Building,
      events: [
        "Esquisse + Avant projet",
        "Mesures conservatoires sur le bâtiment",
        "Obtention du permis d'urbanisme pour division des parties privées"
      ]
    },
    {
      year: "2028-2029",
      status: "future",
      icon: Home,
      events: [
        "Acte complexe",
        "Travaux d'infrastructures",
        "Début des travaux privatifs",
        "Emménagement à la ferme"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-nature-green text-white";
      case "current": return "bg-accent text-foreground";
      case "future": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Réalisé";
      case "current": return "En cours";
      case "future": return "À venir";
      default: return "";
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            PLANNING PRÉVISIONNEL
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nous travaillons depuis plus d'un an au montage de notre futur habitat partagé. 
            Voici les grandes étapes de notre parcours vers l'emménagement.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-nature-green hidden lg:block"></div>

          <div className="space-y-12">
            {timeline.map((period, index) => {
              const Icon = period.icon;
              const isLeft = index % 2 === 0;
              
              return (
                <div key={period.year} className={`flex items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col`}>
                  <div className={`w-full lg:w-5/12 ${isLeft ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <Card className={`${period.status === 'current' ? 'border-accent shadow-warm' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-bold text-foreground">{period.year}</h3>
                          <Badge className={getStatusColor(period.status)}>
                            {getStatusLabel(period.status)}
                          </Badge>
                        </div>
                        <ul className="space-y-2">
                          {period.events.map((event, i) => (
                            <li key={i} className="text-muted-foreground leading-relaxed">
                              • {event}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-white border-4 border-nature-green rounded-full my-4 lg:my-0 relative z-10">
                    <Icon className="w-6 h-6 text-nature-green" />
                  </div>

                  <div className="w-full lg:w-5/12"></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-warm-beige border-nature-green/20 shadow-warm">
            <CardContent className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-forest-dark mb-4 font-poppins leading-tight">
                NOUS VOULONS FAIRE DE L'HABITAT PARTAGÉ<br/>
                DE LA FERME DU TEMPLE
              </h3>
              <p className="text-xl md:text-2xl font-bold text-forest-dark mb-2 font-poppins">
                UN LIEU JOYEUX ET AIMANT,
              </p>
              <p className="text-xl md:text-2xl font-bold text-forest-dark font-poppins">
                OUVERT ET CHALEUREUX, OÙ L'ABONDANCE DE LA VIE PEUT ÊTRE CÉLÉBRÉE !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};