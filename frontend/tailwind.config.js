/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                surface: {
                    50: '#f8faff',
                    100: '#f0f4ff',
                    200: '#e8ecf4',
                },
                medical: {
                    light: '#e0f2fe',
                    DEFAULT: '#0ea5e9',
                    dark: '#0369a1',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'base': '1rem',
                'lg-accessible': '1.125rem',
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(99, 102, 241, 0.04), 0 1px 2px -1px rgba(99, 102, 241, 0.06)',
                'card-hover': '0 20px 40px -12px rgba(99, 102, 241, 0.15)',
                'glow': '0 0 24px rgba(99, 102, 241, 0.25)',
                'glow-sm': '0 0 12px rgba(99, 102, 241, 0.15)',
                'rail': '4px 0 24px -2px rgba(99, 102, 241, 0.08)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
                'stat': '0 4px 24px -4px rgba(99, 102, 241, 0.12)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-soft': 'pulseSoft 2s infinite',
                'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                'counter': 'counter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-8px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.25rem',
                '4xl': '1.5rem',
            },
            backdropBlur: {
                'xl': '20px',
                '2xl': '40px',
            },
        },
    },
    plugins: [],
};
