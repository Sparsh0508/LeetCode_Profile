/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'leetcode-orange': 'rgb(230, 146, 44)',
                'leetcode-dark': '#283a2e',
            },
            backgroundImage: {
                'starry-sky': "url('/src/assets/background.avif')",
            }
        },
    },
    plugins: [],
}
