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

        // Paper-Cut shadows (earth-toned for layered depth)
        'paper-1': '0 1px 2px rgba(86,75,58,0.06), 0 2px 4px rgba(86,75,58,0.04)',
        'paper-2': '0 4px 6px rgba(86,75,58,0.08), 2px 4px 8px rgba(86,75,58,0.06)',
        'paper-3': '0 6px 10px rgba(86,75,58,0.08), 3px 8px 16px rgba(86,75,58,0.06)',
        'paper-4': '0 8px 12px rgba(86,75,58,0.08), 4px 12px 20px rgba(86,75,58,0.06)',
        'hex-emboss': 'inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(86,75,58,0.1), 0 6px 12px rgba(86,75,58,0.12)',
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
      // Embossed Typewriter Text Effect
      textShadow: {
        'emboss': '1px 1px 0px rgba(255,255,255,0.7), -0.5px -0.5px 0px rgba(0,0,0,0.15)',
        'emboss-sm': '0.5px 0.5px 0px rgba(255,255,255,0.6), -0.3px -0.3px 0px rgba(0,0,0,0.1)',
        'emboss-lg': '1.5px 1.5px 0px rgba(255,255,255,0.7), -1px -1px 0px rgba(0,0,0,0.2)',
        'none': 'none',
      },
      colors: {
        // Embossed Text Colors (typewriter feel)
        'typewriter': {
          'dark': '#3d4f3d',    // Logo text
          'medium': '#4a5d4a',  // Nav links
          'light': '#5a6d5a',   // Secondary text
        },
        // Shared Earth Tones
        earth: {
          50: '#FAF8F5',
          100: '#F5F2EC',
          200: '#E8E4DC',
          300: '#D4CFC4',
          400: '#B8B0A0',
          500: '#9A8F7D',
          600: '#7D6F5E',
          700: '#635648',
          800: '#4A4037',
          900: '#332D27',
        },

        // Paper-Cut Landing Page Colors
        papercut: {
          green: {
            50: '#C9DCC9',
            100: '#AFC8A8',
            200: '#9CB69A',
            300: '#7FA889',
            400: '#6F8E72',
            500: '#6E7B60',
          },
          earth: {
            50: '#F2E5CA',
            100: '#F5D29A',
            200: '#D9B77F',
            300: '#BA9A82',
            400: '#564B3A',
          },
          accent: {
            crimson: '#A23C40',
            deep: '#7C0015',
          },
          neutral: {
            light: '#F6F0E6',
            dark: '#2C2C24',
          },
          hero: {
            clay: '#D7C3A8',
            sage: '#6F8E72',
          },
        },

        // Legacy Brand Colors (keep for backward compatibility)
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
        // Client-specified fonts
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],

        // Legacy fonts (backward compatibility)
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['ui-monospace', 'monospace'],
      },
      keyframes: {
        // Shadcn UI animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        // Nature-inspired animations for My Garden
        "bloom": {
          '0%': {
            transform: 'scale(0) rotate(-180deg)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1'
          },
        },
        "petal-fade": {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        "vine-grow": {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        "sprout": {
          '0%': {
            transform: 'scaleY(0)',
            transformOrigin: 'bottom',
            opacity: '0'
          },
          '50%': {
            transform: 'scaleY(1.1)',
            opacity: '1'
          },
          '100%': {
            transform: 'scaleY(1)'
          },
        },

        // Hive-inspired animations for My Hive
        "honey-drip": {
          '0%': {
            transform: 'translateY(-20px)',
            opacity: '0'
          },
          '50%': { opacity: '1' },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        "hexagon-pulse": {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.9'
          },
        },

        // General utility animations
        "float": {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "shimmer": {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },

        // Page transition animations
        "page-enter": {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.98)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          },
        },
        "page-exit": {
          '0%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-20px) scale(0.98)'
          },
        },

        // Error/alert animations
        "shake": {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },

        // Butterfly wing flutter
        "flutter": {
          '0%, 100%': { transform: 'rotate(-5deg) scale(1)' },
          '50%': { transform: 'rotate(5deg) scale(1.02)' },
        },

        // Gentle breathing/pulsing
        "breathe": {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.8'
          },
          '50%': {
            transform: 'scale(1.03)',
            opacity: '1'
          },
        },

        // Staggered fade in for lists
        "stagger-in": {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },

        // Paper-Cut landing page animations
        "paper-unfold": {
          '0%': {
            transform: 'rotateX(-90deg)',
            opacity: '0'
          },
          '100%': {
            transform: 'rotateX(0)',
            opacity: '1'
          },
        },
        "orbit": {
          'to': { transform: 'rotate(360deg)' },
        },
        "gentle-pulse": {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      animation: {
        // Shadcn UI
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Garden animations
        "bloom": "bloom 1.5s ease-out",
        "petal-fade": "petal-fade 0.8s ease-in-out forwards",
        "vine-grow": "vine-grow 2s ease-out",
        "sprout": "sprout 1.2s ease-out",

        // Hive animations
        "honey-drip": "honey-drip 1.2s ease-in",
        "hexagon-pulse": "hexagon-pulse 2s ease-in-out infinite",

        // Utility
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",

        // Page transitions
        "page-enter": "page-enter 0.4s ease-out forwards",
        "page-exit": "page-exit 0.3s ease-in forwards",

        // Feedback animations
        "shake": "shake 0.5s ease-in-out",

        // Nature-inspired
        "flutter": "flutter 3s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "stagger-in": "stagger-in 0.5s ease-out forwards",

        // Paper-Cut landing page
        "paper-unfold": "paper-unfold 0.6s ease-out forwards",
        "orbit-slow": "orbit 15s linear infinite",
        "orbit-medium": "orbit 10s linear infinite",
        "orbit-fast": "orbit 6s linear infinite",
        "gentle-pulse": "gentle-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    // Custom text-shadow plugin for emboss effect
    function({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'text-shadow': (value: string) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    },
  ],
} satisfies Config;
