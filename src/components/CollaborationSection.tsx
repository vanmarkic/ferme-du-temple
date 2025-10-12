import { SectionTitle } from "./SectionTitle";

interface CollaborationContent {
  title?: string;
  alignment?: string;
}

interface CollaborationSectionProps {
  content?: CollaborationContent;
  body?: string;
}

export const CollaborationSection = ({ content, body }: CollaborationSectionProps = {}) => {
  const {
    title,
    alignment = "center",
  } = content || {};

  // Parse main content paragraphs from markdown body
  const parseMainContent = (bodyContent?: string): string[] => {
    if (!bodyContent) return [];

    // Extract paragraphs before the "# Engagement actuel" section
    const beforeEngagement = bodyContent.split(/# Engagement actuel/)[0];

    // Split by double newlines to get paragraphs
    const paragraphs = beforeEngagement
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p && !p.startsWith('---') && !p.startsWith('title:') && !p.startsWith('alignment:'));

    return paragraphs;
  };

  // Parse engagement content from markdown body
  const parseEngagement = (bodyContent?: string): string[] => {
    if (!bodyContent) return [];

    const engagementMatch = bodyContent.match(/# Engagement actuel\s+([\s\S]+?)$/);
    if (engagementMatch) {
      return engagementMatch[1]
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p);
    }

    return [];
  };

  const mainContent = parseMainContent(body);
  const engagementContent = parseEngagement(body);

  return (
    <section data-testid="collaboration-section" id="collaboration" className="py-48 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <SectionTitle alignment={alignment as any} accentLine="none">
          {title}
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            {mainContent.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {engagementContent.length > 0 && (
            <div className="bg-primary text-primary-foreground p-8 border-4 border-rich-black">
              <div className="space-y-4">
                {engagementContent.map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "font-medium" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
