export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-butter-yellow">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-rich-black">
          L'HABITAT PARTAGÉ
          <span className="block text-magenta text-4xl md:text-6xl mt-2 font-extrabold">
            DE LA FERME DU TEMPLE
          </span>
        </h1>
        
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-xl md:text-2xl font-medium mb-4 text-rich-black">
            UN LIEU DE VIE ANCRÉ DANS LE TERRITOIRE,
          </p>
          <p className="text-xl md:text-2xl font-medium mb-4 text-rich-black">
            DYNAMIQUE ET PRODUCTIF,
          </p>
          <p className="text-xl md:text-2xl font-medium text-rich-black">
            S'ARTICULANT AUTOUR DE LA CULTURE DES ARTS ET DE LA TERRE
          </p>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-rich-black/50 flex justify-center">
          <div className="w-1 h-3 bg-rich-black/70 mt-2"></div>
        </div>
      </div>
    </section>
  );
};