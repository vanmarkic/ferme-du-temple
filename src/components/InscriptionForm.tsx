import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { loadContent, parseMarkdownSections } from "@/lib/content";

const inscriptionSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  prenom: z.string().trim().min(1, "Le prénom est requis").max(100, "Le prénom est trop long"),
  email: z.string().trim().email("Email invalide").max(255, "L'email est trop long"),
  telephone: z.string().trim().max(20, "Le téléphone est trop long").optional().or(z.literal("")),
  motivation: z.string().trim().min(1, "La motivation est requise").max(2000, "La motivation est trop longue"),
  besoinsSpecifiques: z.string().trim().max(1000, "Les besoins spécifiques sont trop longs").optional().or(z.literal("")),
  newsletter: z.boolean(),
  rencontre: z.boolean(),
});
export const InscriptionForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState<any>({});
  const [sections, setSections] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motivation: "",
    besoinsSpecifiques: "",
    newsletter: false,
    rencontre: false
  });

  useEffect(() => {
    loadContent('inscription.md').then(({ frontmatter, content }) => {
      setContent(frontmatter);
      setSections(parseMarkdownSections(content));
    });
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod
    const validation = inscriptionSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Validation error",
        description: firstError.message,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-inscription', {
        body: validation.data
      });

      if (error) throw error;

      const successMsg = sections["Messages"]?.[0] || sections["Succès"]?.[0];
      const successDesc = sections["Messages"]?.[1] || sections["Succès"]?.[1];
      toast({
        title: successMsg?.replace(/^Title: /, '') || "Candidature envoyée ! 🌱",
        description: successDesc?.replace(/^Description: /, '') || "Nous vous recontacterons très prochainement pour échanger sur votre projet."
      });

      // Reset du formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motivation: "",
        besoinsSpecifiques: "",
        newsletter: false,
        rencontre: false
      });
    } catch (error: any) {
      const errorMsg = sections["Erreur"]?.[0];
      const errorDesc = sections["Erreur"]?.[1];
      toast({
        title: errorMsg?.replace(/^Title: /, '') || "Erreur",
        description: errorDesc?.replace(/^Description: /, '') || "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <section data-testid="inscription-section" id="inscription" className="py-48 bg-background">
      <div className="container mx-auto px-4">
        {/* Title - Bauhaus Style */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="relative">
              <div className="absolute -top-16 -right-8 w-48 h-48 bg-magenta/20"></div>
              <h2 className="text-5xl md:text-7xl font-display text-foreground mb-12 relative z-10 uppercase">
                {content.title || "Rejoindre l'aventure"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">{content.subtitle || "Remplissez ce formulaire pour témoigner votre intérêt envers le projet."}</p>
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
                  <h3 className="text-2xl font-bold uppercase tracking-wider">{content.formTitle || "Formulaire de candidature"}</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="nom" className="text-lg font-bold uppercase tracking-wider">Nom *</Label>
                      <Input id="nom" value={formData.nom} onChange={e => handleChange("nom", e.target.value)} placeholder="Votre nom" className="border-2 border-rich-black" required />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="prenom" className="text-lg font-bold uppercase tracking-wider">Prénom *</Label>
                      <Input id="prenom" value={formData.prenom} onChange={e => handleChange("prenom", e.target.value)} placeholder="Votre prénom" className="border-2 border-rich-black" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-lg font-bold uppercase tracking-wider">Email *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} placeholder="votre@email.com" className="border-2 border-rich-black" required />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="telephone" className="text-lg font-bold uppercase tracking-wider">Téléphone</Label>
                      <Input id="telephone" value={formData.telephone} onChange={e => handleChange("telephone", e.target.value)} placeholder="+32 XXX XX XX XX" className="border-2 border-rich-black" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="motivation" className="text-lg font-bold uppercase tracking-wider">Votre motivation *</Label>
                    <Textarea id="motivation" value={formData.motivation} onChange={e => handleChange("motivation", e.target.value)} placeholder="Parlez-nous de votre motivation pour rejoindre le projet Beaver, vos valeurs, ce qui vous attire dans l'habitat partagé..." rows={5} className="border-2 border-rich-black" required />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="besoinsSpecifiques" className="text-lg font-bold uppercase tracking-wider">Besoins spécifiques</Label>
                    <Textarea id="besoinsSpecifiques" value={formData.besoinsSpecifiques} onChange={e => handleChange("besoinsSpecifiques", e.target.value)} placeholder="Avez-vous des besoins spécifiques ou des contraintes particulières que nous devrions connaître ? (accessibilité, allergies, etc.)" rows={4} className="border-2 border-rich-black" />
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
                          {sections["Bouton"]?.find(l => l.startsWith("Loading:"))?.replace("Loading: ", "") || "Envoi en cours..."}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {sections["Bouton"]?.find(l => l.startsWith("Label:"))?.replace("Label: ", "") || "Envoyer ma candidature"}
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center leading-relaxed pt-4">
                    {sections["Notice de confidentialité"]?.[0] || "En envoyant ce formulaire, vous acceptez d'être contacté·e par le collectif Beaver pour échanger sur votre candidature. Vos données ne seront pas partagées avec des tiers et seront conservées durant 3 ans maximum."}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};