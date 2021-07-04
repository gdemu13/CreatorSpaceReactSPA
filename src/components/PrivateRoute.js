import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
    component: Component,
    authorized,
    allowedRoles,
    userRoles,
    ...rest
}) => {
    let userHasRoles;
    if (allowedRoles) {
        userHasRoles = allowedRoles.includes(userRoles);
    }
    return (
        <Route
            {...rest}
            render={(props) =>
                authorized ? (
                    allowedRoles ? (
                        userHasRoles ? (
                            <Component {...props} />
                        ) : (
                            <Redirect to="/403" />
                        )
                    ) : (
                        <Component {...props} />
                    )
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
