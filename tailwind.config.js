/** @type {import('tailwindcss').Config} */
export default {
  // content alanı en önemli kısımdır.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Bu satır projenizdeki tüm dosyaları taramasını sağlar.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}