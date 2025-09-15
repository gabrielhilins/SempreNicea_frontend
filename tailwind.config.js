/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",         // Qualquer arquivo JS/TS em src
    "./src/styles/**/*.css",            // Arquivos CSS em /src/styles
  ],
  theme: {
    extend: {
      colors: {
        'verde-escuro-nicea': '#1D361F', // Adicionando a cor hexadecimal
      },
    },
  },
  plugins: [],
}
