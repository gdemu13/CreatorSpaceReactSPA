import { useState, useEffect, useRef, useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    Box,
    Button,
    FormHelperText,
    InputAdornment,
    TextField,
    Typography,
} from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Container } from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { QuillConfig, QuillContainer } from '../../common/QuillConfig';
import { Goal, Tier } from '../../../api/service';
import { useHistory, useParams } from 'react-router-dom';
import ConfirmDialog from '../../common/ConfirmDialog';
import { objTOFormData } from '../../../utils';
import { Add } from '@material-ui/icons';
import SortableVerticalList from '../../common/SortableVerticalList';
import { FormContainer } from '../../common/styles';
import BenefitDialog from './BenefitDialog';
import BenefitFormDialog from './BenefitFormDialog';

const TierImage = styled.img`
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

const TierForm = (props) => {
    const [error, setError] = useState('');
    const history = useHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(id ? true : false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [benefits, setBenefits] = useState([]);
    const [benefitCategories, setBenefitCategories] = useState(null);
    const [benefitDialogOpen, setBenefitDialogOpen] = useState(false);
    const [benefitFormDialogOpen, setBenefitFormDialogOpen] = useState(false);
    const [benefitToEdit, setBenefitToEdit] = useState(null);
    const imageInputRef = useRef(null);
    const imgRef = useRef(null);

    const title = (id ? 'Edit' : 'Add') + ' Tier';

    const redirectToGoalsPage = () => {
        history.push('/settings/tiers');
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            price: '',
            description: '',
            imageUrl: '',
            benefits: [],
        },
        validationSchema: Yup.object({
            title: Yup.string().required('title is required'),
            price: Yup.number().required('price is required'),
        }),
        onSubmit: (values) => {
            const data = objTOFormData({
                ...values,
                benefits: values.benefits.map((x) => x.id),
            });

            if (id) {
                Tier.update(id, data).then((_) => {
                    redirectToGoalsPage();
                });
            } else {
                Tier.add(data).then((_) => {
                    redirectToGoalsPage();
                });
            }
        },
    });

    const notAddedBenefits = useMemo(
        () =>
            benefits.filter((benefit) =>
                formik.values.benefits.every((b) => b.id !== benefit.id)
            ),
        [formik.values.benefits, benefits]
    );

    const addBenefits = (newBenefits) => {
        formik.setFieldValue('benefits', [
            ...formik.values.benefits,
            ...newBenefits,
        ]);
        setBenefitDialogOpen(false);
    };

    useEffect(() => {
        Tier.get(id || 0).then((data) => {
            if (id) {
                formik.resetForm({ values: data.tier });
            }
            setBenefits(data.benefits);
            setBenefitCategories(data.benefitCategories);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (formik.values.image) {
            let url = URL.createObjectURL(formik.values.image);
            formik.setFieldValue('imageUrl', url);
            imgRef.current.src = url;
        }
    }, [formik.values.image]);

    const handleDelete = () => {
        setDeleteDialogOpen(false);
        Goal.delete(id).then((_) => {
            redirectToGoalsPage();
        });
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleRemoveBenefit = (benefit) => {
        const benefitsCopy = [...formik.values.benefits];
        const index = benefitsCopy.findIndex((b) => b.id === benefit.id);
        benefitsCopy.splice(index, 1);
        formik.setFieldValue('benefits', benefitsCopy);
    };

    const handleAddNewBenefit = (benefit) => {
        setBenefits([benefit, ...benefits]);
        setBenefitFormDialogOpen(false);
    };

    const handleEditBenefit = (benefit) => {
        setBenefits(benefits.map((b) => (b.id === benefit.id ? benefit : b)));
        setBenefitFormDialogOpen(false);
    };

    const handleDeleteBenefit = (benefitId) => {
        const benefitsCopy = [...benefits];
        const index = benefitsCopy.findIndex((b) => b.id === benefitId);

        benefitsCopy.splice(index, 1);
        setBenefits(benefitsCopy);
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

                            <TextField
                                error={Boolean(
                                    formik.touched.price && formik.errors.price
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.price && formik.errors.price
                                }
                                type="number"
                                label="Price"
                                margin="normal"
                                name="price"
                                disabled={
                                    formik.values.numberOfActiveSubscribers > 0
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.price || ''}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box my={2}>
                                <Box mb={2}>
                                    <Typography variant="h4">
                                        Benefits
                                    </Typography>
                                </Box>
                                <SortableVerticalList
                                    items={formik.values.benefits}
                                    setItems={(newValue) =>
                                        formik.setFieldValue(
                                            'benefits',
                                            newValue
                                        )
                                    }
                                    onRemove={handleRemoveBenefit}
                                />
                                <Box mt={3}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        size="large"
                                        startIcon={<Add />}
                                        onClick={() =>
                                            setBenefitDialogOpen(true)
                                        }
                                    >
                                        Add Benefit
                                    </Button>
                                </Box>
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
                                    ref={imageInputRef}
                                    id="image"
                                    name="image"
                                    onChange={(event) => {
                                        formik.setFieldValue(
                                            'image',
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
                                    Image
                                </Typography>
                                <Box
                                    maxWidth="500px"
                                    height="200px"
                                    position="relative"
                                >
                                    <UploadTextOverlay
                                        onClick={() =>
                                            imageInputRef.current.click()
                                        }
                                    >
                                        Click to upload
                                    </UploadTextOverlay>
                                    <TierImage
                                        ref={imgRef}
                                        src={
                                            formik.values.imageUrl ||
                                            '/static/defaultCover.jpg'
                                        }
                                        onClick={() =>
                                            imageInputRef.current.click()
                                        }
                                    />
                                </Box>
                            </Box>

                            <QuillContainer>
                                <ReactQuill
                                    theme="snow"
                                    name="description"
                                    id="description"
                                    modules={QuillConfig}
                                    placeholder="Enter description"
                                    value={formik.values.description || ''}
                                    onChange={(content) =>
                                        formik.handleChange('description')(
                                            content
                                        )
                                    }
                                />
                            </QuillContainer>

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
                                        Delete Tier
                                    </Button>
                                )}

                                <Button
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Save {id && 'Changes'}
                                </Button>
                            </Box>
                        </form>
                    </FormContainer>
                </Container>

                <ConfirmDialog
                    isOpen={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    onConfirm={handleDelete}
                    content="Are you sure you want to delete this tier?"
                    confirmButtonText="Delete"
                />
                <BenefitDialog
                    isOpen={benefitDialogOpen}
                    onClose={() => setBenefitDialogOpen(false)}
                    benefits={notAddedBenefits}
                    benefitCategories={benefitCategories}
                    onConfirm={addBenefits}
                    onAddNew={() => setBenefitFormDialogOpen(true)}
                    onEdit={(benefit) => {
                        setBenefitToEdit(benefit);
                        setBenefitFormDialogOpen(true);
                    }}
                    onDelete={handleDeleteBenefit}
                />
                <BenefitFormDialog
                    isOpen={benefitFormDialogOpen}
                    onClose={() => setBenefitFormDialogOpen(false)}
                    onAddNew={handleAddNewBenefit}
                    onEdit={handleEditBenefit}
                    benefit={benefitToEdit}
                />
            </Box>
        )
    );
};

export default TierForm;
