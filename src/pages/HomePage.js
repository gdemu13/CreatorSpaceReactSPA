import { Helmet } from 'react-helmet';
import Goals from '../components/client/goals/Goals';
import Posts from '../components/client/posts/Posts';
import Tiers from '../components/client/tiers/Tiers';
import styled from 'styled-components';
import { Container, IconButton, Typography, Link } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Company } from '../api/service';
import { Facebook, Instagram, Twitter, YouTube } from '@material-ui/icons';

const FullWidthContainer = styled.div`
    background: ${(props) => props.theme.palette.background.paper};
    width: 100%;
    height: 500px;
    margin-bottom: 16px;
`;

const CoverContainer = styled.div`
    position: relative;
    width: calc(100% + 32px);
    height: 250px;
    margin-bottom: 250px;
    margin-right: -16px;
    margin-left: -16px;
    ${(props) => props.theme.breakpoints.up('sm')} {
        height: 350px;
        width: 100%;
        margin-right: 0;
        margin-left: 0;
        margin-bottom: 156px;
    }
`;

const CoverPhoto = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
`;

const ProfilePhoto = styled.img`
    position: absolute;
    bottom: -130px;
    left: calc(50% - 84px);
    width: 168px;
    height: 168px;
    border-radius: 50%;
    border: 5px solid ${(props) => props.theme.palette.background.paper};
    ${(props) => props.theme.breakpoints.up('sm')} {
        left: 50px;
    }
`;

const NameContainer = styled.div`
    position: relative;
    left: 0;
    bottom: -150px;
    text-align: center;
    ${(props) => props.theme.breakpoints.up('sm')} {
        bottom: -20px;
        left: 250px;
        text-align: left;
    }
`;

const SocialLinksContainer = styled.div`
    position: absolute;
    bottom: -254px;
    width: 100%;
    text-align: center;
    ${(props) => props.theme.breakpoints.up('sm')} {
        bottom: -40px;
        right: -14px;
        width: auto;
    }
`;

const HomePage = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        Company.get().then((data) => setSettings(data));
    }, []);

    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>

            {settings && (
                <FullWidthContainer>
                    <Container maxWidth="lg">
                        <CoverContainer>
                            <CoverPhoto
                                src={
                                    settings.coverPhotoUrl ||
                                    '/static/defaultcover.jpg'
                                }
                            ></CoverPhoto>
                            <ProfilePhoto
                                src={
                                    settings.profilePhotoUrl ||
                                    '/static/defaultprofile.jpg'
                                }
                            ></ProfilePhoto>
                            <NameContainer>
                                <Typography variant="h2">
                                    {settings.name}
                                </Typography>
                                <Typography variant="h5" color="textSecondary">
                                    is creating {settings.creationName}
                                </Typography>
                            </NameContainer>
                            <SocialLinksContainer>
                                {!!settings.facebookUrl && (
                                    <Link
                                        component={IconButton}
                                        color="inherit"
                                        target="_blank"
                                        href={settings.facebookUrl}
                                    >
                                        <Facebook />
                                    </Link>
                                )}
                                {!!settings.instagramUrl && (
                                    <Link
                                        component={IconButton}
                                        color="inherit"
                                        target="_blank"
                                        href={settings.instagramUrl}
                                    >
                                        <Instagram />
                                    </Link>
                                )}
                                {!!settings.twitterUrl && (
                                    <Link
                                        component={IconButton}
                                        color="inherit"
                                        target="_blank"
                                        href={settings.twitterUrl}
                                    >
                                        <Twitter />
                                    </Link>
                                )}
                                {!!settings.youtubeUrl && (
                                    <Link
                                        component={IconButton}
                                        color="inherit"
                                        target="_blank"
                                        href={settings.youtubeUrl}
                                    >
                                        <YouTube />
                                    </Link>
                                )}
                            </SocialLinksContainer>
                        </CoverContainer>
                    </Container>
                </FullWidthContainer>
            )}
            <Tiers />
            <Goals />
            <Posts />
        </>
    );
};

export default HomePage;
