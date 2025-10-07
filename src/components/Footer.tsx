import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { loadContent, parseMarkdownSections, type FooterContent } from "@/lib/content";

export const Footer = () => {
  const [content, setContent] = useState<FooterContent | null>(null);

  useEffect(() => {
    const loadFooterContent = async () => {
      const { frontmatter, content: markdown } = await loadContent('footer.md');
      const sections = parseMarkdownSections(markdown);
      
      const members = sections["Membres"] || [];
      const partnersRaw = sections["Partenaires"] || [];
      const partners = partnersRaw.map(line => {
        const match = line.match(/\*\*(.+?):\*\*\s*(.+)/);
        if (match) {
          return { role: match[1], name: match[2] };
        }
        return { role: "", name: line };
      }).filter(p => p.role);

      setContent({
        title: frontmatter.title || "Contact",
        address: frontmatter.address || "",
        city: frontmatter.city || "",
        members,
        partners,
        copyright: frontmatter.copyright || "",
        tagline: frontmatter.tagline || "",
      } as FooterContent);
    };
    loadFooterContent();
  }, []);

  if (!content) return null;

  return (
    <footer className="bg-nature-dark text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Contact */}
          <div>
            <h3 className="text-2xl font-bold mb-6">{content.title}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p>{content.address}</p>
                  <p>{content.city}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-3">Membres du projet</h4>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                {content.members.map((member, index) => (
                  <span key={index}>{member.replace(/^- /, '')}</span>
                ))}
              </div>
            </div>

            {/* Partners - Restored */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3">Partenaires</h4>
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
                {content.partners.map((partner, index) => (
                  <p key={index}><strong>{partner.role} :</strong> {partner.name}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>{content.copyright}</p>
          <p className="mt-2">{content.tagline}</p>
        </div>
      </div>
    </footer>
  );
};