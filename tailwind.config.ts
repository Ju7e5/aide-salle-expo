import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#18181B',
        bg: '#F7F5F2',
        card: '#FFFFFF',
        accent: {
          DEFAULT: '#B5763A',
          light: '#F5EDE3',
        },
        green: {
          DEFAULT: '#3D7A5E',
          light: '#E8F4EE',
        },
        red: {
          DEFAULT: '#B83232',
          light: '#FCEAEA',
        },
        yellow: {
          DEFAULT: '#B8860B',
          light: '#FDF6E3',
        },
        blue: {
          DEFAULT: '#2E5FA3',
          light: '#E8EFF9',
        },
        muted: '#71717A',
        border: {
          DEFAULT: '#E4E0DA',
          dark: '#D4CEC6',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      fontSize: {
        '2xs': '10px',
        xs: '11px',
        sm: '12px',
        base: '13px',
        md: '14px',
      },
    },
  },
  plugins: [],
}

export default config
