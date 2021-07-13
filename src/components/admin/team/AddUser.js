import { Container, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Account } from '../../../api/service';
import RegisterForm from '../../account/RegisterForm';
import { FormContainer } from '../../common/styles';

const AddUser = () => {
    const history = useHistory();

    const handleSubmit = (data) => {
        Account.addTeamUser(data).then(() => {
            history.push('/settings/team');
        });
    };

    return (
        <Container maxWidth="sm">
            <FormContainer>
                <Typography variant="h3">Add team user</Typography>
                <RegisterForm submitHandler={handleSubmit} buttonText="Save" />
            </FormContainer>
        </Container>
    );
};

export default AddUser;
