import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
  return (
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
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};
