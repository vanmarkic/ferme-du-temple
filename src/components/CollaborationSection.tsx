import { useState, useEffect } from "react";
import { loadContent, parseMarkdownSections, type CollaborationContent } from "@/lib/content";

export const CollaborationSection = () => {
  const [content, setContent] = useState<CollaborationContent | null>(null);

  useEffect(() => {
    const loadCollabContent = async () => {
      const { frontmatter, content: markdown } = await loadContent('collaboration.md');
      const sections = parseMarkdownSections(markdown);
      
      setContent({
        title: frontmatter.title || "COLLABORATION",
        sections,
      } as CollaborationContent);
    };
    loadCollabContent();
  }, []);

  if (!content) return null;

  const governanceText = content.sections["Gouvernance partagée"] || [];
  const engagementSections = {
    "Réunions mensuelles en ligne": content.sections["Réunions mensuelles en ligne"]?.[0] || "",
    "Journées de travail sur site": content.sections["Journées de travail sur site"]?.[0] || "",
    "Participation aux groupes de travail": content.sections["Participation aux groupes de travail"]?.[0] || "",
  };

  return (
    <section id="collaboration" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display mb-12 text-center">
          {content.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            {governanceText.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="bg-primary text-primary-foreground p-8 border-4 border-rich-black">
            <div className="space-y-4">
              {Object.entries(engagementSections).map(([title, text], index) => (
                <p key={index} className={index === 0 ? "font-medium" : ""}>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
