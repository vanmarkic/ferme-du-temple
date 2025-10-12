import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "./SectionTitle";

interface ProjectContent {
  title?: string;
  subtitle?: string;
}

interface ProjectSectionProps {
  content?: ProjectContent;
  body?: string;
}

export const ProjectSection = ({ content, body }: ProjectSectionProps = {}) => {
  const {
    title,
    subtitle,
  } = content || {};

  // Parse poles from markdown body
  const parsePoles = (bodyContent?: string): Array<{ title: string; description: string }> => {
    if (!bodyContent) return [];

    const poles: Array<{ title: string; description: string }> = [];
    const poleRegex = /# (PÔLE [A-ZÀÂÇÉÈÊËÏÎÔÛÙÜŸÆŒ]+)\s+([\s\S]*?)(?=\n#|$)/g;

    let match;
    while ((match = poleRegex.exec(bodyContent)) !== null) {
      poles.push({
        title: match[1].trim(),
        description: match[2].trim()
      });
    }

    return poles;
  };

  // Parse beaver explanation paragraphs
  const parseBeaverContent = (bodyContent?: string): string[] => {
    if (!bodyContent) return [];

    const beaverSection = bodyContent.match(/# POURQUOI LE COLLECTIF BEAVER\?\s+([\s\S]*?)(?=\n##)/);
    if (beaverSection) {
      return beaverSection[1]
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p);
    }

    return [];
  };

  // Parse members info
  const parseMembers = (bodyContent?: string): string[] => {
    if (!bodyContent) return [];

    const membersSection = bodyContent.match(/## Membres\s+((?:- .+\n?)+)/);
    if (membersSection) {
      return membersSection[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^- /, '').trim());
    }

    return [];
  };

  // Parse professions
  const parseProfessions = (bodyContent?: string): string[] => {
    if (!bodyContent) return [];

    const professionsSection = bodyContent.match(/## Professions\s+((?:- .+\n?)+)/);
    if (professionsSection) {
      return professionsSection[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^- /, '').trim());
    }

    return [];
  };

  const poles = parsePoles(body);
  const beaverParagraphs = parseBeaverContent(body);
  const members = parseMembers(body);
  const professions = parseProfessions(body);

  return (
    <section data-testid="project-section" id="projet" className="py-48 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Title with Bauhaus Geometry */}
        <div className="ml-0 md:ml-32 mb-48">
          <SectionTitle subtitle={subtitle}>
            {title}
          </SectionTitle>
        </div>

        {/* Three Poles - Asymmetric Bauhaus Layout */}
        {poles.length >= 3 && (
          <div className="grid grid-cols-12 gap-0 mb-64">
            {/* Pole 1 - Top Left */}
            <div className="col-span-12 md:col-span-4 mb-16 md:mb-0">
              <div className="bg-butter-yellow p-12 h-full relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-magenta"></div>
                <h3 className="text-2xl font-bold text-rich-black mb-6 uppercase tracking-wider">{poles[0].title}</h3>
                <p className="text-rich-black leading-relaxed">{poles[0].description}</p>
              </div>
            </div>

            {/* White Space */}
            <div className="hidden md:block col-span-1"></div>

            {/* Pole 2 - Middle Right, Offset Down */}
            <div className="col-span-12 md:col-span-5 md:mt-24 mb-16 md:mb-0">
              <div className="bg-background border-2 border-rich-black p-12 h-full">
                <h3 className="text-2xl font-bold text-foreground mb-6 uppercase tracking-wider">{poles[1].title}</h3>
                <p className="text-muted-foreground leading-relaxed">{poles[1].description}</p>
              </div>
            </div>

            {/* Pole 3 - Bottom Left, Full Width on Mobile */}
            <div className="col-span-12 md:col-span-6 md:col-start-2 md:mt-32">
              <div className="relative overflow-hidden">
                <div className="hidden md:block absolute -bottom-8 -right-8 w-32 h-32 bg-magenta/20 z-0"></div>
                <div className="bg-butter-yellow/30 p-12 relative z-10">
                  <h3 className="text-2xl font-bold text-rich-black mb-6 uppercase tracking-wider">{poles[2].title}</h3>
                  <p className="text-rich-black leading-relaxed">{poles[2].description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collective Beaver - Asymmetric Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-16 items-start">
          {/* White Space Left */}
          <div className="hidden md:block col-span-2"></div>

          {/* Content */}
          <div className="col-span-12 md:col-span-8 px-4 md:px-0">
            <div className="relative overflow-hidden">
              <div className="absolute -top-12 left-0 w-2 h-48 bg-magenta"></div>

              <h3 className="text-5xl md:text-7xl font-display text-foreground mb-12 md:mb-16 ml-8 md:ml-12 break-words">
                POURQUOI LE
                <br />
                COLLECTIF BEAVER?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <div className="space-y-6 md:space-y-8">
                  {beaverParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {(members.length > 0 || professions.length > 0) && (
                  <div className="bg-butter-yellow p-6 md:p-8 self-start">
                    {members.length > 0 && (
                      <p className="text-xl md:text-2xl font-bold text-rich-black mb-4 md:mb-6">
                        {members.map((member, index) => (
                          <span key={index}>
                            {member}
                            {index < members.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    )}
                    {members.length > 0 && professions.length > 0 && (
                      <div className="h-0.5 w-16 bg-magenta mb-4 md:mb-6"></div>
                    )}
                    {professions.length > 0 && (
                      <p className="text-xs md:text-sm text-rich-black uppercase tracking-wider leading-loose">
                        {professions.map((profession, index) => (
                          <span key={index}>
                            {profession}
                            {index < professions.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
