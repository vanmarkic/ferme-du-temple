import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { loadContent, parseMarkdownSections } from "@/lib/content";

export const Footer = () => {
  const [content, setContent] = useState<any>({});
  const [sections, setSections] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadContent('footer.md').then(({ frontmatter, content }) => {
      setContent(frontmatter);
      setSections(parseMarkdownSections(content));
    });
  }, []);

  return (
    <footer data-testid="footer" className="bg-nature-dark text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Contact */}
          <div>
            <h3 className="text-2xl font-bold mb-6">{content.title || "Contact"}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p>{content.address || "227 avenue Joseph Wauters"}</p>
                  <p>{content.city || "7080 Frameries, Belgique"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-3">{content.membersTitle || "Membres du projet"}</h4>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                {sections["Membres"]?.map((member, index) => (
                  <span key={index}>{member.replace(/^- /, '')}</span>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3">{content.partnersTitle || "Partenaires"}</h4>
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
                {sections["Partenaires"]?.map((partner, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: partner.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>{content.copyright || "© 2025 Collectif Beaver - Habitat partagé de la Ferme du Temple"}</p>
          <p className="mt-2">{content.tagline || "Janvier 2025 - Conçu avec passion pour un avenir durable"}</p>
        </div>
      </div>
    </footer>
  );
};