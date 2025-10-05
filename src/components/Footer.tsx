import { MapPin } from "lucide-react";

export const Footer = () => {
  const contacts = [
    "Annabelle Czyz", "Cathy Weyders", "Colin Ponthot", 
    "Jeremy Michel", "Julie Luyten", "Manuela Capraro", 
    "Dragan Markovic", "Séverin Malaud"
  ];

  return (
    <footer className="bg-nature-dark text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Contact */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p>227 avenue Joseph Wauters</p>
                  <p>7080 Frameries, Belgique</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-3">Membres du projet</h4>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                {contacts.map((contact, index) => (
                  <span key={index}>{contact}</span>
                ))}
              </div>
            </div>
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