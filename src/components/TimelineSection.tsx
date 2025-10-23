import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Building, Home } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

interface TimelineContent {
  title?: string;
  subtitle?: string;
}

interface TimelineSectionProps {
  content?: TimelineContent;
  body?: string;
}

export const TimelineSection = ({ content, body }: TimelineSectionProps = {}) => {
  const {
    title,
    subtitle,
  } = content || {};

  // Icon mapping
  const iconMap: Record<string, any> = {
    CalendarDays,
    MapPin,
    Building,
    Home
  };

  // Parse timeline from markdown body
  const parseTimeline = (bodyContent?: string): Array<{
    year: string;
    status: string;
    icon: any;
    events: string[];
  }> => {
    if (!bodyContent) return [];

    const timeline: Array<{
      year: string;
      status: string;
      icon: any;
      events: string[];
    }> = [];

    // Match year sections (exclude "Vision finale")
    const yearRegex = /# ([\d-]+)\s+([\s\S]*?)(?=\n#|$)/g;
    let match;

    while ((match = yearRegex.exec(bodyContent)) !== null) {
      const year = match[1].trim();
      const section = match[2].trim();

      // Skip if it's the final vision section
      if (year === "Vision finale") continue;

      // Extract status
      const statusMatch = section.match(/\*\*Status:\*\*\s*(\w+)/);
      const status = statusMatch ? statusMatch[1] : "future";

      // Extract icon
      const iconMatch = section.match(/\*\*Icon:\*\*\s*(\w+)/);
      const iconName = iconMatch ? iconMatch[1] : "CalendarDays";
      const icon = iconMap[iconName] || CalendarDays;

      // Extract events (list items)
      const eventsMatch = section.match(/(?:^|\n)((?:- .+\n?)+)/);
      const events = eventsMatch
        ? eventsMatch[1]
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.replace(/^- /, '').trim())
        : [];

      timeline.push({ year, status, icon, events });
    }

    return timeline;
  };

  // Parse final vision statement
  const parseVisionStatement = (bodyContent?: string): { title: string; statements: string[] } | null => {
    if (!bodyContent) return null;

    const visionMatch = bodyContent.match(/# Vision finale\s+([\s\S]+?)$/);
    if (visionMatch) {
      const content = visionMatch[1].trim();
      const lines = content.split(/\n\n+/).map(l => l.trim()).filter(l => l);

      if (lines.length > 0) {
        return {
          title: lines[0],
          statements: lines.slice(1)
        };
      }
    }

    return null;
  };

  const timeline = parseTimeline(body);
  const visionStatement = parseVisionStatement(body);

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
    <section data-testid="timeline-section" className="py-48 bg-background overflow-x-hidden">
      <div className="container mx-auto px-3 md:px-4">
        {/* Title */}
        <div className="grid grid-cols-12 gap-0 mb-32 md:mb-48">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <SectionTitle subtitle={subtitle}>
              {title?.split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? <span key={`${i}-${word}`}>{word}</span> : <span key={`${i}-${word}`}>{word}<br /></span>
              )}
            </SectionTitle>
          </div>
        </div>

        {/* Timeline - Asymmetric Grid with Center Line */}
        <div className="relative space-y-32">
          {/* Center connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-magenta/20 -translate-x-1/2"></div>

          {timeline.map((period, index) => {
            const Icon = period.icon;
            const isLeft = index % 2 === 0;
            
            return (
              <div key={period.year} className={`grid grid-cols-12 gap-0 md:gap-8 ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
                {/* Year & Icon */}
                <div className={`col-span-12 md:col-span-3 ${!isLeft ? 'md:col-start-10 md:text-right' : ''}`}>
                  <div className={`inline-flex items-center gap-3 md:gap-4 ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-magenta flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground break-words leading-none">
                      {period.year}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`col-span-12 md:col-span-7 ${!isLeft ? 'md:col-start-2' : 'md:col-start-5'}`}>
                  <div className={`relative ${period.status === 'current' ? 'bg-butter-yellow' : 'bg-background border-2 border-rich-black'} p-6 md:p-10`}>
                    {period.status === 'current' && (
                      <div className="hidden md:block absolute -top-8 -right-8 w-32 h-32 bg-magenta/20"></div>
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
        {visionStatement && (
          <div className="grid grid-cols-12 gap-0 mt-48">
            <div className="col-span-12 md:col-span-10 md:col-start-2">
              <div className="relative">
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-butter-yellow/30"></div>
                <div className="bg-magenta text-white p-8 md:p-16 relative z-10">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display mb-6 md:mb-8 leading-[1.15] uppercase break-words hyphens-auto">
                    {visionStatement.title}
                  </h3>
                  <div className="space-y-3 md:space-y-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold break-words leading-snug">
                    {visionStatement.statements.map((statement, index) => (
                      <p key={index}>{statement}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};