import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Train, Car, Plane } from "lucide-react";
import { MapView } from "./MapView";

export const LocationSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-8">
              LA FERME DU TEMPLE
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-nature-green mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Localisation</h3>
                  <p className="text-muted-foreground">
                    227 rue Joseph Wauters, 7080 Frameries<br/>
                    Proche de Mons, Province du Hainaut, Belgique
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-nature-green/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Train className="w-5 h-5 text-nature-green" />
                      <h4 className="font-semibold">Transport ferroviaire</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Gare SNCB Frameries : 5min à pied</li>
                      <li>Mons : 5min en train</li>
                      <li>Bruxelles : 1H05</li>
                      <li>Tournai : 45min</li>
                      <li>Lille : 1H20</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-nature-green/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Car className="w-5 h-5 text-nature-green" />
                      <h4 className="font-semibold">Transport routier</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Mons : 15min</li>
                      <li>Bruxelles : 1h</li>
                      <li>Tournai : 1h</li>
                      <li>Vélo via Ravel : 25min vers Mons</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-accent/30 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Plane className="w-5 h-5 text-nature-brown" />
                    <h4 className="font-semibold">Aéroport</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aéroport de Charleroi : 40min en voiture
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">
              UN PATRIMOINE HISTORIQUE EXCEPTIONNEL
            </h3>
            <div className="space-y-4 text-muted-foreground">
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

            <div className="mt-12 p-10 bg-nature-green/10 rounded-xl">
              <h4 className="text-3xl font-bold text-foreground mb-8">Le domaine aujourd'hui</h4>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li>• 7 hectares de prairies arborées</li>
                <li>• Ruisseau traversant la parcelle</li>
                <li>• Imposant corps de logis historique</li>
                <li>• Ancienne chapelle du XIIe siècle</li>
                <li>• Ancienne forge et ateliers</li>
                <li>• Écuries surmontées de fenils</li>
                <li>• Serre de 80 mètres</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Localisation sur la carte
          </h3>
          <div className="rounded-xl overflow-hidden shadow-lg border border-nature-green/20">
            <MapView />
          </div>
        </div>
      </div>
    </section>
  );
};