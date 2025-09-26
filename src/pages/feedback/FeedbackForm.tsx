import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Rating,
    Box,
    Grid,
    Paper
} from '@mui/material';

// Define the structure for our ERP feedback form data
interface ErpFeedbackState {
    staffName: string;
    email: string;
    libraryName: string;
    role: string;
    easeOfUseRating: number | null;
    featuresRating: number | null;
    performanceRating: number | null;
    supportRating: number | null;
    suggestions: string;
}

// Define the structure for validation errors
interface FormErrors {
    staffName?: string;
    email?: string;
    libraryName?: string;
    role?: string;
    easeOfUseRating?: string;
    featuresRating?: string;
    performanceRating?: string;
    supportRating?: string;
}

const ErpFeedbackForm: React.FC = () => {
    // State to hold the form data
    const [formData, setFormData] = useState<ErpFeedbackState>({
        staffName: '',
        email: '',
        libraryName: '',
        role: '',
        easeOfUseRating: 0,
        featuresRating: 0,
        performanceRating: 0,
        supportRating: 0,
        suggestions: '',
    });

    // State to hold validation errors
    const [errors, setErrors] = useState<FormErrors>({});
    // State to track if the form was successfully submitted
    const [submitted, setSubmitted] = useState<boolean>(false);

    // Handle changes in text fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle changes in the Select (dropdown) component
    // const handleSelectChange = (e: any) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     });
    // };

    // Handle changes in the star rating components
    const handleRatingChange = (name: keyof ErpFeedbackState, value: number | null) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Validate the form fields
    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.staffName.trim()) newErrors.staffName = 'Your name is required';
        if (!formData.libraryName.trim()) newErrors.libraryName = 'Library name is required';
        if (!formData.role) newErrors.role = 'Please select your role';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is not valid';
        }
        if (!formData.easeOfUseRating || formData.easeOfUseRating === 0) {
            newErrors.easeOfUseRating = 'Please provide a rating';
        }
        if (!formData.featuresRating || formData.featuresRating === 0) {
            newErrors.featuresRating = 'Please provide a rating';
        }
        if (!formData.performanceRating || formData.performanceRating === 0) {
            newErrors.performanceRating = 'Please provide a rating';
        }
        if (!formData.supportRating || formData.supportRating === 0) {
            newErrors.supportRating = 'Please provide a rating';
        }
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            console.log('ERP Feedback Submitted:', formData);
            setErrors({});
            setSubmitted(true);
        }
    };

    // If submitted, show a thank you message
    if (submitted) {
        return (
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Thank You!
                    </Typography>
                    <Typography variant="body1">
                        Your feedback has been received. We appreciate you taking the time to help us improve our ERP platform for libraries across India.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ padding: { xs: 2, sm: 4 }, marginTop: 4, borderRadius: '12px' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                        ERP Platform Feedback [Implementing Soon]
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary" paragraph>
                        Your input is vital for improving our ERP system for you and other libraries.
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Staff Information Section */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField size='small' fullWidth label="Your Name" name="staffName" value={formData.staffName} onChange={handleChange} error={!!errors.staffName} helperText={errors.staffName} required />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField size='small' fullWidth label="Your Email (Optional)" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField size='small' fullWidth label="Library Name" name="libraryName" value={formData.libraryName} onChange={handleChange} error={!!errors.libraryName} helperText={errors.libraryName} required />
                        </Grid>
                        {/* <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth required error={!!errors.role}>
                                <InputLabel id="role-select-label">Your Role</InputLabel>
                                <Select
                                    size='small'
                                    labelId="role-select-label"
                                    id="role-select"
                                    name="role"
                                    value={formData.role}
                                    label="Your Role"
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value="librarian">Librarian</MenuItem>
                                    <MenuItem value="admin">Administrator</MenuItem>
                                    <MenuItem value="staff">Library Staff</MenuItem>
                                    <MenuItem value="it_support">IT Support</MenuItem>
                                </Select>
                                {errors.role && <Typography color="error" variant="caption" sx={{ marginLeft: '14px', marginTop: '4px' }}>{errors.role}</Typography>}
                            </FormControl>
                        </Grid> */}

                        {/* Ratings Section */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>Rate the ERP Platform</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography component="legend">Ease of Use & User Interface</Typography>
                                <Rating name="easeOfUseRating" value={formData.easeOfUseRating} onChange={(_event, newValue) => handleRatingChange('easeOfUseRating', newValue)} />
                                {errors.easeOfUseRating && <Typography color="error" variant="caption" display="block">{errors.easeOfUseRating}</Typography>}
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography component="legend">Features & Functionality</Typography>
                                <Rating name="featuresRating" value={formData.featuresRating} onChange={(_event, newValue) => handleRatingChange('featuresRating', newValue)} />
                                {errors.featuresRating && <Typography color="error" variant="caption" display="block">{errors.featuresRating}</Typography>}
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography component="legend">Performance & Speed</Typography>
                                <Rating name="performanceRating" value={formData.performanceRating} onChange={(_event, newValue) => handleRatingChange('performanceRating', newValue)} />
                                {errors.performanceRating && <Typography color="error" variant="caption" display="block">{errors.performanceRating}</Typography>}
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography component="legend">Customer Support & Training</Typography>
                                <Rating name="supportRating" value={formData.supportRating} onChange={(_event, newValue) => handleRatingChange('supportRating', newValue)} />
                                {errors.supportRating && <Typography color="error" variant="caption" display="block">{errors.supportRating}</Typography>}
                            </Box>
                        </Grid>

                        {/* Suggestions Text Area */}
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="What can we improve? Any features you're missing?" name="suggestions" multiline rows={4} value={formData.suggestions} onChange={handleChange} placeholder="Please provide details..." />
                        </Grid>

                        {/* Submit Button */}
                        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant='contained' type="submit" size='small'>
                                Submit ERP Feedback
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default ErpFeedbackForm;

