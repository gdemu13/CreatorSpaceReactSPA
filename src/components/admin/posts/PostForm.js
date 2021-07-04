import { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    TextField,
    Typography,
    useMediaQuery,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    FormGroup,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Helmet } from 'react-helmet';
import { Container } from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { QuillContainer } from '../../common/QuillConfig';
import { Post, Tier } from '../../../api/service';
import { objTOFormData } from '../../../utils';
import { FormContainer } from '../../common/styles';
import {
    PhotoLibrary,
    Publish,
    TextFields,
    Videocam,
} from '@material-ui/icons';
import SortableImages from './SortableImages';
import ReactPlayer from 'react-player';
import { useHistory, useParams } from 'react-router';
import { POST_TYPE } from '../../../constants';
import ConfirmDialog from '../../common/ConfirmDialog';

const StyledToggleButton = styled(ToggleButton)`
    width: 33.333%;
    .MuiToggleButton-label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
        width: 100px;
    }
`;

const PostForm = () => {
    const notMobile = useMediaQuery('(min-width:768px)');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [tiers, setTiers] = useState(null);
    const imgInputRef = useRef(null);
    const history = useHistory();
    const { id } = useParams();
    const [title, setTitle] = useState(`${id ? 'Edit' : 'Add'} Post`);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: '',
            type: 1,
            text: '',
            accessType: '1',
            images: [],
            tiers: [],
        },
        validationSchema: Yup.object({
            type: !id
                ? Yup.number().required('Post type is required')
                : Yup.number(),
            title: Yup.string().required('Title is required'),
        }),
        onSubmit: (values) => {
            if (id) {
                const data = objTOFormData({
                    ...values,
                    images: values.images.map((x) => {
                        return { id: x.id, file: x.file };
                    }),
                });
                Post.update(id, data).then(() => history.push('/'));
            } else {
                const images = values.images;
                const data = objTOFormData({
                    ...values,
                    images: null,
                });
                for (let i = 0; i < images.length; i++) {
                    const image = images[i];
                    data.append('images', image.file);
                }
                Post.add(data).then(() => history.push('/'));
            }
        },
    });

    useEffect(() => {
        const promises = [];
        promises.push(Tier.getTiers().then((data) => setTiers(data)));

        if (id) {
            promises.push(
                Post.get(id).then((data) => formik.resetForm({ values: data }))
            );
        }

        Promise.all(promises).then(() => setLoading(false));
    }, []);

    const handleTiersChange = (tierId, checked) => {
        if (checked) {
            formik.setFieldValue('tiers', [...formik.values.tiers, tierId]);
        } else {
            formik.setFieldValue(
                'tiers',
                formik.values.tiers.filter((t) => t !== tierId)
            );
        }
    };

    const handleAddImages = (event) => {
        const images = [...event.currentTarget.files];
        formik.setFieldValue('images', [
            ...formik.values.images,
            ...images.map((i) => {
                return { id: null, url: URL.createObjectURL(i), file: i };
            }),
        ]);
        event.target.value = null;
    };

    const handleRemoveImage = (index) => {
        const imagesCopy = [...formik.values.images];
        imagesCopy.splice(index, 1);
        formik.setFieldValue('images', imagesCopy);
    };

    const handleDelete = () => {
        setDeleteDialogOpen(false);
        Post.delete(id).then(() => {
            history.replace('/');
        });
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    return (
        !loading && (
            <Box
                display="flex"
                flexDirection="column"
                height="100%"
                justifyContent="center"
                alignItems="center"
                width="100%"
                mt={2}
            >
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <Container maxWidth="md">
                    <FormContainer variant="outlined">
                        <Box mb={3}>
                            <Typography color="textPrimary" variant="h2">
                                {title}
                            </Typography>
                        </Box>
                        <form onSubmit={formik.handleSubmit} noValidate>
                            {!id && (
                                <Grid container spacing={2} alignItems="center">
                                    <Grid
                                        item
                                        xs={12}
                                        sm={3}
                                        style={{ maxWidth: '165px' }}
                                    >
                                        <Typography variant="h4">
                                            Select post type:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <ToggleButtonGroup
                                            size="large"
                                            name="type"
                                            id="type"
                                            value={formik.values.type}
                                            exclusive
                                            onChange={(_, newVal) =>
                                                formik.setFieldValue(
                                                    'type',
                                                    newVal
                                                )
                                            }
                                            style={{
                                                width: '100%',
                                            }}
                                        >
                                            <StyledToggleButton
                                                key={1}
                                                value={POST_TYPE.Text}
                                            >
                                                <TextFields />
                                                Text
                                            </StyledToggleButton>
                                            <StyledToggleButton
                                                key={2}
                                                value={POST_TYPE.Images}
                                            >
                                                <PhotoLibrary />
                                                Images
                                            </StyledToggleButton>
                                            <StyledToggleButton
                                                key={3}
                                                value={POST_TYPE.Video}
                                            >
                                                <Videocam />
                                                Video
                                            </StyledToggleButton>
                                        </ToggleButtonGroup>
                                    </Grid>
                                </Grid>
                            )}
                            <TextField
                                error={Boolean(
                                    formik.touched.title && formik.errors.title
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.title && formik.errors.title
                                }
                                label="Title"
                                margin="normal"
                                name="title"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.title || ''}
                                variant="outlined"
                            />

                            <QuillContainer>
                                <ReactQuill
                                    theme="snow"
                                    name="text"
                                    id="text"
                                    modules={{
                                        toolbar: [
                                            [
                                                'bold',
                                                'italic',
                                                'underline',
                                                'strike',
                                                'blockquote',
                                            ],
                                            [
                                                { 'header': 1 },
                                                { 'header': 2 },
                                                'code-block',
                                            ],
                                            [
                                                { 'list': 'ordered' },
                                                { 'list': 'bullet' },
                                                { 'indent': '-1' },
                                                { 'indent': '+1' },
                                            ],
                                            ['clean'],
                                        ],
                                        clipboard: {
                                            matchVisual: false,
                                        },
                                    }}
                                    placeholder="Enter text"
                                    value={formik.values.text || ''}
                                    onChange={(content) =>
                                        formik.handleChange('text')(content)
                                    }
                                />
                            </QuillContainer>

                            {formik.values.type === POST_TYPE.Images && (
                                <Box mt={2}>
                                    <SortableImages
                                        images={formik.values.images}
                                        setImages={(modified) =>
                                            formik.setFieldValue(
                                                'images',
                                                modified
                                            )
                                        }
                                        onRemove={handleRemoveImage}
                                    />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={imgInputRef}
                                        id="imgInputRef"
                                        name="imgInputRef"
                                        onChange={handleAddImages}
                                        style={{ display: 'none' }}
                                    />
                                    <Box mt={2}>
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            size="large"
                                            startIcon={<Publish />}
                                            onClick={() =>
                                                imgInputRef.current.click()
                                            }
                                        >
                                            Add Images
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {formik.values.type === POST_TYPE.Video && (
                                <>
                                    <TextField
                                        error={Boolean(
                                            formik.touched.videoUrl &&
                                                formik.errors.videoUrl
                                        )}
                                        fullWidth
                                        helperText={
                                            formik.touched.videoUrl &&
                                            formik.errors.videoUrl
                                        }
                                        label="Video URL"
                                        margin="normal"
                                        name="videoUrl"
                                        onChange={formik.handleChange}
                                        value={formik.values.videoUrl || ''}
                                        variant="outlined"
                                    />
                                    {!!formik.values.videoUrl &&
                                        ReactPlayer.canPlay(
                                            formik.values.videoUrl
                                        ) && (
                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                position="relative"
                                                paddingTop="56.25%"
                                            >
                                                <ReactPlayer
                                                    url={formik.values.videoUrl}
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
                                                                backgroundColor:
                                                                    '#000',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        )}
                                </>
                            )}

                            <Box mt={2}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                        Who can view this post?
                                    </FormLabel>
                                    <RadioGroup
                                        aria-label="accessType"
                                        name="accessType"
                                        value={formik.values.accessType}
                                        onChange={(event) =>
                                            formik.setFieldValue(
                                                'accessType',
                                                parseInt(event.target.value)
                                            )
                                        }
                                    >
                                        <FormControlLabel
                                            value={1}
                                            control={<Radio color="primary" />}
                                            label="Public"
                                        />
                                        <FormControlLabel
                                            value={2}
                                            control={<Radio color="primary" />}
                                            label="Only subscribers"
                                        />
                                        <FormControlLabel
                                            value={3}
                                            control={<Radio color="primary" />}
                                            label="Specific tiers"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            {formik.values.accessType === 3 && (
                                <Box ml={2}>
                                    <FormControl>
                                        <FormLabel component="legend">
                                            Select tiers
                                        </FormLabel>
                                        <FormGroup>
                                            {tiers.map((tier) => (
                                                <FormControlLabel
                                                    key={tier.id}
                                                    control={
                                                        <Checkbox
                                                            checked={formik.values.tiers.some(
                                                                (t) =>
                                                                    t ===
                                                                    tier.id
                                                            )}
                                                            onChange={(event) =>
                                                                handleTiersChange(
                                                                    tier.id,
                                                                    event.target
                                                                        .checked
                                                                )
                                                            }
                                                            name="tiers"
                                                            color="primary"
                                                        />
                                                    }
                                                    label={tier.title}
                                                />
                                            ))}
                                        </FormGroup>
                                    </FormControl>
                                </Box>
                            )}

                            {!!error && (
                                <FormHelperText error>{error}</FormHelperText>
                            )}

                            <Box py={3} display="flex">
                                {id && (
                                    <Button
                                        color="secondary"
                                        fullWidth
                                        size="large"
                                        type="button"
                                        variant="outlined"
                                        style={{ marginRight: '16px' }}
                                        onClick={() =>
                                            setDeleteDialogOpen(true)
                                        }
                                    >
                                        Delete
                                    </Button>
                                )}
                                <Button
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    {id ? 'Save Changes' : 'Publish'}
                                </Button>
                            </Box>
                        </form>
                    </FormContainer>
                </Container>

                <ConfirmDialog
                    isOpen={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    onConfirm={handleDelete}
                    content="Are you sure you want to delete this post?"
                    confirmButtonText="Delete"
                />
            </Box>
        )
    );
};

export default PostForm;
