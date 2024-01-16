/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                black: '#000112',
                white: '#FFFFFF',
                red: '#EA5555',
                'red-100': '#FFF5F5',
                'red-400': '#FC8180',
                'red-700': '#C53030',
                'red-hover': '#FF9898',
                'purple-main': '#635FC7',
                'purple-main-hover': '#A8A4FF',
                'grey-very-dark': '#20212C',
                'grey-dark': '#2B2C37',
                'grey-medium': '#828FA3',
                'grey-light': '#F4F7FD',
                'lines-dark': '#3E3F4E',
                'lines-light': '#E4EBFA',
                'button-secondary-lightmode-idle': 'rgba(99, 95, 199, 0.1)',
                'button-secondary-lightmode-hover': 'rgba(99, 95, 199, 0.25)',
                'modal-backdrop': 'rgba(0, 0, 0, 0.5)',
            },
            transitionProperty: {
                margin: 'margin',
            },
            boxShadow: {
                'md-dark': '0px 4px 6px rgba(54, 78, 126, 0.101545);',
                'md-light': 'rgba(0, 0, 0, 0.2) 0px 11px 34px',
            },
            backgroundImage: {
                checkIcon: "url('/assets/icon-check.svg')",
                dropDownArrowDown: "url('/assets/icon-chevron-down.svg')",
                dropDownArrowUp: "url('/assets/icon-chevron-up.svg')",
                deleteIcon: "url('/assets/icon-cross.svg')",
            },
            backgroundSize: {
                sm: '1.2rem',
            },
        },
        fontFamily: {
            plusJakartaSans: ['Plus Jakarta Sans', 'sans-serif'],
        },
        screens: {
            mobile: '480px',
            tablet: '768px',
            desktop: '1060px',
        },
        fontSize: {
            '3xl': ['3rem', '5rem'],
            '2xl': ['2.4rem', '3rem'],
            xl: ['1.8rem', '2.3rem'],
            lg: ['1.5rem', '1.9rem'],
            base: ['1.3rem', '2.3rem'],
            sm: ['1.2rem', '1.5rem'],
        },
        letterSpacing: {
            wide: '0.24rem',
        },
    },
    plugins: [],
};
