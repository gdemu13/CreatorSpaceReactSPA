import React from 'react';

const ThemeContext = React.createContext({
    isDarkMode: false,
    toggleDarkMode: () => {},
    setColor: () => {},
});

export const ThemeContextProvider = (props) => {
    const [isDarkMode, setIsDarkMode] = React.useState(
        localStorage.getItem('darkMode') === 'true'
    );
    const [color, setColor] = React.useState();

    const contextValue = {
        isDarkMode: isDarkMode,
        color: color,
        toggleDarkMode: () => {
            localStorage.setItem('darkMode', !isDarkMode);
            setIsDarkMode(!isDarkMode);
        },
        setColor: (newColor) => {
            console.log(newColor);
            setColor(newColor);
        },
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
