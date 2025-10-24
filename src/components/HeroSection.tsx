import { PropertyCarousel } from './PropertyCarousel';

interface HeroContent {
  mainTitle?: string;
  mainSubtitle?: string;
  secondaryTitle?: string;
  tagline1?: string;
  tagline2?: string;
  tagline3?: string;
  imageAlt1?: string;
  imageAlt2?: string;
  imageAlt3?: string;
  imageAlt4?: string;
  communityCaption?: string;
  imagesTitle?: string;
}

interface HeroSectionProps {
  content?: HeroContent;
}

export const HeroSection = ({ content }: HeroSectionProps = {}) => {
  const {
    mainTitle,
    mainSubtitle,
    secondaryTitle,
    tagline1,
    tagline2,
    tagline3,
    imageAlt1,
    imageAlt2,
    imageAlt3,
    imageAlt4,
    imagesTitle,
  } = content || {};

  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen bg-background overflow-hidden overflow-x-hidden pt-5"
    >
      {/* Bauhaus Grid Layout with Overlapping Elements */}
      <div className="container mx-auto pt-8 pb-16 md:py-32 px-3 md:px-4">
        {/* Main Title - Reduced Asymmetry */}
        <div className="relative mb-16 ml-0 md:ml-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-display text-display text-rich-black break-words hyphens-auto leading-tight">
            {mainTitle}
            <span className="block mt-2">{mainSubtitle}</span>
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display mt-6 md:mt-8 text-magenta leading-tight tracking-tight break-words hyphens-auto">
            {secondaryTitle}
          </h2>
          <div className="hidden md:block absolute -right-8 top-8 w-32 h-32 bg-magenta/20 -z-10"></div>
        </div>
        <div className="mb-48">
          <PropertyCarousel />
        </div>
        {/* Asymmetric Grid with Overlapping Images */}
        <div className="grid grid-cols-12 gap-0 mb-48">
          {/* Property Carousel */}

          {/* Large Interior Image - Starting Point */}
          {/* <div className="col-span-12 flex justify-center items-center relative z-20 mb-8 md:mb-0">
            <img
              src={interior1.src}
              alt={imageAlt1}
              className="w-full h-[70vh] object-cover shadow-2xl"
              loading="eager"
              decoding="async"
              style={{ maxWidth: '1200px', maxHeight: '800px' }}
            />
          </div> */}

          {/* Overlapping Text Block - Reduced Asymmetry */}
          <div className="col-span-12 md:col-span-5 md:col-start-6 md:-ml-16 relative z-30 bg-butter-yellow p-12 md:mt-12">
            <div className="text-rich-black">
              <p className="text-lg font-medium leading-relaxed max-w-reading-narrow">
                {tagline1}
              </p>
              <p className="text-lg font-medium leading-relaxed max-w-reading-narrow">
                {tagline2}
              </p>
              <p className="text-lg font-medium leading-relaxed max-w-reading-narrow">
                {tagline3}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Images Grid - Bauhaus Style */}
        <div className="grid grid-cols-12 gap-0 md:gap-8 items-start mb-32">
          {/* Building Exterior */}
          <div className="col-span-12 md:col-span-5 relative">
            <div className="hidden md:block absolute -top-8 -left-8 w-24 h-24 bg-magenta z-10"></div>
            <picture>
              <source
                type="image/avif"
                media="(max-width: 640px)"
                srcSet="/images/mobile/building-exterior.avif"
              />
              <source
                type="image/avif"
                media="(max-width: 1024px)"
                srcSet="/images/tablet/building-exterior.avif"
              />
              <source
                type="image/avif"
                srcSet="/images/desktop/building-exterior.avif"
              />
              <source
                type="image/webp"
                media="(max-width: 640px)"
                srcSet="/images/mobile/building-exterior.webp"
              />
              <source
                type="image/webp"
                media="(max-width: 1024px)"
                srcSet="/images/tablet/building-exterior.webp"
              />
              <source
                type="image/webp"
                srcSet="/images/desktop/building-exterior.webp"
              />
              <img
                src="/images/desktop/building-exterior.jpg"
                alt={imageAlt2}
                className="w-full h-[50vh] object-cover relative z-20"
                loading="lazy"
                decoding="async"
                style={{ maxWidth: '800px', maxHeight: '600px' }}
              />
            </picture>
          </div>

          {/* White Space Column */}
          <div className="col-span-12 md:col-span-2"></div>

          {/* Community Field - Reduced Asymmetry */}
          <div className="col-span-12 md:col-span-5 md:mt-12">
            <img
              src={interior1.src}
              alt={imageAlt1}
              className="w-full h-[70vh] object-cover shadow-2xl"
              loading="eager"
              decoding="async"
              style={{ maxWidth: '1200px', maxHeight: '800px' }}
            />
          </div>
        </div>

        {/* Final Image with Geometric Overlap - More Centered */}
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-6 md:col-start-3 relative">
            <div className="hidden md:block absolute -bottom-12 -right-12 w-48 h-48 bg-butter-yellow z-10"></div>
            <img
              src={greenhouse.src}
              alt={imageAlt4}
              className="w-full h-[45vh] object-cover relative z-20"
              loading="lazy"
              decoding="async"
              style={{ maxWidth: '900px', maxHeight: '550px' }}
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
