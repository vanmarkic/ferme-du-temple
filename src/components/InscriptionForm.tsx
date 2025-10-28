import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Heart, Loader2 } from 'lucide-react';

interface FieldConfig {
  label?: string;
  placeholder?: string;
  required?: boolean;
}

interface InscriptionContent {
  title?: string;
  subtitle?: string;
  formNotice?: string;
  formTitle?: string;
  fields?: {
    nom?: FieldConfig;
    prenom?: FieldConfig;
    email?: FieldConfig;
    telephone?: FieldConfig;
    motivation?: FieldConfig;
    besoinsSpecifiques?: FieldConfig;
    infosPrioritaires?: FieldConfig;
  };
  button?: {
    label?: string;
    loading?: string;
  };
  privacyNotice?: string;
}

interface InscriptionFormProps {
  content?: InscriptionContent;
}

export const InscriptionForm = ({ content }: InscriptionFormProps = {}) => {
  const { title, subtitle, formNotice, formTitle, fields, button, privacyNotice } = content || {};

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        email: formData.get('email'),
        telephone: formData.get('telephone'),
        motivation: formData.get('motivation'),
        besoinsSpecifiques: formData.get('besoinsSpecifiques'),
        infosPrioritaires: formData.get('infosPrioritaires'),
        'bot-field': formData.get('bot-field'),
      };

      const response = await fetch('/api/submit-inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

      // Success - redirect to thank you page
      window.location.href = '/inscription-merci';
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };
  return (
    <section
      data-testid="inscription-section"
      id="inscription"
      className="py-48 bg-background overflow-x-hidden"
    >
      <div className="container mx-auto px-3 md:px-4">
        {/* Title - Bauhaus Style */}
        <div className="grid grid-cols-12 gap-0 mb-32 md:mb-48">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="relative overflow-hidden">
              <div className="hidden md:block absolute -top-16 -right-8 w-48 h-48 bg-magenta/20"></div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display text-foreground mb-8 md:mb-12 relative z-10 uppercase break-words hyphens-auto leading-[1.15] max-w-full">
                {title?.split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? (
                    <span key={i}>{word}</span>
                  ) : (
                    <span key={i}>
                      {word}
                      <br />
                    </span>
                  )
                )}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Form Notice - Right above the form */}
        {formNotice && (
          <div className="grid grid-cols-12 gap-0 mb-32 md:mb-48">
            <div className="col-span-12 md:col-span-8 md:col-start-3">
              <div className="relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-butter-yellow"></div>
                <div className="ml-8 md:ml-12">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic">
                    {formNotice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Honeypot field for spam protection */}
                  <p className="hidden">
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label
                        htmlFor="nom"
                        className="text-lg font-bold uppercase tracking-wider"
                      >
                        {fields?.nom?.label}
                        {fields?.nom?.required && ' *'}
                      </Label>
                      <Input
                        id="nom"
                        name="nom"
                        placeholder={fields?.nom?.placeholder}
                        className="border-2 border-rich-black"
                        required={fields?.nom?.required}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="prenom"
                        className="text-lg font-bold uppercase tracking-wider"
                      >
                        {fields?.prenom?.label}
                        {fields?.prenom?.required && ' *'}
                      </Label>
                      <Input
                        id="prenom"
                        name="prenom"
                        placeholder={fields?.prenom?.placeholder}
                        className="border-2 border-rich-black"
                        required={fields?.prenom?.required}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label
                        htmlFor="email"
                        className="text-lg font-bold uppercase tracking-wider"
                      >
                        {fields?.email?.label}
                        {fields?.email?.required && ' *'}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={fields?.email?.placeholder}
                        className="border-2 border-rich-black"
                        required={fields?.email?.required}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="telephone"
                        className="text-lg font-bold uppercase tracking-wider"
                      >
                        {fields?.telephone?.label}
                        {fields?.telephone?.required && ' *'}
                      </Label>
                      <Input
                        id="telephone"
                        name="telephone"
                        placeholder={fields?.telephone?.placeholder}
                        className="border-2 border-rich-black"
                        required={fields?.telephone?.required}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="motivation"
                      className="text-lg font-bold uppercase tracking-wider"
                    >
                      {fields?.motivation?.label}
                      {fields?.motivation?.required && ' *'}
                    </Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      placeholder={fields?.motivation?.placeholder}
                      rows={5}
                      className="border-2 border-rich-black"
                      required={fields?.motivation?.required}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="infosPrioritaires"
                      className="text-lg font-bold uppercase tracking-wider"
                    >
                      {fields?.infosPrioritaires?.label}
                      {fields?.infosPrioritaires?.required && ' *'}
                    </Label>
                    <Textarea
                      id="infosPrioritaires"
                      name="infosPrioritaires"
                      placeholder={fields?.infosPrioritaires?.placeholder}
                      rows={4}
                      className="border-2 border-rich-black"
                      required={fields?.infosPrioritaires?.required}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="besoinsSpecifiques"
                      className="text-lg font-bold uppercase tracking-wider"
                    >
                      {fields?.besoinsSpecifiques?.label}
                      {fields?.besoinsSpecifiques?.required && ' *'}
                    </Label>
                    <Textarea
                      id="besoinsSpecifiques"
                      name="besoinsSpecifiques"
                      placeholder={fields?.besoinsSpecifiques?.placeholder}
                      rows={4}
                      className="border-2 border-rich-black"
                      required={fields?.besoinsSpecifiques?.required}
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
                          {button?.loading}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {button?.label}
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center leading-relaxed pt-4">
                    {privacyNotice}
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
