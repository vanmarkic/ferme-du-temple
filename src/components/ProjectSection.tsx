import { Card, CardContent } from "@/components/ui/card";

export const ProjectSection = () => {
  const poles = [
    {
      title: "PÔLE HABITAT",
      description: "Une dizaine d'habitations autonomes en copropriété avec des espaces communs : cuisine collective, salle polyvalente, ateliers, espaces d'accueil."
    },
    {
      title: "PÔLE CULTUREL",
      description: "Un espace pollinisateur pour faire fleurir des idées, cultiver l'art sous différentes formes et tisser des liens sociaux. Un lieu de création et diffusion culturelle."
    },
    {
      title: "PÔLE TERRE",
      description: "Plus de 7 hectares pour développer un 'domaine gourmand' : potager, forêt comestible, vergers, vignoble, plantes aromatiques et médicinales."
    }
  ];

  return (
    <section id="projet" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            LE PROJET
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            L'habitat partagé de La Ferme du Temple est une pépinière de projets mixtes et innovants, 
            articulée autour de trois pôles principaux qui s'enrichissent mutuellement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {poles.map((pole, index) => (
            <Card key={index} className="group hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {pole.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pole.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white p-8 md:p-12 shadow-warm">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                POURQUOI LE COLLECTIF BEAVER?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Le nom Beaver signifie Castor en anglais. Ce mammifère fait partie d'une espèce-ingénieure 
                qui, comme l'être humain, aménage son écosystème et modifie intentionnellement son cadre de vie.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Espèce facilitatrice d'échanges et "ingénieure de la nature" tout comme le castor, 
                nous souhaitons fonder un nouveau lieu d'accueil et transformer positivement notre environnement 
                en soutenant une transition sociale et écologique.
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                7 adultes • 5 enfants • 4 unités de logement
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Architectes • Photographes • Artistes • Enseignants<br/>
                Musiciens • Herboristes • Entrepreneurs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};