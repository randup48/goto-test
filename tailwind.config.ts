import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        peach: '#f3f1e9',
        green: '#73BDA8',
        'green-950': '#65A593',
        orange: '#CC6B49',
        'orange-950': '#B35E40',
        brown: '#6F5643',
      },
    },
  },
  plugins: [],
};
export default config;
