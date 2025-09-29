import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send, Heart } from "lucide-react";

export const InscriptionForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    ville: "",
    profession: "",
    situationFamiliale: "",
    uniteSouhaitee: "",
    motivation: "",
    newsletter: false,
    rencontre: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.nom || !formData.prenom || !formData.email || !formData.motivation) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simulation de l'envoi
    toast({
      title: "Candidature envoyée ! 🌱",
      description: "Nous vous recontacterons très prochainement pour échanger sur votre projet.",
    });

    // Reset du formulaire
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      ville: "",
      profession: "",
      situationFamiliale: "",
      uniteSouhaitee: "",
      motivation: "",
      newsletter: false,
      rencontre: false
    });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="inscription" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            REJOINDRE L'AVENTURE
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vous êtes intéressé·e par notre projet d'habitat partagé ? 
            Remplissez ce formulaire pour candidater comme futur·e co-acquéreur·se.
          </p>
        </div>

        <Card className="shadow-warm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-nature-green" />
              Formulaire de candidature
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange("prenom", e.target.value)}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                    placeholder="+32 XXX XX XX XX"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville actuelle</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleChange("ville", e.target.value)}
                    placeholder="Votre ville actuelle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => handleChange("profession", e.target.value)}
                    placeholder="Votre profession"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="situationFamiliale">Situation familiale</Label>
                  <Select onValueChange={(value) => handleChange("situationFamiliale", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celibataire">Célibataire</SelectItem>
                      <SelectItem value="couple">En couple</SelectItem>
                      <SelectItem value="famille-1-enfant">Famille avec 1 enfant</SelectItem>
                      <SelectItem value="famille-2-enfants">Famille avec 2 enfants</SelectItem>
                      <SelectItem value="famille-3-enfants-plus">Famille avec 3+ enfants</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uniteSouhaitee">Unité souhaitée</Label>
                  <Select onValueChange={(value) => handleChange("uniteSouhaitee", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Taille d'unité recherchée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60m2">60 m² (187 500€)</SelectItem>
                      <SelectItem value="120m2">120 m² (341 000€)</SelectItem>
                      <SelectItem value="autre-taille">Autre taille à définir</SelectItem>
                      <SelectItem value="pas-sur">Pas encore sûr·e</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Votre motivation *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleChange("motivation", e.target.value)}
                  placeholder="Parlez-nous de votre motivation pour rejoindre le projet Beaver, vos valeurs, ce qui vous attire dans l'habitat partagé..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => handleChange("newsletter", checked === true)}
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Je souhaite recevoir les actualités du projet par email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rencontre"
                    checked={formData.rencontre}
                    onCheckedChange={(checked) => handleChange("rencontre", checked === true)}
                  />
                  <Label htmlFor="rencontre" className="text-sm">
                    J'aimerais organiser une rencontre pour visiter le lieu et rencontrer le collectif
                  </Label>
                </div>
              </div>

              <Button type="submit" variant="nature" size="lg" className="w-full">
                <Send className="w-5 h-5 mr-2" />
                Envoyer ma candidature
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                En envoyant ce formulaire, vous acceptez d'être contacté·e par le collectif Beaver 
                pour échanger sur votre candidature. Vos données ne seront pas partagées avec des tiers.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};