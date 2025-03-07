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
                position: 'fixed',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                '-webkit-overflow-scrolling': 'touch',
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
        });
    },
];
