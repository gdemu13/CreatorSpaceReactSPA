import { Helmet } from 'react-helmet';
import { Box, Container, Typography } from '@material-ui/core';
import UpdateProfileForm from '../components/account/UpdateProfileForm';
import { useState, useEffect } from 'react';
import { Account } from '../api/service';
import ChangePasswordForm from '../components/account/ChangePasswordForm';
import { FormContainer } from '../components/common/styles';

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    useEffect(() => {
        Account.getProfile()
            .then((data) => {
                setProfileData(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
            });
    }, []);

    return (
        !isLoading && (
            <>
                <Helmet>
                    <title>My Profile</title>
                </Helmet>
                <Box mt={4}>
                    <Container maxWidth="sm">
                        <FormContainer>
                            <Box mb={3}>
                                <Typography color="textPrimary" variant="h2">
                                    Profile
                                </Typography>
                            </Box>
                            <UpdateProfileForm profileData={profileData} />
                            <Box my={3}>
                                <Typography color="textPrimary" variant="h3">
                                    Change your password
                                </Typography>
                            </Box>
                            <ChangePasswordForm />
                        </FormContainer>
                    </Container>
                </Box>
            </>
        )
    );
};

export default Profile;
