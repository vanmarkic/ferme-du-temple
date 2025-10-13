import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Heart, Loader2 } from "lucide-react";

interface InscriptionContent {
  title?: string;
  subtitle?: string;
  formTitle?: string;
}

interface InscriptionFormProps {
  content?: InscriptionContent;
}

export const InscriptionForm = ({ content }: InscriptionFormProps = {}) => {
  const {
    title,
    subtitle,
    formTitle,
  } = content || {};

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Let the native form submission happen - Netlify will handle it
    // The form will POST to the same URL and Netlify will capture it
  };
  return (
    <section data-testid="inscription-section" id="inscription" className="py-48 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Title - Bauhaus Style */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="relative">
              <div className="absolute -top-16 -right-8 w-48 h-48 bg-magenta/20"></div>
              <h2 className="text-5xl md:text-7xl font-display text-foreground mb-12 relative z-10 uppercase">
                {title.split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? word : <>{word}<br /></>
                )}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Form - Geometric Layout */}
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <div className="relative">
              <div className="absolute -bottom-12 -left-12 w-64 h-2 bg-butter-yellow z-0"></div>
              <div className="bg-background border-4 border-rich-black p-12 md:p-16 relative z-10">
                <div className="flex items-center gap-4 mb-12">
                  <Heart className="w-8 h-8 text-magenta" />
                  <h3 className="text-2xl font-bold uppercase tracking-wider">
                    {formTitle}
                  </h3>
                </div>

                <form
                  name="inscription"
                  method="POST"
                  action="/inscription-merci"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Netlify Forms requirement */}
                  <input type="hidden" name="form-name" value="inscription" />

                  {/* Honeypot field for spam protection */}
                  <p className="hidden">
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="nom" className="text-lg font-bold uppercase tracking-wider">
                        Nom *
                      </Label>
                      <Input
                        id="nom"
                        name="nom"
                        placeholder="Votre nom"
                        className="border-2 border-rich-black"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="prenom" className="text-lg font-bold uppercase tracking-wider">
                        Prénom *
                      </Label>
                      <Input
                        id="prenom"
                        name="prenom"
                        placeholder="Votre prénom"
                        className="border-2 border-rich-black"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-lg font-bold uppercase tracking-wider">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="border-2 border-rich-black"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="telephone" className="text-lg font-bold uppercase tracking-wider">
                        Téléphone
                      </Label>
                      <Input
                        id="telephone"
                        name="telephone"
                        placeholder="+32 XXX XX XX XX"
                        className="border-2 border-rich-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="motivation" className="text-lg font-bold uppercase tracking-wider">
                      Votre motivation *
                    </Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      placeholder="Parlez-nous de votre motivation pour rejoindre le projet d'Habitat Beaver? Qu'est-ce qui vous tient à cœur dans la réalisation d'un habitat partagé? Vos valeurs, vos attentes?..."
                      rows={5}
                      className="border-2 border-rich-black"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="besoinsSpecifiques" className="text-lg font-bold uppercase tracking-wider">
                      Besoins spécifiques
                    </Label>
                    <Textarea
                      id="besoinsSpecifiques"
                      name="besoinsSpecifiques"
                      placeholder="Avez-vous des besoins spécifiques ou des contraintes particulières que nous devrions connaître ? (accessibilité, etc.)"
                      rows={4}
                      className="border-2 border-rich-black"
                    />
                  </div>

                  <div className="relative">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="nature"
                      size="lg"
                      className="w-full relative z-10 bg-magenta hover:bg-magenta/90 text-white uppercase tracking-wider text-lg py-6 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Envoyer ma candidature
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center leading-relaxed pt-4">
                    En envoyant ce formulaire, vous acceptez d'être contacté·e par le collectif Beaver 
                    pour échanger sur votre candidature. Vos données ne seront pas partagées avec des tiers 
                    et seront conservées durant 3 ans maximum.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
