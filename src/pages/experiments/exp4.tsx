import { Formik } from "formik";
import FormInput from "../common/FormInput";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useState, useImperativeHandle, forwardRef, useCallback } from "react";

// Define the shape of the data the form will handle
interface FormValues {
    name: string;
    // Add other fields here if necessary
}

// Define the props for our GenericForm component
interface FormProps {
    children: React.ReactNode;
    onSubmit: (values: any) => void;
    // Provide a default structure for when creating a new item
    initialValuesForCreate: FormValues;
}

// Define the methods that the parent component can call via the ref
export interface FormHandles {
    open: (initialData?: FormValues, id?: number | null) => void;
}

const GenericForm = forwardRef<FormHandles, FormProps>((
    { children, onSubmit, initialValuesForCreate },
    ref
) => {
    // Internal state is now managed by the form itself
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [initialValues, setInitialValues] = useState<FormValues>(initialValuesForCreate);

    const handleClose = () => setOpen(false);

    // This is the function that the parent will call to open the dialog
    const handleOpen = useCallback((initialData?: FormValues, currentId?: number | null) => {
        setId(currentId || null);
        // If data is passed, it's an edit. Otherwise, use the create defaults.
        setInitialValues(initialData || initialValuesForCreate);
        setOpen(true);
    }, [initialValuesForCreate]);

    // Expose the `handleOpen` function to the parent component via the ref
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));

    const handleSubmitForm = (values: FormValues, actions: any) => {
        if (id) {
            // It's an update
            onSubmit({ method: "PUT", data: values, id });
        } else {
            // It's a new creation
            onSubmit({ method: "POST", data: values });
        }

        actions.setSubmitting(false);
        handleClose(); // Close the form on submit
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            {/* enableReinitialize is crucial for Formik to update when initialValues change */}
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmitForm}
                enableReinitialize={true}
            >
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>{id ? `Edit Item #${id}` : 'Add New Item'}</DialogTitle>
                        <DialogContent>{children}</DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Submit</Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
});

export default GenericForm;