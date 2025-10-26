import type { Config } from "tailwindcss"

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Optional: add any custom colors or variables here
    },
  },
  plugins: [],
} satisfies Config
