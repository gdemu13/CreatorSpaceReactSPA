import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './store/auth-context';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Forbidden from './pages/Forbidden';
import themeBuilder from './theme';
import PrivateRoute from './components/PrivateRoute';
import { ADMINISTRATOR_ROLES } from './constants';
import HomePage from './pages/HomePage';
import PostForm from './components/admin/posts/PostForm';
import PostPage from './pages/PostPage';
import SuccessPage from './pages/SuccessPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ThemeContext from './store/theme-context';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ReactGa from 'react-ga';
import { Company } from './api/service';
import useLocationChange from './hooks/useLocationChange';

function App() {
    const authCtx = useContext(AuthContext);
    const themeCtx = useContext(ThemeContext);
    const [theme, setTheme] = useState(null);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        Company.get().then((data) => {
            setSettings(data);
            themeCtx.setColor(data.color);
            if (!!data.googleAnalyticsId) {
                ReactGa.initialize(data.googleAnalyticsId);
            }
        });
    }, []);

    useEffect(() => {
        if (!!themeCtx.color) {
            setTheme(themeBuilder(themeCtx.isDarkMode, themeCtx.color));
        }
    }, [themeCtx.isDarkMode, themeCtx.color]);

    useLocationChange((location) => {
        ReactGa.set({ page: location.pathname });
        ReactGa.pageview(location.pathname);
    });

    return (
        theme &&
        settings && (
            <MuiThemeProvider theme={theme}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Layout
                        isDarkMode={themeCtx.isDarkMode}
                        toggleDarkMode={themeCtx.toggleDarkMode}
                    >
                        <Switch>
                            <Route path="/" exact>
                                <HomePage settings={settings} />
                            </Route>

                            <PrivateRoute
                                component={SuccessPage}
                                authorized={authCtx.isLoggedIn}
                                path="/success"
                            ></PrivateRoute>
                            <Route path="/403" exact>
                                <Forbidden />
                            </Route>
                            <Route path="/404" exact>
                                <NotFound />
                            </Route>
                            <Route path="/login" exact>
                                {!authCtx.isLoggedIn && <LoginPage />}
                                {authCtx.isLoggedIn && <Redirect to="/" />}
                            </Route>
                            <Route path="/register" exact>
                                {!authCtx.isLoggedIn && <RegisterPage />}
                                {authCtx.isLoggedIn && <Redirect to="/" />}
                            </Route>
                            <Route path="/forgot_password" exact>
                                {!authCtx.isLoggedIn && <ForgotPasswordPage />}
                                {authCtx.isLoggedIn && <Redirect to="/" />}
                            </Route>
                            <Route path="/reset_password" exact>
                                {!authCtx.isLoggedIn && <ResetPasswordPage />}
                                {authCtx.isLoggedIn && <Redirect to="/" />}
                            </Route>
                            <PrivateRoute
                                path={['/posts/add', '/posts/edit/:id']}
                                authorized={authCtx.isLoggedIn}
                                userRoles={authCtx.roles}
                                allowedRoles={ADMINISTRATOR_ROLES}
                                component={PostForm}
                                exact
                            ></PrivateRoute>
                            <PrivateRoute
                                component={ProfilePage}
                                authorized={authCtx.isLoggedIn}
                                path="/profile"
                                exact
                            ></PrivateRoute>
                            <PrivateRoute
                                component={SubscriptionPage}
                                authorized={authCtx.isLoggedIn}
                                path="/subscription"
                                exact
                            ></PrivateRoute>
                            <PrivateRoute
                                component={SettingsPage}
                                authorized={authCtx.isLoggedIn}
                                userRoles={authCtx.roles}
                                allowedRoles={ADMINISTRATOR_ROLES}
                                path="/settings"
                            ></PrivateRoute>
                            <Route path="/posts/:id" exact>
                                <PostPage />
                            </Route>
                            <Route path="*">
                                <Redirect to="/404" />
                            </Route>
                        </Switch>
                    </Layout>
                </ThemeProvider>
            </MuiThemeProvider>
        )
    );
}

export default App;
