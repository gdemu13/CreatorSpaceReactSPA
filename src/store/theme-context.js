import React from 'react';

const ThemeContext = React.createContext({
    isDarkMode: false,
    toggleDarkMode: () => {},
});

export const ThemeContextProvider = (props) => {
    const [isDarkMode, setIsDarkMode] = React.useState(
        localStorage.getItem('darkMode') === 'true'
    );

    const contextValue = {
        isDarkMode: isDarkMode,
        toggleDarkMode: () => {
            localStorage.setItem('darkMode', !isDarkMode);
            setIsDarkMode(!isDarkMode);
        },
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
