import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Building, Home } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

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
        "Travaux d'infrastructures",
        "Début des travaux privatifs",
        "Emménagement à la ferme"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-magenta text-white";
      case "current": return "bg-butter-yellow text-rich-black";
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
    <section data-testid="timeline-section" className="py-48 bg-background">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <SectionTitle
              subtitle="Nous travaillons depuis plus d'un an au montage de notre futur habitat partagé. Voici les grandes étapes de notre parcours vers l'emménagement."
            >
              PLANNING<br/>PRÉVISIONNEL
            </SectionTitle>
          </div>
        </div>

        {/* Timeline - Asymmetric Grid */}
        <div className="space-y-32">
          {timeline.map((period, index) => {
            const Icon = period.icon;
            const isLeft = index % 2 === 0;
            
            return (
              <div key={period.year} className={`grid grid-cols-12 gap-8 ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
                {/* Year & Icon */}
                <div className={`col-span-12 md:col-span-3 ${!isLeft ? 'md:col-start-10 md:text-right' : ''}`}>
                  <div className={`inline-flex items-center gap-4 ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-16 h-16 bg-magenta flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl font-bold text-foreground">
                      {period.year}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`col-span-12 md:col-span-7 ${!isLeft ? 'md:col-start-2' : 'md:col-start-5'}`}>
                  <div className={`relative ${period.status === 'current' ? 'bg-butter-yellow' : 'bg-background border-2 border-rich-black'} p-10`}>
                    {period.status === 'current' && (
                      <div className="absolute -top-8 -right-8 w-32 h-32 bg-magenta/20"></div>
                    )}
                    <div className="relative z-10">
                      <Badge className={`${getStatusColor(period.status)} mb-6 uppercase tracking-wider`}>
                        {getStatusLabel(period.status)}
                      </Badge>
                      <ul className="space-y-4 list-none">
                        {period.events.map((event, i) => (
                          <li key={i} className={`text-lg leading-relaxed ${period.status === 'current' ? 'text-rich-black' : 'text-muted-foreground'}`}>
                            {event}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Statement - Bold Typography */}
        <div className="grid grid-cols-12 gap-0 mt-48">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <div className="relative">
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-butter-yellow/30"></div>
              <div className="bg-magenta text-white p-16 relative z-10">
                <h3 className="text-5xl md:text-7xl font-display mb-8 leading-tight uppercase">
                  Nous voulons faire de l'habitat partagé de la Ferme du Temple
                </h3>
                <div className="space-y-4 text-2xl md:text-3xl font-bold">
                  <p>Un lieu joyeux et aimant,</p>
                  <p>Ouvert et chaleureux,</p>
                  <p>Où l'abondance de la vie peut être célébrée !</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};