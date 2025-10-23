import { MapPin, Train, Car, Plane } from "lucide-react";
import { MapView } from "./MapView";
import { SectionTitle } from "./SectionTitle";
import floorPlan from "@/assets/floor-plan.png";

interface LocationContent {
  title?: string;
  address?: string;
  city?: string;
  region?: string;
  tagline?: string;
  photosTitle?: string;
  imagesTitle?: string;
  mapTitle?: string;
  transportRailTitle?: string;
  transportRoadTitle?: string;
  transportAirTitle?: string;
  heritageTitle?: string;
  domaineTitle?: string;
}

interface LocationSectionProps {
  content?: LocationContent;
  body?: string;
}

export const LocationSection = ({ content, body }: LocationSectionProps = {}) => {
  const {
    title,
    address,
    city,
    region,
    tagline,
    photosTitle,
    imagesTitle,
    mapTitle,
    transportRailTitle,
    transportRoadTitle,
    transportAirTitle,
    heritageTitle,
    domaineTitle,
  } = content || {};

  // Parse transport sections from markdown body
  const parseTransportSection = (bodyContent: string, sectionTitle: string): string[] => {
    const regex = new RegExp(`# ${sectionTitle}\\s+((?:- .+\\n?)+)`, 'i');
    const match = bodyContent.match(regex);

    if (match) {
      return match[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^- /, '').trim());
    }

    return [];
  };

  // Parse airport section (which may not have dashes)
  const parseAirportSection = (bodyContent?: string): string => {
    if (!bodyContent) return "";
    
    const regex = new RegExp(`# Aéroport\\s+([^#]+)`, 'i');
    const match = bodyContent.match(regex);
    
    if (match) {
      return match[1]
        .split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#'))
        .map(line => line.replace(/^- /, '').trim())
        .join(' ');
    }
    
    return "";
  };

  // Parse heritage paragraphs
  const parseHeritage = (bodyContent?: string): { title: string; paragraphs: string[] } => {
    if (!bodyContent) return { title: "", paragraphs: [] };

    const heritageMatch = bodyContent.match(/# (Un patrimoine historique exceptionnel)\s+([\s\S]*?)(?=\n#|$)/);
    if (heritageMatch) {
      const title = heritageMatch[1];
      const paragraphs = heritageMatch[2]
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p);

      return { title, paragraphs };
    }

    return { title: "", paragraphs: [] };
  };

  // Parse "Le domaine aujourd'hui" section
  const parseDomaine = (bodyContent?: string): string[] => {
    if (!bodyContent) return [];

    const domaineMatch = bodyContent.match(/# Le domaine aujourd'hui\s+((?:##.*\n)?(?:- .+\n?)+)/i);
    if (domaineMatch) {
      return domaineMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^- /, '').trim());
    }

    return [];
  };

  const trainTransport = body ? parseTransportSection(body, "Transport ferroviaire") : [];
  const roadTransport = body ? parseTransportSection(body, "Transport routier") : [];
  const airportInfo = parseAirportSection(body);
  const heritage = parseHeritage(body);
  const domaineItems = parseDomaine(body);
  return (
    <section data-testid="location-section" className="py-48 bg-background overflow-x-hidden">
      <div className="container mx-auto px-3 md:px-4">
        {/* Section Title */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-7">
            <SectionTitle accentLine="vertical">
              {title?.split(' ').slice(0, 2).join(' ')}<br/>{title?.split(' ').slice(2).join(' ')}
            </SectionTitle>
          </div>
          <div className="col-span-12 md:col-span-5 md:mt-24">
            <div className="flex items-start gap-4 bg-butter-yellow p-8">
              <MapPin className="w-8 h-8 text-magenta mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-rich-black mb-2">{address}</p>
                <p className="text-rich-black">{city}</p>
                <p className="text-rich-black">{region}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transport Grid - Asymmetric Layout */}
        <div className="grid grid-cols-12 gap-0 md:gap-8 mb-64">
          {/* Train */}
          <div className="col-span-12 md:col-span-5 relative">
            <div className="hidden md:block absolute -top-8 -left-8 w-24 h-24 bg-magenta/20"></div>
            <div className="bg-background border-2 border-rich-black p-8 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Train className="w-6 h-6 text-magenta" />
                <h4 className="font-bold text-xl uppercase tracking-wider">{transportRailTitle}</h4>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                {trainTransport.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* White Space */}
          <div className="hidden md:block col-span-1"></div>

          {/* Car - Reduced Offset */}
          <div className="col-span-12 md:col-span-5 md:mt-12">
            <div className="bg-butter-yellow p-8 border-2 border-butter-yellow">
              <div className="flex items-center gap-3 mb-6">
                <Car className="w-6 h-6 text-rich-black" />
                <h4 className="font-bold text-xl uppercase tracking-wider text-rich-black">{transportRoadTitle}</h4>
              </div>
              <ul className="space-y-3 text-rich-black">
                {roadTransport.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Airport - Full Width Below */}
          <div className="col-span-12 md:col-span-4 md:col-start-3">
            <div className="bg-butter-yellow/30 border-2 border-butter-yellow p-8">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-6 h-6 text-rich-black" />
                <h4 className="font-bold text-xl uppercase tracking-wider">{transportAirTitle}</h4>
              </div>
              <p className="text-muted-foreground">{airportInfo}</p>
            </div>
          </div>
        </div>

        {/* Historical Heritage - Overlapping Layout */}
        <div className="grid grid-cols-12 gap-0 mb-64">
          <div className="col-span-12 md:col-span-6 md:col-start-2 mb-16 md:mb-0">
            <div className="relative">
              <div className="hidden md:block absolute -bottom-12 -right-12 w-48 h-48 bg-magenta z-0"></div>
              <div className="bg-background p-12 relative z-30">
                {heritageTitle && (
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display text-foreground mb-8 uppercase break-words hyphens-auto leading-[1.15]">
                    {heritageTitle?.split(' ').slice(0, 2).join(' ')}<br/>{heritageTitle?.split(' ').slice(2, 4).join(' ')}<br/>{heritageTitle?.split(' ').slice(4).join(' ')}
                  </h3>
                )}
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  {heritage.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 md:-ml-8 relative z-10">
            <img
              src={floorPlan.src}
              alt="Plan de la Ferme du Temple"
              className="w-full h-auto shadow-2xl max-w-2xl"
              loading="lazy"
              decoding="async"
              style={{ maxHeight: '800px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Le domaine aujourd'hui */}
        {domaineItems.length > 0 && (
          <div className="grid grid-cols-12 gap-0 mb-64">
            <div className="col-span-12 md:col-span-8 md:col-start-3">
              <div className="bg-butter-yellow p-8 md:p-12">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-rich-black mb-8 uppercase break-words hyphens-auto leading-[1.15]">
                  {domaineTitle}
                </h3>
                <ul className="space-y-4 text-rich-black text-lg">
                  {domaineItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-magenta mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}



        {/* Localisation Section */}
        <div className="mb-16">
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display text-foreground mb-16 uppercase ml-4 md:ml-8 break-words hyphens-auto leading-[1.15]">
            {mapTitle}
          </h3>

          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-12 md:col-span-10 md:col-start-2">
              <div className="relative">
                <div className="hidden md:block absolute -top-8 -right-8 w-64 h-64 bg-butter-yellow/30 z-0"></div>
                <div className="relative z-10">
                  <div className="shadow-2xl border-4 border-rich-black">
                    <MapView />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};