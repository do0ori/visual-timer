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
            '.color-picker': {
                '-webkit-appearance': 'none',
                '-moz-appearance': 'none',
                appearance: 'none',
                'background-color': 'transparent',
                border: 'none',
                cursor: 'pointer',
                // Circular shape
                '&::-webkit-color-swatch': {
                    'border-radius': '30px',
                    border: '1px solid #9ca3af',
                },
                '&::-moz-color-swatch': {
                    'border-radius': '30px',
                    border: '1px solid #9ca3af',
                },
                // Remove padding to make perfect circle
                '&::-webkit-color-swatch-wrapper': {
                    padding: 0,
                },
            },
        });
    },
];
