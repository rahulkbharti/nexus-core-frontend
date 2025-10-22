import React from 'react';
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
import { useMutation } from '@tanstack/react-query';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import api from '../../apis/api';

// Define the structure for our ERP feedback form data
interface ErpFeedbackState {
    easeOfUseRating: number; // Changed to number, as we'll use 0 as the "unselected" state
    featuresRating: number;
    performanceRating: number;
    supportRating: number;
    suggestions: string;
}

// Define the Validation Schema using Yup
const FeedbackSchema = Yup.object().shape({
    easeOfUseRating: Yup.number()
        .min(1, 'Please select a rating (1-5)'),
    featuresRating: Yup.number()
        .min(1, 'Please select a rating (1-5)'),
    performanceRating: Yup.number()
        .min(1, 'Please select a rating (1-5)'),
    supportRating: Yup.number()
        .min(1, 'Please select a rating (1-5)')
});


const ErpFeedbackForm: React.FC = () => {

    // Get isSuccess state to show the thank you message
    const { mutate: submitErpFeedback, isSuccess } = useMutation({
        mutationKey: ['erpFeedback'],
        mutationFn: async (feedbackData: ErpFeedbackState) => {
            console.log("Submitting ERP Feedback:", feedbackData);
            const responce = await api.post("/feedback", feedbackData);
            if (responce.status >= 200 && responce.status < 300) {
                return Promise.resolve();
            }
            return new Promise(resolve => setTimeout(resolve, 1000));
        },
        onSuccess: () => {
            console.log("ERP Feedback submitted successfully");
        },
        onError: (error) => {
            console.error("Error submitting feedback:", error);
        }
    })

    // If submitted, show a thank you message
    if (isSuccess) { // Changed from `if (false)`
        return (
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Thank You!
                    </Typography>
                    <Typography variant="body1">
                        Your feedback has been received. We appreciate you taking the time to help us improve.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ padding: { xs: 2, sm: 4 }, marginTop: 4, borderRadius: '12px' }}>
                <Box>
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                        ERP Platform Feedback
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary" paragraph>
                        Your input is vital for improving our ERP system for you and other libraries.
                    </Typography>

                    <Formik
                        initialValues={{
                            easeOfUseRating: 0,
                            featuresRating: 0,
                            performanceRating: 0,
                            supportRating: 0,
                            suggestions: ""
                        }}
                        validationSchema={FeedbackSchema} // Add the validation schema
                        onSubmit={(values, { setSubmitting }) => {
                            console.log("Form Submitted with values:", values);
                            submitErpFeedback(values); // Call the mutation
                            setSubmitting(false);
                        }}
                    >
                        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
                            <Form onSubmit={handleSubmit}>
                                <Grid container spacing={3} sx={{ marginTop: 2 }}>

                                    {/* Ratings Section */}
                                    <Grid size={{ xs: 12, md: 6 }}> {/* FIX: Was <Grid size=...> */}
                                        <Box>
                                            <Typography component="legend">Ease of Use & User Interface</Typography>
                                            <Rating
                                                name="easeOfUseRating"
                                                value={values.easeOfUseRating}
                                                // If user deselects, it becomes null. We set it to 0 to trigger validation.
                                                onChange={(_, value) => setFieldValue('easeOfUseRating', value ?? 0)}
                                            />
                                            {/* Show Error Message */}
                                            {errors.easeOfUseRating && touched.easeOfUseRating && (
                                                <Typography variant="caption" color="error">
                                                    {errors.easeOfUseRating}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}> {/* FIX: Was <Grid size=...> */}
                                        <Box>
                                            <Typography component="legend">Features & Functionality</Typography>
                                            <Rating
                                                name="featuresRating"
                                                value={values.featuresRating}
                                                onChange={(_, value) => setFieldValue('featuresRating', value ?? 0)}
                                            />
                                            {/* Show Error Message */}
                                            {errors.featuresRating && touched.featuresRating && (
                                                <Typography variant="caption" color="error">
                                                    {errors.featuresRating}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}> {/* FIX: Was <Grid size=...> */}
                                        <Box>
                                            <Typography component="legend">Performance & Speed</Typography>
                                            <Rating
                                                name="performanceRating"
                                                value={values.performanceRating}
                                                onChange={(_, value) => setFieldValue('performanceRating', value ?? 0)}
                                            />
                                            {/* Show Error Message */}
                                            {errors.performanceRating && touched.performanceRating && (
                                                <Typography variant="caption" color="error">
                                                    {errors.performanceRating}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}> {/* FIX: Was <Grid size=...> */}
                                        <Box>
                                            <Typography component="legend">Customer Support & Training</Typography>
                                            <Rating
                                                name="supportRating"
                                                value={values.supportRating}
                                                onChange={(_, value) => setFieldValue('supportRating', value ?? 0)}
                                            />
                                            {/* Show Error Message */}
                                            {errors.supportRating && touched.supportRating && (
                                                <Typography variant="caption" color="error">
                                                    {errors.supportRating}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* Suggestions Text Area */}
                                    <Grid size={{ xs: 12 }}> {/* FIX: Was <Grid size=...> */}
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label="What can we improve? Any features you're missing?"
                                            name="suggestions"
                                            multiline
                                            rows={4}
                                            placeholder="Please provide details..."
                                            value={values.suggestions}
                                            onChange={handleChange}
                                            // Show errors from Formik
                                            error={touched.suggestions && Boolean(errors.suggestions)}
                                            helperText={touched.suggestions && errors.suggestions}
                                        />
                                    </Grid>

                                    {/* Submit Button */}
                                    <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}> {/* FIX: Was <Grid size=...> */}
                                        <Button
                                            variant='contained'
                                            type="submit"
                                            size='small'
                                            disabled={isSubmitting} // Disable button while submitting
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit ERP Feedback'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Paper>
        </Container>
    );
};

export default ErpFeedbackForm;