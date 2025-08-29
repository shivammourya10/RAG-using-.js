/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'peach': {
          50: '#fef7f2',
          100: '#fdeee2',
          200: '#fadbc0',
          300: '#f6c294',
          400: '#f1a166',
          500: '#ed8142',
          600: '#de6529',
          700: '#b94e20',
          800: '#944020',
          900: '#77361d',
        },
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
