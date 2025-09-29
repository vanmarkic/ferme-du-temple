import { Button } from "@/components/ui/button";
import heroImage from "@/assets/ferme-du-temple-hero.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="La Ferme du Temple - Habitat partagé historique"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-nature-green/70"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          L'HABITAT PARTAGÉ
          <span className="block text-accent text-4xl md:text-6xl mt-2">
            DE LA FERME DU TEMPLE
          </span>
        </h1>
        
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-xl md:text-2xl font-medium mb-4">
            UN LIEU DE VIE ANCRÉ DANS LE TERRITOIRE,
          </p>
          <p className="text-xl md:text-2xl font-medium mb-4">
            DYNAMIQUE ET PRODUCTIF,
          </p>
          <p className="text-xl md:text-2xl font-medium">
            S'ARTICULANT AUTOUR DE LA CULTURE DES ARTS ET DE LA TERRE
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="nature" 
            size="lg"
            onClick={() => document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-lg px-8 py-6"
          >
            Rejoindre l'aventure
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById('projet')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Découvrir le projet
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};