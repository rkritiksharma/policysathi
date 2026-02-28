
import type { Config } from "tailwindcss";

const config: Config = {

    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: '#4A6741', // Velvety Nature Green
                    light: '#5F8552',
                    dark: '#354A2E',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#F3F4F6', // Soft Gray
                    foreground: '#1F2937',
                },
                accent: {
                    DEFAULT: '#E5E7EB', // Border/Divider
                    foreground: '#111827',
                },
                surface: '#FFFFFF', // Card white
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: '0.75rem', // 12px
                '2xl': '1rem', // 16px
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
        }
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
