/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)',
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)',
				},
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)',
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)',
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)',
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)',
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)',
				},
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				chart: {
					1: 'var(--chart-1)',
					2: 'var(--chart-2)',
					3: 'var(--chart-3)',
					4: 'var(--chart-4)',
					5: 'var(--chart-5)',
				},
				fill: {
					base: {
						n1: 'var(--fill-base-n1)',
						0: 'var(--fill-base-0)',
						1: 'var(--fill-base-1)',
						2: 'var(--fill-base-2)',
						3: 'var(--fill-base-3)',
						4: 'var(--fill-base-4)',
						5: 'var(--fill-base-5)',
					},
					brand: {
						primary: 'var(--fill-brand-primary)',
						'primary-transparent': 'var(--fill-brand-primary-transparent)',
						secondary: 'var(--fill-brand-secondary)',
					},
					specific: {
						tooltip: 'var(--fill-specific-tooltip)',
						background: 'var(--fill-specific-background)',
						divider: 'var(--fill-specific-divider)',
						'sidebar-primary': 'var(--fill-specific-sidebar-primary)',
						'sidebar-child': 'var(--fill-specific-sidebar-child)',
						'icon-default': 'var(--fill-specific-icon-default)',
						'icon-hover': 'var(--fill-specific-icon-hover)',
						'icon-onpress': 'var(--fill-specific-icon-onpress)',
					},
					information: {
						error: 'var(--fill-information-error)',
						warning: 'var(--fill-information-warning)',
						success: 'var(--fill-information-success)',
						info: 'var(--fill-information-info)',
					},
				},
				text: {
					base: {
						primary: 'var(--text-base-primary)',
						secondary: 'var(--text-base-secondary)',
						tertiary: 'var(--text-base-tertiary)',
						invert: 'var(--text-base-invert)',
					},
					brand: {
						primary: 'var(--text-brand-primary)',
						secondary: 'var(--text-brand-secondary)',
					},
					specific: {
						'sidebar-idle': 'var(--text-specific-sidebar-idle)',
						'sidebar-hover': 'var(--text-specific-sidebar-hover)',
						'sidebar-active': 'var(--text-specific-sidebar-active)',
						'external-scan-score': 'var(--text-specific-external-scan-score)',
					},
					information: {
						error: 'var(--text-information-error)',
						success: 'var(--text-information-success)',
						info: 'var(--text-information-info)',
					},
					functional: {
						m1: 'var(--text-functional-m1)',
						0: 'var(--text-functional-0)',
					},
				},
				stroke: {
					base: {
						0: 'var(--stroke-base-0)',
						1: 'var(--stroke-base-1)',
						2: 'var(--stroke-base-2)',
					},
					brand: {
						primary: 'var(--stroke-brand-primary)',
						secondary: 'var(--stroke-brand-secondary)',
					},
					information: {
						error: 'var(--stroke-information-error)',
					},
				},
				viz: {
					base: {
						primary: 'var(--viz-base-primary)',
						secondary: 'var(--viz-base-secondary)',
						tertiary: 'var(--viz-base-tertiary)',
						market: 'var(--viz-base-market)',
					},
					event: {
						attritional: 'var(--viz-event-attritional)',
						databreach: 'var(--viz-event-databreach)',
						interruption: 'var(--viz-event-interruption)',
						ransomware: 'var(--viz-event-ransomware)',
					},
					impact: {
						ransomware: 'var(--viz-impact-ransomware)',
						interruption: 'var(--viz-impact-interruption)',
						provider: 'var(--viz-impact-provider)',
						liability: 'var(--viz-impact-liability)',
						databreach: 'var(--viz-impact-databreach)',
						regulation: 'var(--viz-impact-regulation)',
						tags: {
							severe: 'var(--viz-impact-tags-severe)',
							significant: 'var(--viz-impact-tags-significant)',
							moderate: 'var(--viz-impact-tags-moderate)',
							minor: 'var(--viz-impact-tags-minor)',
							negligible: 'var(--viz-impact-tags-negligible)',
						},
					},
					likelihood: {
						tags: {
							expected: 'var(--viz-likelihood-tags-expected)',
							likely: 'var(--viz-likelihood-tags-likely)',
							possible: 'var(--viz-likelihood-tags-possible)',
							unlikely: 'var(--viz-likelihood-tags-unlikely)',
							rare: 'var(--viz-likelihood-tags-rare)',
						},
					},
					priority: {
						tags: {
							low: 'var(--viz-priority-tags-low)',
							medium: 'var(--viz-priority-tags-medium)',
							high: 'var(--viz-priority-tags-high)',
							critical: 'var(--viz-priority-tags-critical)',
						},
					},
				},
			},
			spacing: {
				xs: '10px', // For space-y-xs, p-xs, m-xs, gap-xs etc.
				sm: '20px', // For space-y-sm, p-sm, m-sm, gap-sm etc.
				md: '32px', // For space-y-md, p-md, m-md, gap-md etc.
				lg: '48px', // For space-y-lg, p-lg, m-lg, gap-lg etc.
				xl: '64px', // For space-y-xl, p-xl, m-xl, gap-xl etc.
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
