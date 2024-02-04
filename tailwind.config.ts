import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#424874', // sub header, call to action
        secondary: '#A6B1E1', // header, buttons
        accent: '#CACFD6', // highlights,
        background: '#DCD6F7',
        neutral: '#D6E5E3', //text, borders
      },
    },
  },
  plugins: [],
};
export default config;
