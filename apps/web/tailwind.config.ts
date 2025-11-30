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
      // Desktop sizes reduced by 36% (20% + 20%) for more compact UI
      fontSize: {
        // Small text - scales from 13px to 9px (desktop reduced 36%)
        'xs': ['clamp(0.8125rem, 0.75rem + 0.3125vw, 0.56rem)', { lineHeight: '1.5', letterSpacing: '0.025em' }],

        // Small text - scales from 14px to 9.6px (desktop reduced 36%)
        'sm': ['clamp(0.875rem, 0.8125rem + 0.3125vw, 0.6rem)', { lineHeight: '1.5', letterSpacing: '0.015em' }],

        // Body text - scales from 16px (mobile) to 10.88px (desktop reduced 36%)
        'base': ['clamp(1rem, 0.9375rem + 0.3125vw, 0.68rem)', { lineHeight: '1.6' }],

        // Large body - scales from 18px to 14.08px (desktop reduced 36%)
        'lg': ['clamp(1.125rem, 1rem + 0.625vw, 0.88rem)', { lineHeight: '1.5' }],

        // h5 - scales from 20px to 17.92px (desktop reduced 36%)
        'xl': ['clamp(1.25rem, 1rem + 1.25vw, 1.12rem)', { lineHeight: '1.4' }],

        // h4 - scales from 20px to 23.04px (desktop reduced 36%)
        '2xl': ['clamp(1.25rem, 0.875rem + 1.875vw, 1.44rem)', { lineHeight: '1.3' }],

        // h3 - scales from 22px to 28.16px (desktop reduced 36%)
        '3xl': ['clamp(1.375rem, 0.875rem + 2.5vw, 1.76rem)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],

        // h2 - scales from 28px to 35.84px (desktop reduced 36%)
        '4xl': ['clamp(1.75rem, 1.125rem + 3.125vw, 2.24rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],

        // h1 - scales from 32px to 43.52px (desktop reduced 36%)
        '5xl': ['clamp(2rem, 1.375rem + 3.125vw, 2.72rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],

        // Display - scales from 36px to 53.76px (desktop reduced 36%)
        '6xl': ['clamp(2.25rem, 1.5rem + 3.75vw, 3.36rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],

        // Large Display - scales from 40px to 64px (desktop reduced 36%)
        '7xl': ['clamp(2.5rem, 1.625rem + 4.375vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],

        // Hero - scales from 44px to 76.8px (desktop reduced 36%)
        '8xl': ['clamp(2.75rem, 1.75rem + 5vw, 4.8rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
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
      // Desktop spacing reduced by 36% (20% + 20%)
      spacing: {
        '18': '2.88rem',   // 46.08px (reduced 36%)
        '22': '3.52rem',   // 56.32px (reduced 36%)
        '26': '4.16rem',   // 66.56px (reduced 36%)
        '30': '4.8rem',    // 76.8px (reduced 36%)
        '34': '5.44rem',   // 87.04px (reduced 36%)

        // Semantic vertical spacing (margin-bottom) - reduced 36%
        'section-subsection': '2.56rem',   // 40.96px - Space between sub-sections
        'section-related': '5.12rem',      // 81.92px - Related section spacing
        'section-major': '7.68rem',        // 122.88px - Major section category spacing
        'section-break': '10.24rem',       // 163.84px - Critical section breaks

        // Semantic horizontal spacing (margin-left for asymmetric indents) - reduced 36%
        'indent-small': '1.28rem',         // 20.48px - Small content indent
        'indent-medium': '2.56rem',        // 40.96px - Medium content indent
        'indent-large': '5.12rem',         // 81.92px - Large asymmetric indent
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
