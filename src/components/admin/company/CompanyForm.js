import { useState, useEffect, useRef, useContext } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    Box,
    Button,
    FormHelperText,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Popover,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Helmet } from 'react-helmet';
import { Container } from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { QuillConfig, QuillContainer } from '../../common/QuillConfig';
import { Company } from '../../../api/service';
import { objTOFormData } from '../../../utils';
import { FormContainer } from '../../common/styles';
import { Colorize } from '@material-ui/icons';
import { HexColorPicker } from 'react-colorful';
import ThemeContext from '../../../store/theme-context';

const ProfilePhoto = styled.img`
    border-radius: 50%;
    height: 130px;
    width: 130px;
    cursor: pointer;
`;

const CoverPhoto = styled.img`
    border-radius: 4px;
    height: 100%;
    width: 100%;
    object-fit: cover;
`;

const UploadTextOverlay = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.25s ease-in-out 0s;

    &:hover {
        opacity: 1;
        transition: opacity 0.25s ease-in-out 0s;
    }
`;

const StyledPopover = styled(Popover)`
    .MuiPopover-paper {
        overflow: hidden !important;
    }
`;

const CompanyForm = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const profileInputRef = useRef(null);
    const profileImgRef = useRef(null);
    const coverInputRef = useRef(null);
    const coverImgRef = useRef(null);
    const themeCtx = useContext(ThemeContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleColorPickerClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleColorPickerClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const formik = useFormik({
        initialValues: {
            name: '',
            creationName: '',
            description: '',
            googleAnalyticsId: '',
            facebookUrl: '',
            instagramUrl: '',
            twitterUrl: '',
            youTubeUrl: '',
            profilePhoto: '',
            coverPhoto: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('name is required'),
            creationName: Yup.string().required('creation name is required'),
        }),
        onSubmit: (values) => {
            Company.update(objTOFormData(values))
                .then(() => {
                    themeCtx.setColor(values.color);
                    setShowSuccessAlert(true);
                })
                .catch((error) => {
                    setError(error.response.data.detail);
                });
        },
    });

    useEffect(() => {
        Company.get().then((data) => {
            formik.resetForm({ values: data });
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (formik.values.profilePhoto) {
            let url = URL.createObjectURL(formik.values.profilePhoto);
            formik.setFieldValue('profilePhotoUrl', url);
            profileImgRef.current.src = url;
        }
    }, [formik.values.profilePhoto]);

    useEffect(() => {
        if (formik.values.coverPhoto) {
            let url = URL.createObjectURL(formik.values.coverPhoto);
            formik.setFieldValue('coverPhotoUrl', url);
            coverImgRef.current.src = url;
        }
    }, [formik.values.coverPhoto]);

    return (
        !loading && (
            <Box
                display="flex"
                flexDirection="column"
                height="100%"
                justifyContent="center"
                alignItems="center"
                width="100%"
            >
                <Helmet>
                    <title>Basic info</title>
                </Helmet>
                <Container maxWidth="md">
                    <FormContainer variant="outlined">
                        <Box mb={3}>
                            <Typography color="textPrimary" variant="h2">
                                Basic Info
                            </Typography>
                        </Box>
                        <form onSubmit={formik.handleSubmit} noValidate>
                            <TextField
                                error={Boolean(
                                    formik.touched.name && formik.errors.name
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.name && formik.errors.name
                                }
                                label="Name"
                                margin="normal"
                                name="name"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.name || ''}
                                variant="outlined"
                            />
                            <TextField
                                error={Boolean(
                                    formik.touched.creationName &&
                                        formik.errors.creationName
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.creationName &&
                                    formik.errors.creationName
                                }
                                label="Creation Name"
                                margin="normal"
                                name="creationName"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.creationName || ''}
                                variant="outlined"
                            />

                            <QuillContainer>
                                <ReactQuill
                                    theme="snow"
                                    name="description"
                                    id="description"
                                    modules={QuillConfig}
                                    placeholder="Enter description"
                                    value={formik.values.description || ''}
                                    onChange={(
                                        content,
                                        delta,
                                        source,
                                        editor
                                    ) => {
                                        formik.setFieldValue(
                                            'description',
                                            editor.getText().trim().length == 0
                                                ? null
                                                : content
                                        );
                                    }}
                                />
                            </QuillContainer>

                            <Box
                                mt={2}
                                mb={1}
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={profileInputRef}
                                    id="profilePhoto"
                                    name="profilePhoto"
                                    onChange={(event) => {
                                        formik.setFieldValue(
                                            'profilePhoto',
                                            event.currentTarget.files[0]
                                        );
                                    }}
                                    style={{ display: 'none' }}
                                />
                                <Typography
                                    color="textPrimary"
                                    variant="h5"
                                    style={{ marginRight: '16px' }}
                                >
                                    Profile photo
                                </Typography>
                                <ProfilePhoto
                                    ref={profileImgRef}
                                    src={
                                        formik.values.profilePhotoUrl ||
                                        '/static/defaultprofile.jpg'
                                    }
                                    onClick={() =>
                                        profileInputRef.current.click()
                                    }
                                />
                            </Box>

                            <Box
                                mt={2}
                                mb={1}
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={coverInputRef}
                                    id="coverPhoto"
                                    name="coverPhoto"
                                    onChange={(event) => {
                                        formik.setFieldValue(
                                            'coverPhoto',
                                            event.currentTarget.files[0]
                                        );
                                    }}
                                    style={{ display: 'none' }}
                                />
                                <Typography
                                    color="textPrimary"
                                    variant="h5"
                                    style={{
                                        marginRight: '16px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Cover photo
                                </Typography>
                                <Box
                                    maxWidth="450px"
                                    height="200px"
                                    position="relative"
                                >
                                    <UploadTextOverlay
                                        onClick={() =>
                                            coverInputRef.current.click()
                                        }
                                    >
                                        Click to upload
                                    </UploadTextOverlay>
                                    <CoverPhoto
                                        ref={coverImgRef}
                                        src={
                                            formik.values.coverPhotoUrl ||
                                            '/static/defaultcover.jpg'
                                        }
                                        onClick={() =>
                                            coverInputRef.current.click()
                                        }
                                    />
                                </Box>
                            </Box>

                            <TextField
                                error={Boolean(
                                    formik.touched.googleAnalyticsId &&
                                        formik.errors.googleAnalyticsId
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.googleAnalyticsId &&
                                    formik.errors.googleAnalyticsId
                                }
                                label="Google Analytics ID"
                                margin="normal"
                                name="googleAnalyticsId"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.googleAnalyticsId || ''}
                                variant="outlined"
                            />

                            <TextField
                                error={Boolean(
                                    formik.touched.color && formik.errors.color
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.color && formik.errors.color
                                }
                                label="Theme color"
                                margin="normal"
                                name="color"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.color || ''}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <div>
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    edge="end"
                                                    onClick={
                                                        handleColorPickerClick
                                                    }
                                                >
                                                    <Colorize />
                                                </IconButton>

                                                <StyledPopover
                                                    id={id}
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={
                                                        handleColorPickerClose
                                                    }
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'center',
                                                    }}
                                                >
                                                    <HexColorPicker
                                                        color={
                                                            formik.values.color
                                                        }
                                                        onChange={(color) =>
                                                            formik.setFieldValue(
                                                                'color',
                                                                color
                                                            )
                                                        }
                                                    />
                                                </StyledPopover>
                                            </div>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box mt={4}>
                                <Typography color="textPrimary" variant="h4">
                                    Social media links
                                </Typography>
                            </Box>

                            <TextField
                                error={Boolean(
                                    formik.touched.facebookUrl &&
                                        formik.errors.facebookUrl
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.facebookUrl &&
                                    formik.errors.facebookUrl
                                }
                                label="Facebook URL"
                                margin="normal"
                                name="facebookUrl"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.facebookUrl || ''}
                                variant="outlined"
                            />

                            <TextField
                                error={Boolean(
                                    formik.touched.instagramUrl &&
                                        formik.errors.instagramUrl
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.instagramUrl &&
                                    formik.errors.instagramUrl
                                }
                                label="Instagram URL"
                                margin="normal"
                                name="instagramUrl"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.instagramUrl || ''}
                                variant="outlined"
                            />
                            <TextField
                                error={Boolean(
                                    formik.touched.twitterUrl &&
                                        formik.errors.twitterUrl
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.twitterUrl &&
                                    formik.errors.twitterUrl
                                }
                                label="Twitter URL"
                                margin="normal"
                                name="twitterUrl"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.twitterUrl || ''}
                                variant="outlined"
                            />

                            <TextField
                                error={Boolean(
                                    formik.touched.youtubeUrl &&
                                        formik.errors.youtubeUrl
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.youtubeUrl &&
                                    formik.errors.youtubeUrl
                                }
                                label="Youtube URL"
                                margin="normal"
                                name="youtubeUrl"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.youtubeUrl || ''}
                                variant="outlined"
                            />

                            {showSuccessAlert && (
                                <Box component={Alert} mt={1}>
                                    Changes saved successfully!
                                </Box>
                            )}
                            {!!error && (
                                <FormHelperText error>{error}</FormHelperText>
                            )}

                            <Box py={3}>
                                <Button
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Save changes
                                </Button>
                            </Box>
                        </form>
                    </FormContainer>
                </Container>
            </Box>
        )
    );
};

export default CompanyForm;
