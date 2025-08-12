// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}", // adjust for your folder structure
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#01565B', // main primary color
            light: '#34787C',   // optional lighter shade
            dark: '#01565B',    // optional darker shade
          },
        },
      },
    },
    plugins: [],
  };
  