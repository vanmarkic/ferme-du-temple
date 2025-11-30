import { GuidePasswordGate } from './GuidePasswordGate';
import { Navigation } from './Navigation';
import type { NavigationContent } from './Navigation';
import { Footer } from './Footer';

interface HistoriqueAccessContent {
  title: string;
  description: string;
  passwordPlaceholder: string;
  submitButton: string;
  errorMessage: string;
}

interface HistoriquePageProps {
  password: string;
  historiqueAccessContent: HistoriqueAccessContent;
  navigationContent: NavigationContent;
  footerContent: any;
  footerBody: string;
  content: string;
}

export function HistoriquePage({
  password,
  historiqueAccessContent,
  navigationContent,
  footerContent,
  footerBody,
  content,
}: HistoriquePageProps) {
  return (
    <GuidePasswordGate correctPassword={password} content={historiqueAccessContent}>
      <Navigation content={navigationContent} />
      <div className="min-h-screen pt-20">
        <section className="container mx-auto px-4 py-16">
          <div
            className="prose prose-lg max-w-reading mx-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
        <Footer content={footerContent} body={footerBody} />
      </div>
    </GuidePasswordGate>
  );
}
