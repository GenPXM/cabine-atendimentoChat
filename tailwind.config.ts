import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/steps/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3FB468',
        'primary-text': '#51586A',
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 1.5vw, 1rem)', // Min 14px até Max 16px
        'fluid-base': 'clamp(1rem, 2vw, 1.25rem)', // Min 16px até Max 20px
        'fluid-lg': 'clamp(1.125rem, 2.5vw, 1.5rem)', // Min 18px até Max 24px
        'fluid-xl': 'clamp(1.25rem, 3vw, 2rem)', // Min 20px até Max 32px
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2.5rem)', // Min 24px até Max 40px
        'fluid-3xl': 'clamp(2rem, 5vw, 3rem)', // Min 32px até Max 48px
        'fluid-4xl': 'clamp(3rem, 6vw, 6rem)', // Min 32px até Max 48px
      },
    },

    keyframes: {
      fadeInOut: {
        '0%, 100%': { opacity: '0.3' },
        '50%': { opacity: '1' },
      },
    },
    animation: {
      'fade-in-out': 'fadeInOut 2s ease-in-out infinite',
    },
  },
  plugins: [],
};
export default config;
