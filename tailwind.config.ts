import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'world-map': 'url("data:image/svg+xml,%3Csvg width=\'800\' height=\'400\' viewBox=\'0 0 800 400\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M769.5,99.5l-23,18.5l-5.5,25.5l-12.5-2l-14,20.5l8.5,29l-8.5,17l12.5,14.5l-3.5,17.5l-19,6l-5.5,15.5l-15.5,9.5l-16,0.5l-8,13.5l16,13l23-8l17.5,19.5l2.5,40.5l-21,9 M147,40.5l-18.5,23l-8.5,36l-29,22l11,12.5l-14.5,12l-26,1.5l-31,30.5v28.5l-30.5,18.5v19.5l26,13 M250,37l-33,8l-15,23.5l-6.5,7.5l11.5,15l-28,33l-23,14.5l16.5,10l-20,29l-21.5,8.5l-5.5,13l-14,2 M272,17.5l11,34l32,36.5l32.5,6l17,22.5l-9,28l-32.5,30.5L305,194l29,5l19,19L338,278l-27.5,38.5l9,49.5l25,22 M443.5,14l18.5,40l-13,28.5l1.5,18l19,4.5l-1.5,18l-14.5,16.5l17,11l-2,39l-11.5,13l-22.5-7l-11.5,13.5l12.5,13.5l27.5,10l9,19.5 M409,51l-23.5,33.5l-42.5,6.5l-34.5,30.5l12,21L309,164l-49.5,23 M526,53l-1.5,24.5l11,20l23,9l-11.5,23l-9.5,3.5l2.5,16l32.5,27.5l4.5,16.5l9,9l-5,17.5l-16,8l-1.5,22l-17,12l7.5,11.5 M495.5,160l-6,12l-21.5,7.5 M649,20.5l31,1l26.5,22l39,13.5l24,42.5 M617,59.5l14,27.5l26,11.5l-14.5,24.5l-19,8l-2.5,18l24.5,17.5l1,16.5l-11.5,18l-29,6.5l-13.5,11l9.5,11l-10,10.5l8.5,5.5l-5,31.5l9,7.5l14.5-8.5l7.5,9.5l-14,14.5 M552.5,232.5l17,35l7,29.5l-8.5,17.5l-34,12l-24.5,27.5 M496,306l44.5,18l13,24.5 M410,357l15,11l19-17.5 M324.5,389.5l29.5-8.5l16.5-19.5 M217,376.5l31.5,6l41-19.5l17-36.5l16.5-12 M163.5,276.5l35.5,10l34-22l-6-19l18-30\' stroke=\'%23D4D4D8\' stroke-opacity=\'0.3\' stroke-width=\'0.5\'/%3E%3C/svg%3E%0A")',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;