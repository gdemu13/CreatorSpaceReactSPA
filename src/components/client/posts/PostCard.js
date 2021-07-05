import {
    Link,
    Paper,
    Typography,
    Box,
    Grid,
    Menu,
    MenuItem,
    IconButton,
    Snackbar,
    Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ReactPlayer from 'react-player';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { ADMIN_ROLE, POST_TYPE, SUPERUSER_ROLE } from '../../../constants';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { useContext, useState } from 'react';
import AuthContext from '../../../store/auth-context';
import { LockOpen, MoreVert, ThumbUp } from '@material-ui/icons';
import Comments from './Comments';
import { Post } from '../../../api/service';

const PostContainer = styled(Paper)`
    margin-top: 16px;
    padding: 16px;
`;

const MainImage = styled.img`
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 4px;
`;

const SecondaryImage = styled.img`
    width: 100%;
    object-fit: cover;
    border-radius: 4px;
`;

const LockedPostBackground = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    background-color: lightgray;
    border-radius: 4px;
    width: 100%;
    height: 300px;
`;

const PostCard = ({
    id,
    title,
    text,
    teaserText,
    type,
    accessType,
    tiers,
    minimumTierPrice,
    images,
    videoUrl,
    dateCreated,
    numberOfLikes,
    numberOfComments,
    setNumberOfComments,
    liked,
    locked,
    notMobile,
    includeComments,
    setLike,
}) => {
    const authCtx = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [copySuccessOpen, setCopySuccessOpen] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const copyPostUrl = () => {
        navigator.clipboard.writeText(
            `${window.location.hostname}/posts/${id}`
        );
        setCopySuccessOpen(true);
        handleClose();
    };

    const handleLike = () => {
        Post.like(id, { like: !liked }).then(() => setLike(id, !liked));
    };

    return (
        <PostContainer variant="outlined">
            <Box position="relative">
                <Typography variant="h2" style={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <IconButton
                    aria-label="account of current user"
                    aria-controls={`post-menu-${id}`}
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        padding: 0,
                    }}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    id={`post-menu-${id}`}
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
                    <MenuItem onClick={copyPostUrl}>Copy post URL</MenuItem>
                    {authCtx.hasPermission([SUPERUSER_ROLE, ADMIN_ROLE]) && (
                        <MenuItem
                            component={RouterLink}
                            to={`/posts/edit/${id}`}
                            onClick={handleClose}
                        >
                            Edit
                        </MenuItem>
                    )}
                </Menu>
                <Snackbar
                    open={copySuccessOpen}
                    autoHideDuration={3000}
                    onClose={() => setCopySuccessOpen(false)}
                >
                    <Alert
                        onClose={() => setCopySuccessOpen(false)}
                        severity="info"
                    >
                        Post URL was copied to clipboard!
                    </Alert>
                </Snackbar>
            </Box>
            <Link
                component={RouterLink}
                to={`/posts/${id}`}
                variant="h6"
                color="textSecondary"
            >
                {dateCreated}
            </Link>
            {locked && (
                <>
                    <Box
                        mt={2}
                        dangerouslySetInnerHTML={{ __html: teaserText }}
                    ></Box>
                    <LockedPostBackground>
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            startIcon={<LockOpen />}
                            component={RouterLink}
                            to="/subscription"
                        >
                            Unlock for ${minimumTierPrice}/month
                        </Button>
                    </LockedPostBackground>
                </>
            )}
            {!locked && (
                <>
                    <Box
                        mt={2}
                        dangerouslySetInnerHTML={{ __html: text }}
                    ></Box>
                    {type === POST_TYPE.Images && images.length > 0 && (
                        <Box mt={2}>
                            <Gallery
                                shareButton={false}
                                options={{
                                    showAnimationDuration: 0,
                                    hideAnimationDuration: 0,
                                }}
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Item
                                            original={images[0].url}
                                            width="1024"
                                            height="768"
                                        >
                                            {({ ref, open }) => (
                                                <MainImage
                                                    ref={ref}
                                                    onClick={open}
                                                    src={images[0].url}
                                                    style={{
                                                        maxWidth: '100%',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            )}
                                        </Item>
                                    </Grid>

                                    {images.slice(1).map((image) => (
                                        <Grid item xs={3} key={image.id}>
                                            <Item
                                                original={image.url}
                                                width="1024"
                                                height="768"
                                            >
                                                {({ ref, open }) => (
                                                    <SecondaryImage
                                                        ref={ref}
                                                        onClick={open}
                                                        src={image.url}
                                                        style={{
                                                            maxWidth: '100%',
                                                            borderRadius: '4px',
                                                        }}
                                                    />
                                                )}
                                            </Item>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Gallery>
                        </Box>
                    )}
                    {type === POST_TYPE.Video && (
                        <Box
                            mt={2}
                            display="flex"
                            justifyContent="center"
                            position="relative"
                            paddingTop="56.25%"
                        >
                            <ReactPlayer
                                url={videoUrl}
                                width="100%"
                                height="100%"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}
                                config={{
                                    facebook: {
                                        attributes: {
                                            height: notMobile
                                                ? '400px'
                                                : '200px',
                                            padding: '0',
                                            backgroundColor: '#000',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </>
            )}
            <Box
                mt={2}
                display="flex"
                justifyContent={
                    locked || !authCtx.isLoggedIn ? 'flex-end' : 'space-between'
                }
                alignItems="center"
            >
                {!locked && authCtx.isLoggedIn && (
                    <Button
                        variant={liked ? 'contained' : 'outlined'}
                        color="primary"
                        startIcon={<ThumbUp />}
                        onClick={handleLike}
                    >
                        Like
                    </Button>
                )}
                <Box display="flex">
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        style={{ marginRight: '8px' }}
                    >
                        {numberOfLikes} Likes
                    </Typography>
                    <Link
                        component={RouterLink}
                        to={`/posts/${id}`}
                        variant="h6"
                        color="textSecondary"
                    >
                        {numberOfComments} Comments
                    </Link>
                </Box>
            </Box>

            {includeComments && !locked && (
                <Box>
                    <Comments
                        postId={id}
                        name={authCtx.name}
                        userId={authCtx.id}
                        setNumberOfComments={setNumberOfComments}
                    />
                </Box>
            )}
        </PostContainer>
    );
};

export default PostCard;
