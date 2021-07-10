import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './store/auth-context';
import { ThemeContextProvider } from './store/theme-context';
import Spinner from './components/Spinner';

ReactDOM.render(
    <AuthContextProvider>
        <ThemeContextProvider>
            <BrowserRouter>
                <App />
                <Spinner />
            </BrowserRouter>
        </ThemeContextProvider>
    </AuthContextProvider>,
    document.getElementById('root')
);
