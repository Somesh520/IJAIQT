import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Times New Roman'", 'Times', 'serif'],
        serif: ["'Times New Roman'", 'Times', 'serif'],
        logo: ["'Times New Roman'", 'Times', 'serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a', // Deep Indigo/Royal Blue
        },
        accent: {
          500: '#0ea5e9', // Vibrant Teal/Light Blue
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
