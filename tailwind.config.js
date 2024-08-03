/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        fontFamily: {
        'Ranade': ['Ranade', 'sans-serif'],
        'Satoshi': ['Satoshi', 'sans-serif'],
        'Supreme': ['Supreme', 'sans-serif']
      },
     screens: {
      'mobile': '340px',
      // => @media (min-width: 640px) { ... }
      'ipad': '658px',
      'tablet': '768px',
      // => @media (min-width: 768px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }

      'bigDisplay': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
    },
  },
  plugins: [],
}