import type { Config } from 'tailwindcss'

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: {
                    primary: 'var(--color-background-primary)',
                    secondary: 'var(--color-background-secondary)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                },
                border: {
                    light: 'var(--color-border-light)',
                },
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                clinical: {
                    critical: 'var(--clinical-critical)',
                    high: 'var(--clinical-high)',
                    moderate: 'var(--clinical-moderate)',
                    low: 'var(--clinical-low)',
                    normal: 'var(--clinical-normal)',
                },
                status: {
                    emergency: 'var(--status-emergency)',
                    warning: 'var(--status-warning)',
                    stable: 'var(--status-stable)',
                    pending: 'var(--status-pending)',
                    resolved: 'var(--status-resolved)',
                },
            },
            fontSize: {
                'clinical': 'var(--font-size-clinical)',
                'diagnostic': 'var(--font-size-diagnostic)',
                'patient': 'var(--font-size-patient)',
                'critical': 'var(--font-size-critical)',
            },
            spacing: {
                'medical': 'var(--grid-medical)',
                'dense': 'var(--grid-dense)',
                'spacious': 'var(--grid-spacious)',
            },
            borderRadius: {
                'clinical': 'var(--radius-clinical)',
                'patient': 'var(--radius-patient)',
                'panel': 'var(--radius-panel)',
                'modal': 'var(--radius-modal)',
            }
        },
        fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        },
    },
    plugins: [],
} satisfies Config