/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        hive: {
          dark: '#020204',
          panel: '#0d0d1a',
          border: '#1a1a2e',
          accent: '#00d9a3',
          blue: '#3498db',
          purple: '#9b59b6',
          orange: '#f39c12',
          red: '#e74c3c'
        }
      }
    }
  },
  plugins: []
};