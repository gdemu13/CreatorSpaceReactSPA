import { Container, Tab, Tabs, Box } from '@material-ui/core';
import { useContext } from 'react';
import {
    Link,
    useLocation,
    useRouteMatch,
    Switch,
    Route,
} from 'react-router-dom';
import styled from 'styled-components';
import CompanyForm from '../components/admin/company/CompanyForm';
import GoalForm from '../components/admin/goals/GoalForm';
import Goals from '../components/admin/goals/Goals';
import AddUser from '../components/admin/team/AddUser';
import Team from '../components/admin/team/Team';
import TierForm from '../components/admin/tiers/TierForm';
import Tiers from '../components/admin/tiers/Tiers';
import { SUPERUSER_ROLE } from '../constants';
import AuthContext from '../store/auth-context';

const RootContainer = styled.div`
    display: flex;
    flex-direction: column;
    ${(props) => props.theme.breakpoints.up('md')} {
        flex-direction: row;
    }
`;

const StyledTabs = styled(Tabs)`
    .MuiTab-wrapper {
        align-items: flex-start;
    }
`;

const Settings = () => {
    const authCtx = useContext(AuthContext);
    const match = useRouteMatch();
    const location = useLocation();

    const goalsMatch = useRouteMatch([
        '/settings/goals/edit/:id',
        '/settings/goals/add',
        '/settings/goals',
    ]);

    const tiersMatch = useRouteMatch([
        '/settings/tiers/edit/:id',
        '/settings/tiers/add',
        '/settings/tiers',
    ]);

    const teamMatch = useRouteMatch(['/settings/team/add', '/settings/team']);

    return (
        <Container maxWidth="xl">
            <RootContainer>
                <StyledTabs
                    orientation="vertical"
                    indicatorColor="primary"
                    textColor="primary"
                    value={location.pathname}
                >
                    <Tab
                        label="Basic info"
                        component={Link}
                        value={`${match.url}`}
                        to={`${match.url}`}
                    />
                    {authCtx.hasPermission([SUPERUSER_ROLE]) && (
                        <Tab
                            label="Team"
                            component={Link}
                            value={`${teamMatch?.url}`}
                            to={`${match.url}/team`}
                        />
                    )}
                    <Tab
                        label="Tiers"
                        component={Link}
                        value={tiersMatch?.url || `${match.url}/tiers`}
                        to={`${match.url}/tiers`}
                    />
                    <Tab
                        label="Goals"
                        component={Link}
                        value={goalsMatch?.url || `${match.url}/goals`}
                        to={`${match.url}/goals`}
                    />
                </StyledTabs>
                <Box mt={2} width="100%">
                    <Switch>
                        <Route path={match.path} exact>
                            <CompanyForm />
                        </Route>
                        <Route path={`${match.path}/team`} exact>
                            <Team />
                        </Route>
                        <Route path={`${match.path}/tiers`} exact>
                            <Tiers />
                        </Route>
                        <Route path={`${match.path}/goals`} exact>
                            <Goals />
                        </Route>
                        <Route path={`${match.path}/team/add`} exact>
                            <AddUser />
                        </Route>
                        <Route path={`${match.path}/goals/add`} exact>
                            <GoalForm />
                        </Route>
                        <Route path={`${match.path}/goals/edit/:id`} exact>
                            <GoalForm />
                        </Route>
                        <Route path={`${match.path}/tiers/add`} exact>
                            <TierForm />
                        </Route>
                        <Route path={`${match.path}/tiers/edit/:id`} exact>
                            <TierForm />
                        </Route>
                    </Switch>
                </Box>
            </RootContainer>
        </Container>
    );
};

export default Settings;
