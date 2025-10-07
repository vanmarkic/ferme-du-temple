import { useEffect, useState } from "react";
import { loadContent, parseMarkdownSections } from "@/lib/content";

export const CollaborationSection = () => {
  const [content, setContent] = useState<any>({});
  const [sections, setSections] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadContent('collaboration.md').then(({ frontmatter, content }) => {
      setContent(frontmatter);
      setSections(parseMarkdownSections(content));
    });
  }, []);

  return (
    <section data-testid="collaboration-section" id="collaboration" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display mb-12 text-center">
          {content.title || "COLLABORATION"}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            {sections["Gouvernance partagée"]?.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="bg-primary text-primary-foreground p-8 border-4 border-rich-black">
            <div className="space-y-4">
              {sections["Engagement attendu"]?.slice(0, 1).map((para, i) => (
                <p key={i} className="font-medium">{para}</p>
              ))}
              {sections["Participation aux groupes de travail"]?.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
