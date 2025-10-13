import { MapPin } from "lucide-react";

interface FooterContent {
  title?: string;
  address?: string;
  city?: string;
  membersTitle?: string;
  partnersTitle?: string;
  copyright?: string;
  tagline?: string;
}

interface FooterProps {
  content?: FooterContent;
  body?: string;
}

export const Footer = ({ content, body }: FooterProps = {}) => {
  const {
    title,
    address,
    city,
    membersTitle,
    partnersTitle,
    copyright,
    tagline,
  } = content || {};

  // Parse members from markdown body
  const parseMembers = (bodyContent?: string): string[] => {
    if (!bodyContent) return [];

    const membersMatch = bodyContent.match(/# Membres\s+((?:- .+\n?)+)/);
    if (membersMatch) {
      return membersMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^- /, '').trim());
    }

    return [];
  };

  // Parse partners from markdown body
  const parsePartners = (bodyContent?: string): { label: string; value: string }[] => {
    if (!bodyContent) return [];

    const partnersSection = bodyContent.match(/# Partenaires\s+([\s\S]+?)(?:\n##|\n---|\n\n#|$)/);
    if (partnersSection) {
      const partners: { label: string; value: string }[] = [];
      const lines = partnersSection[1].trim().split('\n');

      for (const line of lines) {
        const match = line.match(/\*\*(.+?):\*\*\s*(.+)/);
        if (match) {
          partners.push({ label: match[1], value: match[2] });
        }
      }

      return partners;
    }

    return [];
  };

  const contacts = parseMembers(body);
  const partners = parsePartners(body);

  return (
    <footer data-testid="footer" className="relative bg-nature-dark text-white py-16 overflow-hidden">
      {/* Geometric accent */}
      <div className="absolute top-0 left-8 w-2 h-32 bg-magenta z-0"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-0 md:gap-8">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            {/* Contact */}
            <div className="relative z-10">
              <h3 className="text-3xl font-display font-bold mb-6">{title}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p>{address}</p>
                  <p>{city}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-3">{membersTitle}</h4>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                {contacts.map((contact, index) => (
                  <span key={index}>{contact}</span>
                ))}
              </div>
            </div>

            {/* Partners */}
            {partners.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-3">{partnersTitle}</h4>
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
                  {partners.map((partner, index) => (
                    <p key={index}>
                      <strong>{partner.label} :</strong> {partner.value}
                    </p>
                  ))}
                </div>
              </div>
            )}
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8 text-sm text-gray-400">
              <p>{copyright}</p>
              <p className="mt-2">{tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};