import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Lazy load dialog components (only needed on click)
const Dialog = lazy(() => import("@/components/ui/dialog").then(mod => ({ default: mod.Dialog })));
const DialogContent = lazy(() => import("@/components/ui/dialog").then(mod => ({ default: mod.DialogContent })));
const DialogTitle = lazy(() => import("@/components/ui/dialog").then(mod => ({ default: mod.DialogTitle })));
const Button = lazy(() => import("@/components/ui/button").then(mod => ({ default: mod.Button })));

const propertyImages = [
  {
    src: "/images/carousel/property-5.jpg",
    srcMobile: "/images/carousel/property-5-mobile.jpg",
    webp: "/images/carousel/property-5.webp",
    webpMobile: "/images/carousel/property-5-mobile.webp",
    avif: "/images/carousel/property-5.avif",
    avifMobile: "/images/carousel/property-5-mobile.avif",
    alt: "Vue aérienne de la Ferme du Temple",
    name: "property-5"
  },
  {
    src: "/images/carousel/property-6.jpg",
    srcMobile: "/images/carousel/property-6-mobile.jpg",
    webp: "/images/carousel/property-6.webp",
    webpMobile: "/images/carousel/property-6-mobile.webp",
    avif: "/images/carousel/property-6.avif",
    avifMobile: "/images/carousel/property-6-mobile.avif",
    alt: "Vue aérienne du domaine",
    name: "property-6"
  },
  {
    src: "/images/carousel/property-8.jpg",
    srcMobile: "/images/carousel/property-8-mobile.jpg",
    webp: "/images/carousel/property-8.webp",
    webpMobile: "/images/carousel/property-8-mobile.webp",
    avif: "/images/carousel/property-8.avif",
    avifMobile: "/images/carousel/property-8-mobile.avif",
    alt: "Bâtiment principal de la ferme",
    name: "property-8"
  },
  {
    src: "/images/carousel/property-9.jpg",
    srcMobile: "/images/carousel/property-9-mobile.jpg",
    webp: "/images/carousel/property-9.webp",
    webpMobile: "/images/carousel/property-9-mobile.webp",
    avif: "/images/carousel/property-9.avif",
    avifMobile: "/images/carousel/property-9-mobile.avif",
    alt: "Écuries et bâtiments annexes",
    name: "property-9"
  },
  {
    src: "/images/carousel/property-10.jpg",
    srcMobile: "/images/carousel/property-10-mobile.jpg",
    webp: "/images/carousel/property-10.webp",
    webpMobile: "/images/carousel/property-10-mobile.webp",
    avif: "/images/carousel/property-10.avif",
    avifMobile: "/images/carousel/property-10-mobile.avif",
    alt: "Vue panoramique des bâtiments",
    name: "property-10"
  },
  {
    src: "/images/carousel/property-7.jpg",
    srcMobile: "/images/carousel/property-7-mobile.jpg",
    webp: "/images/carousel/property-7.webp",
    webpMobile: "/images/carousel/property-7-mobile.webp",
    avif: "/images/carousel/property-7.avif",
    avifMobile: "/images/carousel/property-7-mobile.avif",
    alt: "Paysage entourant le domaine",
    name: "property-7"
  },
  {
    src: "/images/carousel/property-2.jpg",
    srcMobile: "/images/carousel/property-2-mobile.jpg",
    webp: "/images/carousel/property-2.webp",
    webpMobile: "/images/carousel/property-2-mobile.webp",
    avif: "/images/carousel/property-2.avif",
    avifMobile: "/images/carousel/property-2-mobile.avif",
    alt: "Intérieur de l'ancienne chapelle",
    name: "property-2"
  },
  {
    src: "/images/carousel/property-4.jpg",
    srcMobile: "/images/carousel/property-4-mobile.jpg",
    webp: "/images/carousel/property-4.webp",
    webpMobile: "/images/carousel/property-4-mobile.webp",
    avif: "/images/carousel/property-4.avif",
    avifMobile: "/images/carousel/property-4-mobile.avif",
    alt: "Salle voûtée avec colonnes",
    name: "property-4"
  },
  {
    src: "/images/carousel/property-1.jpg",
    srcMobile: "/images/carousel/property-1-mobile.jpg",
    webp: "/images/carousel/property-1.webp",
    webpMobile: "/images/carousel/property-1-mobile.webp",
    avif: "/images/carousel/property-1.avif",
    avifMobile: "/images/carousel/property-1-mobile.avif",
    alt: "Couloir avec plafond voûté",
    name: "property-1"
  },
  {
    src: "/images/carousel/property-3.jpg",
    srcMobile: "/images/carousel/property-3-mobile.jpg",
    webp: "/images/carousel/property-3.webp",
    webpMobile: "/images/carousel/property-3-mobile.webp",
    avif: "/images/carousel/property-3.avif",
    avifMobile: "/images/carousel/property-3-mobile.avif",
    alt: "Charpente en bois des greniers",
    name: "property-3"
  },
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
                    <picture>
                      <source
                        type="image/avif"
                        srcSet={`${image.avifMobile} 750w, ${image.avif} 800w`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <source
                        type="image/webp"
                        srcSet={`${image.webpMobile} 750w, ${image.webp} 800w`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <img
                        src={image.src}
                        srcSet={`${image.srcMobile} 750w, ${image.src} 800w`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : undefined}
                        decoding="async"
                        width="800"
                        height="450"
                      />
                    </picture>
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

      {selectedImageIndex !== null && (
        <Suspense fallback={null}>
          <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
            <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-black/95 border-none z-[9999]">
              <DialogTitle className="sr-only">
                {propertyImages[selectedImageIndex].alt}
              </DialogTitle>

              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 z-[10000] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-white" />
              </button>

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
                <picture>
                  <source
                    type="image/avif"
                    srcSet={propertyImages[selectedImageIndex].avif}
                  />
                  <source
                    type="image/webp"
                    srcSet={propertyImages[selectedImageIndex].webp}
                  />
                  <img
                    src={propertyImages[selectedImageIndex].src}
                    alt={propertyImages[selectedImageIndex].alt}
                    className="max-w-full max-h-full object-contain"
                    loading="eager"
                    decoding="async"
                    width="800"
                    height="450"
                  />
                </picture>
              </div>
            </DialogContent>
          </Dialog>
        </Suspense>
      )}
    </>
  );
};
