import { useEffect, useState } from "react";
import { loadContent, parseMarkdownSections } from "@/lib/content";

export const ProjectSection = () => {
  const [content, setContent] = useState<any>({});
  const [sections, setSections] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadContent('project.md').then(({ frontmatter, content }) => {
      setContent(frontmatter);
      setSections(parseMarkdownSections(content));
    });
  }, []);

  const poles = [
    { title: "PÔLE HABITAT", key: "PÔLE HABITAT" },
    { title: "PÔLE CULTUREL", key: "PÔLE CULTUREL" },
    { title: "PÔLE TERRE", key: "PÔLE TERRE" },
  ];

  return (
    <section data-testid="project-section" id="projet" className="py-48 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Title with Bauhaus Geometry */}
        <div className="relative mb-48 ml-0 md:ml-32">
          <div className="hidden md:block absolute -top-16 -left-8 w-64 h-2 bg-magenta"></div>
          <h2 className="text-5xl md:text-7xl font-display text-foreground mb-12">{content.title || "LE PROJET"}</h2>
          <div className="max-w-2xl">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {content.subtitle || "L'habitat partagé de La Ferme du Temple est une pépinière de projets mixtes et innovants, articulée autour de trois pôles principaux qui s'enrichissent mutuellement."}
            </p>
          </div>
        </div>

        {/* Three Poles - Asymmetric Bauhaus Layout */}
        <div className="grid grid-cols-12 gap-0 mb-64">
          {/* Pole 1 - Top Left */}
          <div className="col-span-12 md:col-span-4 mb-16 md:mb-0">
            <div className="bg-butter-yellow p-12 h-full relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-magenta"></div>
              <h3 className="text-2xl font-bold text-rich-black mb-6 uppercase tracking-wider">{poles[0].title}</h3>
              <p className="text-rich-black leading-relaxed">{sections[poles[0].key]?.[0] || ""}</p>
            </div>
          </div>

          {/* White Space */}
          <div className="hidden md:block col-span-1"></div>

          {/* Pole 2 - Middle Right, Offset Down */}
          <div className="col-span-12 md:col-span-5 md:mt-24 mb-16 md:mb-0">
            <div className="bg-background border-2 border-rich-black p-12 h-full">
              <h3 className="text-2xl font-bold text-foreground mb-6 uppercase tracking-wider">{poles[1].title}</h3>
              <p className="text-muted-foreground leading-relaxed">{sections[poles[1].key]?.[0] || ""}</p>
            </div>
          </div>

          {/* Pole 3 - Bottom Left, Full Width on Mobile */}
          <div className="col-span-12 md:col-span-6 md:col-start-2 md:mt-32">
            <div className="relative overflow-hidden">
              <div className="hidden md:block absolute -bottom-8 -right-8 w-32 h-32 bg-magenta/20 z-0"></div>
              <div className="bg-butter-yellow/30 p-12 relative z-10">
                <h3 className="text-2xl font-bold text-rich-black mb-6 uppercase tracking-wider">{poles[2].title}</h3>
                <p className="text-rich-black leading-relaxed">{sections[poles[2].key]?.[0] || ""}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collective Beaver - Asymmetric Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-16 items-start">
          {/* White Space Left */}
          <div className="hidden md:block col-span-2"></div>

          {/* Content */}
          <div className="col-span-12 md:col-span-8 px-4 md:px-0">
            <div className="relative overflow-hidden">
              <div className="absolute -top-12 left-0 w-2 h-48 bg-magenta"></div>

              <h3 className="text-3xl md:text-4xl lg:text-6xl font-display text-foreground mb-12 md:mb-16 ml-8 md:ml-12 break-words">
                {sections["POURQUOI LE COLLECTIF BEAVER?"] ? "POURQUOI LE COLLECTIF BEAVER?" : "POURQUOI LE\nCOLLECTIF BEAVER?"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <div className="space-y-6 md:space-y-8">
                  {sections["POURQUOI LE COLLECTIF BEAVER?"]?.slice(0, 2).map((para, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {para.replace(/^- /, '')}
                    </p>
                  ))}
                </div>

                <div className="bg-butter-yellow p-6 md:p-8 self-start">
                  <p className="text-xl md:text-2xl font-bold text-rich-black mb-4 md:mb-6">
                    {sections["Membres"]?.map(m => m.replace(/^- /, '')).join('\n') || "8 adultes\n6 enfants\n4 unités de logement"}
                  </p>
                  <div className="h-0.5 w-16 bg-magenta mb-4 md:mb-6"></div>
                  <p className="text-xs md:text-sm text-rich-black uppercase tracking-wider leading-loose">
                    {sections["Professions"]?.map(p => p.replace(/^- /, '')).join('\n') || "Architectes\nPhotographes\nArtistes\nEnseignants\nMusiciens\nHerboristes\nEntrepreneurs"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
