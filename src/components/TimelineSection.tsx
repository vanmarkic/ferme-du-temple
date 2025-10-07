import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Building, Home } from "lucide-react";
import { loadContent } from "@/lib/content";

export const TimelineSection = () => {
  const { frontmatter: content, sections } = loadContent('timeline.md');

  const getIconForYear = (year: string) => {
    if (year.includes("2022") || year.includes("2023")) return CalendarDays;
    if (year.includes("2024")) return MapPin;
    if (year.includes("2025") || year.includes("2026")) return Building;
    return Home;
  };

  const timeline = Object.keys(sections)
    .filter(key => /^\d{4}/.test(key))
    .map(year => {
      const lines = sections[year];
      const status = lines.find(l => l.startsWith("**Status:**"))?.replace("**Status:** ", "").trim() || "future";
      const events = lines.filter(l => l.startsWith("-")).map(e => e.replace(/^- /, ''));
      return {
        year,
        status,
        icon: getIconForYear(year),
        events
      };
    });

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
            <div className="relative">
              <div className="absolute -top-8 left-0 w-64 h-2 bg-magenta"></div>
              <h2 className="text-5xl md:text-7xl font-display text-foreground mb-12 mt-8">
                {content.title || "CHRONOLOGIE"}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {content.subtitle || "Le projet Beaver suit un calendrier ambitieux mais réaliste, ponctué d'étapes importantes pour transformer cette vision en réalité concrète."}
              </p>
            </div>
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
                <h3 className="text-3xl md:text-5xl font-display mb-8 leading-tight uppercase">
                  {content.conclusion || "Une aventure qui ne fait que commencer"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};