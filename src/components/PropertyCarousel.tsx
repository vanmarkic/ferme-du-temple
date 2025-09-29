import { useState, useEffect, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import property1 from "@/assets/property-1.webp";
import property2 from "@/assets/property-2.webp";
import property3 from "@/assets/property-3.webp";
import property4 from "@/assets/property-4.webp";
import property5 from "@/assets/property-5.webp";
import property6 from "@/assets/property-6.webp";
import property7 from "@/assets/property-7.webp";
import property8 from "@/assets/property-8.webp";
import property9 from "@/assets/property-9.webp";
import property10 from "@/assets/property-10.webp";

const propertyImages = [
  { src: property5, alt: "Vue aérienne de la Ferme du Temple" },
  { src: property6, alt: "Vue aérienne du domaine" },
  { src: property8, alt: "Bâtiment principal de la ferme" },
  { src: property9, alt: "Écuries et bâtiments annexes" },
  { src: property10, alt: "Vue panoramique des bâtiments" },
  { src: property7, alt: "Paysage entourant le domaine" },
  { src: property2, alt: "Intérieur de l'ancienne chapelle" },
  { src: property4, alt: "Salle voûtée avec colonnes" },
  { src: property1, alt: "Couloir avec plafond voûté" },
  { src: property3, alt: "Charpente en bois des greniers" },
];

export const PropertyCarousel = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handlePrevious = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + propertyImages.length) % propertyImages.length);
    }
  }, [selectedImageIndex]);

  const handleNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % propertyImages.length);
    }
  }, [selectedImageIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === 'ArrowLeft') {
          handlePrevious();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === 'Escape') {
          setSelectedImageIndex(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handlePrevious, handleNext]);
  return (
    <>
      <div className="w-full">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {propertyImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <div 
                    className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                        Voir en plein écran
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-black/95 border-none z-[9999]">
          <DialogTitle className="sr-only">
            {selectedImageIndex !== null ? propertyImages[selectedImageIndex].alt : ''}
          </DialogTitle>
          
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 z-[10000] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {selectedImageIndex !== null && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-[10000] h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={handlePrevious}
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-[10000] h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={handleNext}
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                {selectedImageIndex + 1} / {propertyImages.length}
              </div>

              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={propertyImages[selectedImageIndex].src}
                  alt={propertyImages[selectedImageIndex].alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
