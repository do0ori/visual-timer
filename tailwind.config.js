/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{js,jsx,ts,tsx}'];
export const theme = {
    extend: {},
};
export const plugins = [
    function ({ addBase, addUtilities }) {
        addBase({
            body: {
                'overscroll-behavior': 'none', // 모바일 당겨서 새로고침 비활성화
            },
        });

        addUtilities({
            '.no-scrollbar': {
                '&::-webkit-scrollbar': {
                    display: 'none', // Chrome, Edge, Safari
                },
                '-ms-overflow-style': 'none', // IE and Edge
                'scrollbar-width': 'none', // Firefox
            },
            '.color-picker': {
                '&::-webkit-color-swatch': {
                    border: 'none', // 안쪽 테두리 제거
                },
            },
        });
    },
];
