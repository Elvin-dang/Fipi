import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		keyframes: {
  			smallPing: {
  				'75%, 100%': {
  					transform: 'scale(1.05)'
  				}
  			},
  			typewriter: {
  				to: {
  					left: '100%'
  				}
  			},
  			blink: {
  				'0%': {
  					opacity: '0'
  				},
  				'0.1%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '1'
  				},
  				'50.1%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '0'
  				}
  			},
  			shine: {
  				'0%': {
  					backgroundPosition: '200% 0'
  				},
  				'25%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '-200% 0'
  				}
  			},
  			wiggle: {
  				'0%': {},
  				'100%': {
  					transform: 'rotate(-6deg)'
  				},
  				'50%': {
  					transform: 'rotate(6deg)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'small-ping': 'smallPing 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  			typewriter: 'typewriter 2s steps(11) forwards',
  			caret: 'typewriter 2s steps(11) forwards, blink 1s steps(11) infinite 2s',
  			shine: 'shine 3s ease-out infinite',
  			wiggle: 'wiggle 0.5s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		colors: {
  			tertiary: 'var(--tertiary)',
  			'el-hover-bg': 'var(--el-hover-bg)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
