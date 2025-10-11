export const CollaborationSection = () => {
  return (
    <section data-testid="collaboration-section" id="collaboration" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display mb-12 text-center">
          COLLABORATION
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <p>
              La gouvernance partagée est au centre de notre fonctionnement. Nous adoptons une 
              approche horizontale dans laquelle nous nous donnons du pouvoir à tous·tes, de la 
              responsabilité et de l'engagement dans la prise de décisions et dans la gestion 
              de notre collectif.
            </p>

            <p>
              Notre fonctionnement concernant les prises de décisions s'articule autour de 5 
              grandes thématiques : les réunions de gouvernance, stratégiques, opérationnelles, 
              de régulation et d'apprentissages. Nous privilégions le consensus et le consentement 
              afin de tenir compte des diversités des points de vue et des points de vue minoritaires.
            </p>

            <p>
              Les mandats sont clairement définis, cela nous permet de nous emparer des rôles 
              avec autonomie et de développer la confiance dans le collectif pour la réalisation 
              des missions portées par les autres.
            </p>

            <p>
              Les rôles et les mandats sont tournants afin que l'on puisse tous·tes prendre 
              part aux responsabilités.
            </p>

            <p>
              Le cadre des réunions se veut précis et sécurisant. Il se préoccupe du «être ensemble» 
              et pas uniquement du «faire ensemble».
            </p>
          </div>

          <div className="bg-primary text-primary-foreground p-8 border-4 border-rich-black">
            <div className="space-y-4">
              <p className="font-medium">
                → Actuellement, l'implication attendue est la participation à une réunion en 
                ligne par mois et une journée de travail en présentiel.
              </p>
              <p>
                Ainsi que s'investir dans les différents rôles déterminés dans notre gouvernance 
                et participer au minimum à un groupe de travail actif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
