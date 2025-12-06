import { useState } from 'react';
import { MapPin, Mail, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FooterContent {
  title?: string;
  address?: string;
  city?: string;
  membersTitle?: string;
  partnersTitle?: string;
  copyright?: string;
  tagline?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButton?: string;
  newsletterButtonLoading?: string;
}

interface FooterProps {
  content?: FooterContent;
  body?: string;
}

export const Footer = ({ content, body }: FooterProps = {}) => {
  const { title, address, city, membersTitle, partnersTitle, copyright, tagline, newsletterTitle, newsletterDescription, newsletterPlaceholder, newsletterButton, newsletterButtonLoading } =
    content || {};

  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse members from markdown body
  const parseMembers = (bodyContent?: string): string[] => {
    if (!bodyContent) return [];

    const membersMatch = bodyContent.match(/# Membres\s+((?:- .+\n?)+)/);
    if (membersMatch) {
      return membersMatch[1]
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace(/^- /, '').trim());
    }

    return [];
  };

  // Parse partners from markdown body
  const parsePartners = (bodyContent?: string): { label: string; value: string }[] => {
    if (!bodyContent) return [];

    const partnersSection = bodyContent.match(
      /# Partenaires\s+([\s\S]+?)(?:\n##|\n---|\n\n#|$)/
    );
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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newsletterOnly: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: 'Erreur',
          description: result.error || 'Une erreur est survenue. Veuillez réessayer.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: 'Inscription réussie !',
        description: 'Merci pour votre intérêt. Vous recevrez bientôt nos nouvelles.',
      });
      setEmail('');
    } catch (error) {
      console.error('Newsletter submission error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      data-testid="footer"
      className="relative bg-nature-dark text-white py-16 overflow-hidden min-h-[400px]"
    >
      {/* Geometric accent */}
      <div className="absolute top-0 left-8 w-2 h-24 bg-magenta z-0"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-0 md:gap-8">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            {/* Newsletter Section */}
            {newsletterTitle && (
              <div className="relative z-10 mb-12 pb-12 border-b border-gray-700">
                <h3 className="text-xl font-display font-bold mb-3">{newsletterTitle}</h3>
                <p className="text-sm text-gray-300 mb-6">{newsletterDescription}</p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterPlaceholder}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-accent"
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {newsletterButtonLoading}
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        {newsletterButton}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Contact */}
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-bold mb-6">{title}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                  <div className="text-xs">
                    <p>{address}</p>
                    <p>{city}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-3 text-xs">{membersTitle}</h4>
                <div className="grid grid-cols-1 gap-1 text-xs text-gray-300">
                  {contacts.map((contact, index) => (
                    <span key={index}>{contact}</span>
                  ))}
                </div>
              </div>

              {/* Partners */}
              {partners.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold mb-3 text-xs">{partnersTitle}</h4>
                  <div className="grid grid-cols-1 gap-2 text-xs text-gray-300">
                    {partners.map((partner, index) => (
                      <p key={index}>
                        <strong>{partner.label} :</strong> {partner.value}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8 text-xs text-gray-400">
              <p>{copyright}</p>
              <p className="mt-2">{tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Version badge - centered */}
      <div className="py-2 text-center">
        <span className="text-[10px] text-gray-500">v{__APP_VERSION__}</span>
      </div>
    </footer>
  );
};
