import { Button } from "@/components/ui/button";
import { Mail, MapPin } from "lucide-react";

export const Footer = () => {
  const contacts = [
    "Annabelle Czyz", "Cathy Weyders", "Colin Ponthot", 
    "Jeremy Michel", "Julie Luyten", "Manuela Capraro", 
    "Dragan Markovic", "Séverin Malaud"
  ];

  const partenaires = [
    { name: "ALTERA", url: "www.alteraprojects.be", role: "Accompagnement" },
    { name: "HABITAT ET PARTICIPATION", url: "www.habitat-participation.be", role: "Accompagnement" },
    { name: "CARTON 123", url: "www.carton123.be", role: "Architectes" },
    { name: "NOTAIRE ERNEUX", url: "", role: "Notaire" }
  ];

  return (
    <footer className="bg-nature-dark text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:habitatbeaver@gmail.com" className="hover:text-accent transition-colors">
                  habitatbeaver@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p>227 rue Joseph Wauters</p>
                  <p>7080 Frameries, Belgique</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-3">Personnes de contact</h4>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                {contacts.map((contact, index) => (
                  <span key={index}>{contact}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Partenaires */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Nos partenaires</h3>
            <div className="space-y-4">
              {partenaires.map((partenaire, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-accent">{partenaire.name}</h4>
                  <p className="text-sm text-gray-300">{partenaire.role}</p>
                  {partenaire.url && (
                    <a 
                      href={`https://${partenaire.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-accent transition-colors"
                    >
                      {partenaire.url}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Rejoignez-nous</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              N'hésitez pas à nous contacter si vous désirez avoir plus d'informations 
              sur le projet, la fondation et la Ferme du Temple. Nous nous ferons un 
              plaisir de vous en dire davantage.
            </p>
            <Button 
              variant="nature"
              onClick={() => document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full"
            >
              Candidater maintenant
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Collectif Beaver - Habitat partagé de la Ferme du Temple</p>
          <p className="mt-2">Janvier 2025 - Conçu avec passion pour un avenir durable</p>
        </div>
      </div>
    </footer>
  );
};