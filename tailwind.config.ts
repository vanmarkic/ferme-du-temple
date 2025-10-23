import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
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
      // Desktop sizes reduced by 20% for more compact UI
      fontSize: {
        // Small text - scales from 13px to 11.2px (desktop reduced 20%)
        'xs': ['clamp(0.8125rem, 0.75rem + 0.3125vw, 0.7rem)', { lineHeight: '1.5', letterSpacing: '0.025em' }],

        // Small text - scales from 14px to 12px (desktop reduced 20%)
        'sm': ['clamp(0.875rem, 0.8125rem + 0.3125vw, 0.75rem)', { lineHeight: '1.5', letterSpacing: '0.015em' }],

        // Body text - scales from 16px (mobile) to 13.6px (desktop reduced 20%)
        'base': ['clamp(1rem, 0.9375rem + 0.3125vw, 0.85rem)', { lineHeight: '1.6' }],

        // Large body - scales from 18px to 17.6px (desktop reduced 20%)
        'lg': ['clamp(1.125rem, 1rem + 0.625vw, 1.1rem)', { lineHeight: '1.5' }],

        // h5 - scales from 20px to 22.4px (desktop reduced 20%)
        'xl': ['clamp(1.25rem, 1rem + 1.25vw, 1.4rem)', { lineHeight: '1.4' }],

        // h4 - scales from 20px to 28.8px (desktop reduced 20%)
        '2xl': ['clamp(1.25rem, 0.875rem + 1.875vw, 1.8rem)', { lineHeight: '1.3' }],

        // h3 - scales from 22px to 35.2px (desktop reduced 20%)
        '3xl': ['clamp(1.375rem, 0.875rem + 2.5vw, 2.2rem)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],

        // h2 - scales from 28px to 44.8px (desktop reduced 20%)
        '4xl': ['clamp(1.75rem, 1.125rem + 3.125vw, 2.8rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],

        // h1 - scales from 32px to 54.4px (desktop reduced 20%)
        '5xl': ['clamp(2rem, 1.375rem + 3.125vw, 3.4rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],

        // Display - scales from 36px to 67.2px (desktop reduced 20%)
        '6xl': ['clamp(2.25rem, 1.5rem + 3.75vw, 4.2rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],

        // Large Display - scales from 40px to 80px (desktop reduced 20%)
        '7xl': ['clamp(2.5rem, 1.625rem + 4.375vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],

        // Hero - scales from 44px to 96px (desktop reduced 20%)
        '8xl': ['clamp(2.75rem, 1.75rem + 5vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
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
      // Desktop spacing reduced by 20%
      spacing: {
        '18': '3.6rem',   // 57.6px (reduced 20%)
        '22': '4.4rem',   // 70.4px (reduced 20%)
        '26': '5.2rem',   // 83.2px (reduced 20%)
        '30': '6rem',     // 96px (reduced 20%)
        '34': '6.8rem',   // 108.8px (reduced 20%)

        // Semantic vertical spacing (margin-bottom) - reduced 20%
        'section-subsection': '3.2rem',    // 51.2px - Space between sub-sections
        'section-related': '6.4rem',       // 102.4px - Related section spacing
        'section-major': '9.6rem',         // 153.6px - Major section category spacing
        'section-break': '12.8rem',        // 204.8px - Critical section breaks

        // Semantic horizontal spacing (margin-left for asymmetric indents) - reduced 20%
        'indent-small': '1.6rem',          // 25.6px - Small content indent
        'indent-medium': '3.2rem',         // 51.2px - Medium content indent
        'indent-large': '6.4rem',          // 102.4px - Large asymmetric indent
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
