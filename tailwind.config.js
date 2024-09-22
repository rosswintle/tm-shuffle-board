/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./public/*.html'],
    theme: {
        extend: {
            fontFamily: {
                typewriter: ['Special Elite', 'sans-serif'],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
