import { Container, Tab, Tabs, Box } from '@material-ui/core';
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
import TierForm from '../components/admin/tiers/TierForm';
import Tiers from '../components/admin/tiers/Tiers';

const StyledTabs = styled(Tabs)`
    .MuiTab-wrapper {
        align-items: flex-start;
    }
`;

const Settings = () => {
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

    return (
        <Container maxWidth="xl">
            <Box display="flex" flexDirection="row">
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
                        <Route path={`${match.path}/tiers`} exact>
                            <Tiers />
                        </Route>
                        <Route path={`${match.path}/goals`} exact>
                            <Goals />
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
            </Box>
        </Container>
    );
};

export default Settings;
