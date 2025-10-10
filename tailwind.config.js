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
        primary: {
          green: '#10B981',
          'green-dark': '#059669',
          'green-light': '#D1FAE5',
        },
        accent: {
          gold: '#F59E0B',
          blue: '#3B82F6',
        },
      },
    },
  },
  plugins: [],
}
