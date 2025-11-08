import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        // Dashboard & Page Headings (Lora)
        'page-heading': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '700', letterSpacing: '-0.025em' }],  // 36px - "My Hive", "My Garden"
        'section-heading': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600', letterSpacing: '-0.02em' }],  // 28px - "Your SessIo"

        // Card Headings (Lora)
        'card-heading-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.015em' }],  // 24px - "Your Blooming Metrics"
        'card-heading': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.01em' }],   // 20px - "Angelica", card titles
        'card-subheading': ['1.125rem', { lineHeight: '1.625rem', fontWeight: '500' }],                        // 18px - section subtitles

        // Body Text (Poppins)
        'body-lg': ['1rem', { lineHeight: '1.625rem', fontWeight: '400' }],      // 16px - primary content
        'body': ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '400' }],      // 15px - standard body
        'body-sm': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400' }],  // 14px - metadata, descriptions

        // Stats & Metrics (Lora)
        'stat-xl': ['2.5rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],    // 40px - "+420"
        'stat-lg': ['2.25rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],   // 36px - "18", "8"
        'stat-md': ['2rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.015em' }],     // 32px - "67%"

        // Labels & Small Text (Poppins)
        'label': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '500' }],   // 13px - button text, labels
        'caption': ['0.75rem', { lineHeight: '1.125rem', fontWeight: '400' }],  // 12px - badges, tiny metadata
      },
      borderRadius: {
        // Card & Container Radius (matching references)
        'card-lg': '1.25rem',      // 20px - large cards
        'card': '1rem',            // 16px - standard cards
        'card-sm': '0.75rem',      // 12px - small cards/sections
        'button': '0.875rem',      // 14px - buttons
        'badge': '1.5rem',         // 24px - badges/pills
        'input': '0.625rem',       // 10px - input fields

        // Keep shadcn defaults
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Soft, warm-toned shadows matching the references
        'card-sm': '0 1px 3px 0 rgba(74, 53, 41, 0.08), 0 1px 2px 0 rgba(74, 53, 41, 0.04)',
        'card': '0 4px 6px -1px rgba(74, 53, 41, 0.08), 0 2px 4px -1px rgba(74, 53, 41, 0.04)',
        'card-md': '0 10px 15px -3px rgba(74, 53, 41, 0.08), 0 4px 6px -2px rgba(74, 53, 41, 0.04)',
        'card-lg': '0 20px 25px -5px rgba(74, 53, 41, 0.08), 0 10px 10px -5px rgba(74, 53, 41, 0.03)',
        'card-xl': '0 25px 50px -12px rgba(74, 53, 41, 0.15)',

        // Elevated states (hover, active)
        'card-hover': '0 12px 20px -5px rgba(74, 53, 41, 0.12), 0 6px 8px -3px rgba(74, 53, 41, 0.06)',

        // Inner shadows for inset elements
        'inner-soft': 'inset 0 2px 4px 0 rgba(74, 53, 41, 0.05)',
      },
      spacing: {
        // Generous spacing matching the references
        '4.5': '1.125rem',   // 18px
        '5.5': '1.375rem',   // 22px
        '7.5': '1.875rem',   // 30px
        '8.5': '2.125rem',   // 34px
        '9.5': '2.375rem',   // 38px
        '13': '3.25rem',     // 52px
        '15': '3.75rem',     // 60px
        '17': '4.25rem',     // 68px
        '18': '4.5rem',      // 72px
        '19': '4.75rem',     // 76px
        '21': '5.25rem',     // 84px
        '22': '5.5rem',      // 88px
        '26': '6.5rem',      // 104px
        '30': '7.5rem',      // 120px
      },
      colors: {
        // FloreSer Brand Colors
        'forest': 'var(--primary-forest)',
        'cream': 'var(--background-cream)',
        'gold': 'var(--accent-gold)',
        'light-green': 'var(--light-green)',
        'sage': 'var(--sage)',
        'subtle-rose': 'var(--subtle-rose)',

        // HIVE Section Colors (warm, grounded, earthy)
        hive: {
          bg: 'var(--hive-bg)',               // Warm peach/tan background
          card: {
            light: 'var(--hive-card-light)',  // Soft cream cards
            dark: 'var(--hive-card-dark)',    // Rich brown cards
          },
          accent: 'var(--hive-accent)',       // Golden orange primary
          'accent-light': 'var(--hive-accent-light)', // Lighter golden for buttons
          text: {
            primary: 'var(--hive-text-primary)',   // Dark brown text
            secondary: 'var(--hive-text-secondary)', // Muted text
            'on-accent': 'var(--hive-text-on-accent)', // Text on orange cards
          },
        },

        // GARDEN Section Colors (fresh, growing, tranquil)
        garden: {
          bg: 'var(--garden-bg)',             // Muted sage/olive background
          container: 'var(--garden-container)', // Warm cream main area
          card: 'var(--garden-card)',         // Very light cream sections
          accent: 'var(--garden-accent)',     // Warm gold buttons
          'accent-light': 'var(--garden-accent-light)', // Light golden badges
          sidebar: 'var(--garden-sidebar)',   // Muted sage sidebar
          text: {
            primary: 'var(--garden-text-primary)',   // Dark text
            secondary: 'var(--garden-text-secondary)', // Muted text
            'on-sage': 'var(--garden-text-on-sage)',  // Text on sage bg
          },
        },

        // Shadcn UI Colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        'heading': ['Lora', 'serif'],
        'body': ['Poppins', 'sans-serif'],
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
