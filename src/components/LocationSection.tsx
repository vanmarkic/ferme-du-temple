import { MapPin, Train, Car, Plane } from "lucide-react";
import { MapView } from "./MapView";
import { PropertyCarousel } from "./PropertyCarousel";
import floorPlan from "@/assets/floor-plan.png";


export const LocationSection = () => {
  return (
    <section className="py-48 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title - Bauhaus Style */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          <div className="col-span-12 md:col-span-7">
            <div className="relative">
              <div className="absolute -left-8 top-0 w-2 h-64 bg-butter-yellow"></div>
              <h2 className="text-5xl md:text-7xl font-display text-foreground mb-12 ml-8">
                LA FERME<br/>DU TEMPLE
              </h2>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 md:mt-24">
            <div className="flex items-start gap-4 bg-butter-yellow p-8">
              <MapPin className="w-8 h-8 text-magenta mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-rich-black mb-2">227 avenue Joseph Wauters</p>
                <p className="text-rich-black">7080 Frameries</p>
                <p className="text-rich-black">Province du Hainaut, Belgique</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transport Grid - Asymmetric Layout */}
        <div className="grid grid-cols-12 gap-8 mb-64">
          {/* Train */}
          <div className="col-span-12 md:col-span-5 relative">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-magenta/20"></div>
            <div className="bg-background border-2 border-rich-black p-8 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Train className="w-6 h-6 text-magenta" />
                <h4 className="font-bold text-xl uppercase tracking-wider">Transport ferroviaire</h4>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li>Gare SNCB Frameries : 5min à pied</li>
                <li>Mons : 5min en train</li>
                <li>Bruxelles : 1H05</li>
                <li>Tournai : 45min</li>
                <li>Lille : 1H20</li>
              </ul>
            </div>
          </div>

          {/* White Space */}
          <div className="hidden md:block col-span-1"></div>

          {/* Car - Offset */}
          <div className="col-span-12 md:col-span-5 md:mt-24">
            <div className="bg-butter-yellow p-8">
              <div className="flex items-center gap-3 mb-6">
                <Car className="w-6 h-6 text-rich-black" />
                <h4 className="font-bold text-xl uppercase tracking-wider text-rich-black">Transport routier</h4>
              </div>
              <ul className="space-y-3 text-rich-black">
                <li>Mons : 15min</li>
                <li>Bruxelles : 1h</li>
                <li>Tournai : 1h</li>
                <li>Vélo via Ravel : 25min vers Mons</li>
              </ul>
            </div>
          </div>

          {/* Airport - Full Width Below */}
          <div className="col-span-12 md:col-span-4 md:col-start-3">
            <div className="bg-butter-yellow/30 border-2 border-butter-yellow p-8">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-6 h-6 text-rich-black" />
                <h4 className="font-bold text-xl uppercase tracking-wider">Aéroport</h4>
              </div>
              <p className="text-muted-foreground">Aéroport de Charleroi : 40min en voiture</p>
            </div>
          </div>
        </div>

        {/* Historical Heritage - Overlapping Layout */}
        <div className="grid grid-cols-12 gap-0 mb-64">
          <div className="col-span-12 md:col-span-6 md:col-start-2 mb-16 md:mb-0">
            <div className="relative">
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-magenta z-0"></div>
              <div className="bg-background p-12 relative z-10">
                <h3 className="text-3xl md:text-5xl font-display text-foreground mb-8 uppercase">
                  Un patrimoine<br/>historique<br/>exceptionnel
                </h3>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    La Ferme du Temple garde en elle les souvenirs d'un passé chargé d'histoire. 
                    Son histoire commence avec les chevaliers de l'Ordre des Templiers qui firent bâtir 
                    une chapelle datant du XIIe siècle.
                  </p>
                  <p>
                    Le Temple était une commanderie, le siège d'une exploitation agricole servant de 
                    pied à terre, d'auberge et de relais pour les membres de l'Ordre.
                  </p>
                  <p>
                    En 1858, Victor Mirland, industriel français, acheta la « Ferme du Temple » 
                    pour y développer une fabrique de pâtes de fruits et confitures « Mirland & Cie » 
                    jusqu'en 1979.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 md:-ml-16 relative z-20">
            <img 
              src={floorPlan} 
              alt="Plan de la Ferme du Temple"
              className="w-full h-auto shadow-2xl max-w-2xl"
              loading="lazy"
              decoding="async"
              style={{ maxHeight: '800px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Domain Today - Bold Typography */}
        <div className="mb-32 px-4 md:px-0">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-16 md:w-32 h-2 bg-magenta"></div>
              <h4 className="text-3xl md:text-6xl font-display text-foreground mb-16 mt-8 break-words">
                Le domaine<br/>aujourd'hui
              </h4>
              
              <div className="grid md:grid-cols-2 gap-x-4 md:gap-x-16 gap-y-6 text-lg">
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">7 hectares de prairies arborées</p>
                  <p className="text-muted-foreground leading-relaxed">Ruisseau traversant la parcelle</p>
                  <p className="text-muted-foreground leading-relaxed">Imposant corps de logis historique</p>
                  <p className="text-muted-foreground leading-relaxed">Ancienne chapelle du XIIe siècle</p>
                </div>
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">Ancienne forge et ateliers</p>
                  <p className="text-muted-foreground leading-relaxed">Écuries surmontées de fenils</p>
                  <p className="text-muted-foreground leading-relaxed">Serre de 80 mètres</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Carousel */}
        <div className="mb-48">
          <div className="mb-12 ml-0 md:ml-16">
            <h5 className="text-3xl md:text-5xl font-display text-foreground uppercase">
              Découvrez le domaine<br/>en images
            </h5>
          </div>
          <PropertyCarousel />
        </div>

        {/* Map */}
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <div className="relative">
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-butter-yellow/30 z-0"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-foreground mb-8 uppercase tracking-wider">
                  Localisation sur la carte
                </h3>
                <div className="shadow-2xl border-4 border-rich-black">
                  <MapView />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};