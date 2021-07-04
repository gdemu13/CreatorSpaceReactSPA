import { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
    AppBar,
    Button,
    Toolbar,
    Menu,
    MenuItem,
    IconButton,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AuthContext from '../store/auth-context';
import styled from 'styled-components';
import Spinner from '../components/Spinner';
import { ADMIN_ROLE, CLIENT_ROLE, SUPERUSER_ROLE } from '../constants';
import { Add, Brightness4, Brightness7 } from '@material-ui/icons';

const LayoutRoot = styled.div`
    background-color: #ffffff;
    display: flex;
    height: 100%;
    overflow: hidden;
    width: 100%;
`;

const LayoutWrapper = styled.div`
    display: flex;
    flex: 1 1 auto;
    overflow: hidden;
    padding-top: 56px;
    background: ${(props) => props.theme.palette.background.default};
    ${(props) => props.theme.breakpoints.up('sm')} {
        padding-top: 64px;
    }
`;

const LayoutContainer = styled.div`
    display: flex;
    flex: 1 1 auto;
    overflow: hidden;
    padding-bottom: 24px;
`;

const LayoutContent = styled.div`
    flex: 1 1 auto;
    height: 100%;
`;

const Layout = (props) => {
    const authCtx = useContext(AuthContext);
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutHandler = () => {
        authCtx.logout();
        handleClose();
        history.push('/');
    };

    return (
        <LayoutRoot>
            <AppBar elevation={2} color="default">
                <Toolbar height={65}>
                    <Link to="/">
                        <img
                            alt="Logo"
                            src={`/static/${
                                props.isDarkMode ? 'logo-dark' : 'logo'
                            }.png`}
                            style={{ height: '50px', width: '50px' }}
                        />
                    </Link>
                    <div style={{ flexGrow: 1 }}></div>
                    {!authCtx.isLoggedIn && (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/register"
                            >
                                Register
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                            >
                                Login
                            </Button>
                        </>
                    )}
                    <IconButton onClick={props.toggleDarkMode} color="inherit">
                        {props.isDarkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    {authCtx.isLoggedIn && (
                        <div>
                            {authCtx.hasPermission([
                                SUPERUSER_ROLE,
                                ADMIN_ROLE,
                            ]) && (
                                <Button
                                    color="inherit"
                                    size="large"
                                    startIcon={<Add />}
                                    component={Link}
                                    to="/posts/add"
                                >
                                    Add Post
                                </Button>
                            )}
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={anchorEl != null}
                                getContentAnchorEl={null}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    component={Link}
                                    to="/profile"
                                    onClick={handleClose}
                                >
                                    My Profile
                                </MenuItem>
                                {authCtx.hasPermission(CLIENT_ROLE) && (
                                    <MenuItem
                                        component={Link}
                                        to="/subscription"
                                        onClick={handleClose}
                                    >
                                        Manage Subscription
                                    </MenuItem>
                                )}
                                {authCtx.hasPermission([
                                    SUPERUSER_ROLE,
                                    ADMIN_ROLE,
                                ]) && (
                                    <MenuItem
                                        component={Link}
                                        to="/settings"
                                        onClick={handleClose}
                                    >
                                        Page Settings
                                    </MenuItem>
                                )}
                                <MenuItem onClick={logoutHandler}>
                                    Log out
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <LayoutWrapper>
                <LayoutContainer>
                    <LayoutContent>{props.children}</LayoutContent>
                    <Spinner />
                </LayoutContainer>
            </LayoutWrapper>
        </LayoutRoot>
    );
};

export default Layout;
