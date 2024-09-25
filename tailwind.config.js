const { themeColors } = require("./src/config/themeColors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                classic: themeColors.classic,
                purple: themeColors.purple,
                black: themeColors.black,
            },
        },
    },
    plugins: [],
};
