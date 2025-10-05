import interior1 from "@/assets/interior-1.jpg";
import buildingExterior from "@/assets/building-exterior.jpg";
import communityField from "@/assets/community-field.jpg";
import greenhouse from "@/assets/greenhouse.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Bauhaus Grid Layout with Overlapping Elements */}
      <div className="container mx-auto px-4 py-32">
        {/* Main Title - Positioned Asymmetrically */}
        <div className="relative mb-32 ml-8 md:ml-16">
          <h1 className="text-6xl md:text-8xl font-bold leading-none text-rich-black">
            L'HABITAT
            <span className="block mt-2">PARTAGÉ</span>
          </h1>
          <div className="absolute -right-8 top-8 w-32 h-32 bg-magenta/20 -z-10"></div>
        </div>

        {/* Asymmetric Grid with Overlapping Images */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          {/* Large Interior Image - Starting Point */}
          <div className="col-span-12 md:col-span-7 relative z-20 mb-8 md:mb-0">
            <img 
              src={interior1} 
              alt="Intérieur de la Ferme du Temple"
              className="w-full h-[70vh] object-cover shadow-2xl"
            />
          </div>

          {/* Overlapping Text Block */}
          <div className="col-span-12 md:col-span-5 md:col-start-7 md:-ml-32 relative z-30 bg-butter-yellow p-12 md:mt-24">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-magenta">
              DE LA FERME DU TEMPLE
            </h2>
            <div className="space-y-6 text-rich-black">
              <p className="text-lg font-medium uppercase tracking-wider">
                Un lieu de vie ancré dans le territoire,
              </p>
              <p className="text-lg font-medium uppercase tracking-wider">
                Dynamique et productif,
              </p>
              <p className="text-lg font-medium uppercase tracking-wider">
                S'articulant autour de la culture des arts et de la terre
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Images Grid - Bauhaus Style */}
        <div className="grid grid-cols-12 gap-8 items-start mb-32">
          {/* Building Exterior */}
          <div className="col-span-12 md:col-span-5 relative">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-magenta z-10"></div>
            <img 
              src={buildingExterior} 
              alt="Bâtiment extérieur de la ferme"
              className="w-full h-[50vh] object-cover relative z-20"
            />
          </div>

          {/* White Space Column */}
          <div className="col-span-12 md:col-span-2"></div>

          {/* Community Field */}
          <div className="col-span-12 md:col-span-5 md:mt-24">
            <img 
              src={communityField} 
              alt="Communauté dans les champs"
              className="w-full h-[40vh] object-cover shadow-xl"
            />
            <div className="mt-8 bg-butter-yellow/30 p-6 -ml-8">
              <p className="text-sm uppercase tracking-widest text-rich-black font-medium">
                Une communauté vivante
              </p>
            </div>
          </div>
        </div>

        {/* Final Image with Geometric Overlap */}
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-6 md:col-start-4 relative">
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-butter-yellow z-10"></div>
            <img 
              src={greenhouse} 
              alt="Serres de la ferme"
              className="w-full h-[45vh] object-cover relative z-20"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-rich-black/50 flex justify-center">
            <div className="w-1 h-3 bg-rich-black/70 mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};