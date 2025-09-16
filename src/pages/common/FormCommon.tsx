import { Formik, Form } from 'formik';
import {
    Grid,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button,
} from '@mui/material';
import FormInput from '../common/FormInput';
import { memo } from 'react';

interface UserFormProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    initialValues: {
        [key: string]: any;
    };
    validationSchema?: any;
    onSubmit: (values: any, formikHelpers?: any) => void | Promise<any>;
    title: string;
}

const FormCommon: React.FC<UserFormProps> = ({ open, setOpen, initialValues, validationSchema, onSubmit, title }) => {
    const name = Object.keys(initialValues);
    const label = name.map((n) => n.charAt(0).toUpperCase() + n.slice(1));

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
        >
            {({ isSubmitting, resetForm }) => (
                <Dialog open={open} onClose={() => {
                    resetForm();
                    setOpen(false);
                }} sx={{ width: 'sm', }} maxWidth="sm" fullWidth>
                    <Form>
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                {name.map((n, index) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={n}>
                                        <FormInput
                                            name={n}
                                            label={label[index]}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button variant="contained" type="submit">{isSubmitting ? "Submitting..." : title}</Button>
                        </DialogActions>
                    </Form>

                </Dialog>
            )}
        </Formik>
    );
};

export default memo(FormCommon);