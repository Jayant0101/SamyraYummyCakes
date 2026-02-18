/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: "#FAF7F2",
                blush: "#F6D6E6",
                gold: "#C8A96A",
                charcoal: "#4B4B4B",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            borderRadius: {
                luxury: "24px",
            },
            boxShadow: {
                soft: "0 10px 40px rgba(0,0,0,0.08)",
            },
            backdropBlur: {
                luxury: "20px",
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
