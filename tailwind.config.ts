
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Plant Doc specific colors
				plantDoc: {
					primary: '#4CAF50',
					secondary: '#388E3C',
					accent: '#FFC107',
					danger: '#F44336',
					light: '#E8F5E9',
					dark: '#1B5E20'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
						opacity: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1'
					},
					to: {
						height: '0',
						opacity: '0'
					}
				},
				'fade-in': {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)"
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)"
					}
				},
				'scale-in': {
					"0%": {
						transform: "scale(0.95)",
						opacity: "0"
					},
					"100%": {
						transform: "scale(1)",
						opacity: "1"
					}
				},
				'float': {
					"0%, 100%": {
						transform: "translateY(0) translateX(0)"
					},
					"50%": {
						transform: "translateY(-20px) translateX(10px)"
					}
				},
				'pulse-glow': {
					"0%": {
						boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.4)"
					},
					"70%": {
						boxShadow: "0 0 0 15px rgba(76, 175, 80, 0)"
					},
					"100%": {
						boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)"
					}
				},
				'rotate-slow': {
					"0%": {
						transform: "rotate(0deg)"
					},
					"100%": {
						transform: "rotate(360deg)"
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-500px 0',
					},
					'100%': {
						backgroundPosition: '500px 0',
					},
				},
				'bounce-subtle': {
					'0%, 100%': {
						transform: 'translateY(0)',
					},
					'50%': {
						transform: 'translateY(-5px)',
					},
				},
				'slide-in-left': {
					'0%': {
						transform: 'translateX(-100%)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1',
					},
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1',
					},
				},
				'slide-in-bottom': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
				},
				'ripple': {
					'0%': {
						transform: 'scale(0)',
						opacity: '1',
					},
					'100%': {
						transform: 'scale(4)',
						opacity: '0',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'bounce-subtle': 'bounce-subtle 2s infinite ease-in-out',
				'slide-in-left': 'slide-in-left 0.5s ease-out',
				'slide-in-right': 'slide-in-right 0.5s ease-out',
				'slide-in-bottom': 'slide-in-bottom 0.5s ease-out',
				'ripple': 'ripple 1s linear',
			},
			backgroundImage: {
				'radial-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
				'conic-gradient': 'conic-gradient(var(--tw-gradient-stops))',
				'shimmer': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
			},
			spacing: {
				'safe': 'env(safe-area-inset-bottom, 0px)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
