import { Formik } from "formik";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


interface FormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: { name: string };
    onSubmit: (values: any) => void;
    id?: number | null;
    children?: React.ReactNode;

}


const GenericForm: React.FC<FormProps> = ({ children, open, setOpen, id, initialValue, onSubmit = () => { console.log("Please Pass the onSubmit Function") } }) => {
    const handelSubmitForm = (values: any, actions: any) => {
        if (id) {
            onSubmit({ method: "PUT", data: values, id });
        } else {
            onSubmit({ method: "POST", data: values });
        }
        actions.setSubmitting(false);
        setOpen(false);
    }
    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <Formik initialValues={initialValue} onSubmit={handelSubmitForm}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>Form {id}</DialogTitle>
                        <DialogContent>
                            {children}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button variant="contained" type="submit">{id ? "Update" : "Create"}</Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    )
};
export default GenericForm;