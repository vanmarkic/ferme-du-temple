import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* Grid Layout System (12-column grid)
       *
       * Standard column patterns:
       * - Full width: col-span-12
       *   Use for: Hero images, full-width sections
       *
       * - Standard content: col-span-10 col-start-2
       *   Use for: Most sections, forms, footer, general content
       *
       * - Reading-optimized: col-span-8 col-start-3
       *   Use for: Text-heavy content, articles, timeline titles
       *
       * - Half width: col-span-6 or col-span-5
       *   Use for: Two-column layouts, pricing cards, location blocks
       *
       * - Asymmetric small: col-span-4
       *   Use for: Bauhaus-style offset content, project poles
       *
       * Column start positions (for intentional asymmetry):
       * - col-start-2: Slight indent (standard content)
       * - col-start-3: Medium indent (reading-optimized content)
       * - col-start-4+: Strong asymmetric offset (Bauhaus style)
       * - col-start-5+: Maximum asymmetric offset (timeline content)
       */
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'display': ['Poppins Display', 'Montserrat', 'sans-serif'],
      },
      // Type Scale System using Major Third (1.25) ratio
      // Fluid responsive font sizes using clamp() for smooth scaling across viewports
      // Formula: clamp(min, preferred, max) where preferred uses viewport units
      fontSize: {
        // Small text - scales from 13px to 14px
        'xs': ['clamp(0.8125rem, 0.75rem + 0.3125vw, 0.875rem)', { lineHeight: '1.5', letterSpacing: '0.025em' }],

        // Small text - scales from 14px to 15px
        'sm': ['clamp(0.875rem, 0.8125rem + 0.3125vw, 0.9375rem)', { lineHeight: '1.5', letterSpacing: '0.015em' }],

        // Body text - scales from 16px (mobile) to 17px (desktop)
        'base': ['clamp(1rem, 0.9375rem + 0.3125vw, 1.0625rem)', { lineHeight: '1.6' }],

        // Large body - scales from 18px to 22px
        'lg': ['clamp(1.125rem, 1rem + 0.625vw, 1.375rem)', { lineHeight: '1.5' }],

        // h5 - scales from 20px to 28px
        'xl': ['clamp(1.25rem, 1rem + 1.25vw, 1.75rem)', { lineHeight: '1.4' }],

        // h4 - scales from 24px to 36px
        '2xl': ['clamp(1.5rem, 1.125rem + 1.875vw, 2.25rem)', { lineHeight: '1.3' }],

        // h3 - scales from 28px to 44px
        '3xl': ['clamp(1.75rem, 1.25rem + 2.5vw, 2.75rem)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],

        // h2 - scales from 36px to 56px
        '4xl': ['clamp(2.25rem, 1.625rem + 3.125vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],

        // h1 - scales from 44px to 68px
        '5xl': ['clamp(2.75rem, 2rem + 3.75vw, 4.25rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],

        // Display - scales from 52px to 84px
        '6xl': ['clamp(3.25rem, 2.375rem + 4.375vw, 5.25rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],

        // Large Display - scales from 60px to 100px
        '7xl': ['clamp(3.75rem, 2.75rem + 5vw, 6.25rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],

        // Hero - scales from 72px to 120px
        '8xl': ['clamp(4.5rem, 3.25rem + 6.25vw, 7.5rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      // Line heights for different text types
      lineHeight: {
        'body': '1.6',        // Body text
        'relaxed': '1.7',     // Comfortable reading
        'loose': '1.8',       // Very comfortable
        'heading': '1.2',     // Headings
        'tight': '1.1',       // Large headings
        'none': '1',          // Display text
      },
      // Letter spacing adjustments
      letterSpacing: {
        'tighter': '-0.04em',
        'tight': '-0.025em',
        'heading': '-0.015em',
        'normal': '0',
        'wide': '0.015em',
        'wider': '0.025em',
      },
      // Max widths for optimal reading (45-75 characters)
      maxWidth: {
        'reading': '65ch',    // Ideal: 66 characters
        'reading-narrow': '45ch',
        'reading-wide': '75ch',
      },
      // Spacing scale for vertical rhythm (8px base unit)
      // Semantic spacing tokens for consistent layout rhythm
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px

        // Semantic vertical spacing (margin-bottom)
        'section-subsection': '4rem',      // 64px - mb-16 - Space between sub-sections
        'section-related': '8rem',         // 128px - mb-32 - Related section spacing
        'section-major': '12rem',          // 192px - mb-48 - Major section category spacing
        'section-break': '16rem',          // 256px - mb-64 - Critical section breaks

        // Semantic horizontal spacing (margin-left for asymmetric indents)
        'indent-small': '2rem',            // 32px - ml-8 - Small content indent
        'indent-medium': '4rem',           // 64px - ml-16 - Medium content indent
        'indent-large': '8rem',            // 128px - ml-32 - Large asymmetric indent
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        magenta: {
          DEFAULT: "hsl(var(--magenta))",
          dark: "hsl(var(--magenta-dark))",
        },
        yellow: {
          butter: "hsl(var(--butter-yellow))",
        },
        nature: {
          green: "hsl(var(--nature-green))",
          brown: "hsl(var(--earth-brown))",
          beige: "hsl(var(--warm-beige))",
          cream: "hsl(var(--soft-cream))",
          dark: "hsl(var(--forest-dark))",
        },
        "butter-yellow": "hsl(var(--butter-yellow))",
        "warm-beige": "hsl(var(--warm-beige))",
        "concrete-light": "hsl(var(--concrete-light))",
        "text-dark": "hsl(var(--text-dark))",
        "rich-black": "hsl(var(--rich-black))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
