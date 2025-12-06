import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const FAQ_EMBED_URL =
  'https://docs.google.com/document/d/e/2PACX-1vQL98vL4jn1eyXup-8mONcONwQqeHD4Wm6imCxiT1Ph_FkNlbrDhz_PPpzHGLLMKw/pub?embedded=true';

export const FAQSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-rich-black">
              Questions Fréquentes (FAQ)
            </h2>
            <ChevronDown
              className={`h-6 w-6 text-rich-black transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={FAQ_EMBED_URL}
                title="FAQ - Réponses aux candidats"
                className="w-full border-none"
                style={{ minHeight: '80vh' }}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};
