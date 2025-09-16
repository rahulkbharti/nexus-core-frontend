import { Formik } from "formik";
import FormInput from "../common/FormInput";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useState, useCallback } from "react";

interface FormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: { name: string };
    onSubmit: (values: any) => void;
    id?: number | null;
    children?: React.ReactNode;

}


const FORM: React.FC<FormProps> = ({ children, open, setOpen, id, initialValue, onSubmit = () => { console.log("Please Pass the onSubmit Function") } }) => {
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

const Exp3: React.FC = () => {
    const [id, setId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: "rahu" });
    const [open, setOpen] = useState(false);

    const handleForm = useCallback((formData?: any, id?: number | null) => {
        setId(id || null);
        if (formData) {
            setForm(formData);
        } else {
            setForm({ name: "" });
        }
        setOpen(true);
    }, []);


    return (
        <div>
            Experiment 3
            <Button onClick={() => handleForm({ name: "Edit" }, 2)}>Edit </Button>
            <Button onClick={() => handleForm()}>Add</Button>
            <FORM open={open} setOpen={setOpen} id={id} initialValue={form} onSubmit={({ method, data, id }) => { console.log({ method, data, id }) }}>
                <FormInput name="name" label="b" />
            </FORM>
        </div>
    );
};

export default Exp3;
