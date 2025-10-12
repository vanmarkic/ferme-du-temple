import { MapPin, Train, Car, Plane } from "lucide-react";
import { MapView } from "./MapView";
import { PropertyCarousel } from "./PropertyCarousel";
import { SectionTitle } from "./SectionTitle";
import floorPlan from "@/assets/floor-plan.png";

interface LocationContent {
  title: string;
  address: string;
  city: string;
  region: string;
  tagline: string;
  photosTitle: string;
  imagesTitle: string;
  mapTitle: string;
}

interface LocationSectionProps {
  content?: LocationContent;
  body?: string;
}

export const LocationSection = ({ content, body }: LocationSectionProps = {}) => {
  const {
    title = "LA FERME DU TEMPLE",
    address = "227 avenue Joseph Wauters",
    city = "7080 Frameries",
    region = "Province du Hainaut, Belgique",
    tagline = "L'habitat partagé de la Ferme du Temple sera un lieu de vie ancré dans le territoire, dynamique et productif, s'articulant autour de la culture des Arts et de la terre",
    photosTitle = "PHOTOS",
    imagesTitle = "Découvrez le domaine en images",
    mapTitle = "LOCALISATION",
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

    return { title: "Un patrimoine historique exceptionnel", paragraphs: [] };
  };

  const trainTransport = body ? parseTransportSection(body, "Transport ferroviaire") : [];
  const roadTransport = body ? parseTransportSection(body, "Transport routier") : [];
  const airportInfo = body ? parseTransportSection(body, "Aéroport").join(' ') : "";
  const heritage = parseHeritage(body);
  return (
    <section data-testid="location-section" className="py-48 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-7">
            <SectionTitle accentLine="vertical">
              {title.split(' ').slice(0, 2).join(' ')}<br/>{title.split(' ').slice(2).join(' ')}
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
        <div className="grid grid-cols-12 gap-8 mb-64">
          {/* Train */}
          <div className="col-span-12 md:col-span-5 relative">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-magenta/20"></div>
            <div className="bg-background border-2 border-rich-black p-8 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Train className="w-6 h-6 text-magenta" />
                <h4 className="font-bold text-xl uppercase tracking-wider">Transport ferroviaire</h4>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                {trainTransport.length > 0 ? (
                  trainTransport.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <>
                    <li>Gare SNCB Frameries : 5min à pied</li>
                    <li>Mons : 5min en train</li>
                    <li>Bruxelles : 1H05</li>
                    <li>Tournai : 45min</li>
                    <li>Lille : 1H20</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* White Space */}
          <div className="hidden md:block col-span-1"></div>

          {/* Car - Offset */}
          <div className="col-span-12 md:col-span-5 md:mt-24">
            <div className="bg-butter-yellow p-8">
              <div className="flex items-center gap-3 mb-6">
                <Car className="w-6 h-6 text-rich-black" />
                <h4 className="font-bold text-xl uppercase tracking-wider text-rich-black">Transport routier</h4>
              </div>
              <ul className="space-y-3 text-rich-black">
                {roadTransport.length > 0 ? (
                  roadTransport.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <>
                    <li>Mons : 15min</li>
                    <li>Bruxelles : 1h</li>
                    <li>Tournai : 1h</li>
                    <li>Vélo via Ravel : 25min vers Mons</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Airport - Full Width Below */}
          <div className="col-span-12 md:col-span-4 md:col-start-3">
            <div className="bg-butter-yellow/30 border-2 border-butter-yellow p-8">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-6 h-6 text-rich-black" />
                <h4 className="font-bold text-xl uppercase tracking-wider">Aéroport</h4>
              </div>
              <p className="text-muted-foreground">{airportInfo || "Aéroport de Charleroi : 40min en voiture"}</p>
            </div>
          </div>
        </div>

        {/* Historical Heritage - Overlapping Layout */}
        <div className="grid grid-cols-12 gap-0 mb-64">
          <div className="col-span-12 md:col-span-6 md:col-start-2 mb-16 md:mb-0">
            <div className="relative">
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-magenta z-0"></div>
              <div className="bg-background p-12 relative z-10">
                {heritage.title && (
                  <h3 className="text-5xl md:text-7xl font-display text-foreground mb-8 uppercase">
                    {heritage.title.split(' ').slice(0, 2).join(' ')}<br/>{heritage.title.split(' ').slice(2, 4).join(' ')}<br/>{heritage.title.split(' ').slice(4).join(' ')}
                  </h3>
                )}
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  {heritage.paragraphs.length > 0 ? (
                    heritage.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <>
                      <p>
                        La Ferme du Temple garde en elle les souvenirs d'un passé chargé d'histoire.
                        Son histoire commence avec les chevaliers de l'Ordre des Templiers qui firent bâtir
                        une chapelle datant du XIIe siècle.
                      </p>
                      <p>
                        Le Temple était une commanderie, le siège d'une exploitation agricole servant de
                        pied à terre, d'auberge et de relais pour les membres de l'Ordre.
                      </p>
                      <p>
                        En 1858, Victor Mirland, industriel français, acheta la « Ferme du Temple »
                        pour y développer une fabrique de pâtes de fruits et confitures « Mirland & Cie »
                        jusqu'en 1979.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 md:-ml-16 relative z-20">
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

        {/* Property Carousel */}
        <div className="mb-48">
          <div className="mb-12 ml-0 md:ml-16">
            <h5 className="text-5xl md:text-7xl font-display text-foreground uppercase">
              {imagesTitle.split(' ').slice(0, 3).join(' ')}<br/>{imagesTitle.split(' ').slice(3).join(' ')}
            </h5>
          </div>
          <PropertyCarousel />
        </div>

        {/* Localisation Section */}
        <div className="mb-16">
          <h3 className="text-5xl md:text-7xl font-display text-foreground mb-16 uppercase ml-8">
            {mapTitle}
          </h3>

          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-12 md:col-span-10 md:col-start-2">
              <div className="relative">
                <div className="absolute -top-8 -right-8 w-64 h-64 bg-butter-yellow/30 z-0"></div>
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