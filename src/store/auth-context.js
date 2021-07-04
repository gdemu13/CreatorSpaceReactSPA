import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    id: '',
    name: '',
    login: (token) => {},
    logout: () => {},
    hasPermission: (roles) => {},
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
};

const parseToken = (token) => {
    return JSON.parse(atob(token.split('.')[1]));
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 3600) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime,
    };
};

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();

    let initialToken;
    let initialRoles;
    let initialId;
    let initialName;
    if (tokenData) {
        initialToken = tokenData.token;
        const parsedToken = parseToken(initialToken);
        initialRoles = parsedToken.roles;
        initialId = parsedToken.sub;
        initialName = parsedToken.name;
    }

    const [token, setToken] = useState(initialToken);
    const [roles, setRoles] = useState(initialRoles);
    const [id, setId] = useState(initialId);
    const [name, setName] = useState(initialName);

    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        setRoles(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        const parsedToken = parseToken(token);
        setRoles(parsedToken.roles);
        setName(parsedToken.name);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    const hasPermissionHandler = (permissionRoles) => {
        return permissionRoles.includes(roles);
    };

    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        token: token,
        roles: roles,
        id: id,
        name: name,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        hasPermission: hasPermissionHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
