/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CHROMATIC LUXURY CORE PALETTE (Synapse x Finaura x Vaultflow)
        plum: {
          950: '#140A1C',
          900: '#1F102B',
          DEFAULT: '#241333',
          800: '#2F1A42',
          700: '#41245C',
          600: '#56307B',
          500: '#6E3E9C',
          400: '#8A52BE',
          300: '#A975DC',
          200: '#CB9FF3',
          100: '#EBD4FB',
        },
        royal: {
          DEFAULT: '#49306F',
          dark: '#352152',
          light: '#614193',
          soft: '#E8DFF5',
        },
        burgundy: {
          950: '#2A0E1F',
          900: '#3D152D',
          DEFAULT: '#54243F',
          800: '#6E2E52',
          700: '#8E3867',
          600: '#A8447A',
          500: '#C1558E',
          soft: '#F4DFEA',
        },
        violet: {
          rich: '#7550A8',
          electric: '#9D6EE8',
          ultraviolet: '#A78BFA',
          glow: 'rgba(167, 139, 250, 0.35)',
        },
        magenta: {
          muted: '#A74778',
          vivid: '#C94E91',
          rose: '#D58B9B',
          soft: '#FDEAF2',
        },
        charcoal: {
          950: '#0E0D14',
          DEFAULT: '#17151F',
          800: '#221F2D',
          700: '#2F2B3E',
          600: '#403B52',
        },
        lavender: {
          DEFAULT: '#D8C7EB',
          soft: '#EDE5F7',
          whisper: '#F7F3FC',
        },
        champagne: {
          DEFAULT: '#D7BEA0',
          soft: '#EFE3D5',
          whisper: '#FAF6F0',
        },
        neutral: {
          muted: '#E8E1E9',
          tinted: '#F5EFF7',
        },

        // SEMANTIC MAPPINGS FOR WORKSPACE SURFACES & ACCENTS
        canvas: '#FAF6FA', // Luxurious pale mauve-tinted canvas
        surface: '#FFFFFF',
        'surface-tinted': '#F7F1F8',
        'surface-contrast': '#1F102B',
        'border-luxury': 'rgba(117, 80, 168, 0.15)',
        'border-luxury-strong': 'rgba(84, 36, 63, 0.25)',

        // CINEMATIC EVIDENCE LENS SURFACES
        lens: {
          void: '#0E0D14',
          surface: '#17151F',
          elevated: '#221F2D',
          border: 'rgba(167, 139, 250, 0.2)',
          'border-active': 'rgba(213, 139, 155, 0.5)',
          glow: 'rgba(157, 110, 232, 0.25)',
          cyan: '#65E7DA',
          lime: '#C9F36A',
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'Cambria', 'serif'],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
      },
      backgroundImage: {
        'gradient-synapse': 'linear-gradient(135deg, #241333 0%, #54243F 50%, #49306F 100%)',
        'gradient-finaura': 'linear-gradient(135deg, #49306F 0%, #7550A8 40%, #A74778 100%)',
        'gradient-vaultflow': 'linear-gradient(135deg, #17151F 0%, #241333 45%, #54243F 100%)',
        'gradient-rose-gold': 'linear-gradient(135deg, #A74778 0%, #D58B9B 60%, #D7BEA0 100%)',
        'gradient-card-luxury': 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 241, 248, 0.9) 100%)',
        'gradient-dark-panel': 'linear-gradient(180deg, #1F102B 0%, #17151F 100%)',
      },
      boxShadow: {
        'luxury-subtle': '0 2px 10px -2px rgba(36, 19, 51, 0.06), 0 1px 3px 0 rgba(84, 36, 63, 0.04)',
        'luxury-card': '0 8px 30px -4px rgba(36, 19, 51, 0.08), 0 2px 8px -2px rgba(84, 36, 63, 0.05)',
        'luxury-elevated': '0 20px 45px -10px rgba(36, 19, 51, 0.16), 0 6px 16px -4px rgba(117, 80, 168, 0.1)',
        'glow-violet': '0 0 35px -5px rgba(167, 139, 250, 0.35)',
        'glow-magenta': '0 0 35px -5px rgba(201, 78, 145, 0.35)',
        'glow-rose': '0 0 30px -5px rgba(213, 139, 155, 0.3)',
      },
    },
  },
  plugins: [],
};
