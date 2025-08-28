/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Helvetica', 'Open Sans', 'Arial', 'sans-serif'],
        'primary': ['Helvetica', 'sans-serif'],
        'secondary': ['Open Sans', 'sans-serif'],
        'fallback': ['Arial', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '12px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
       screens:  {
         lg: "1200px",

       },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}
