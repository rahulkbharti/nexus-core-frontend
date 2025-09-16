import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { ReactNode } from "react";

type props = {
    title?: string;
    open?: boolean;
    setOpen?: (value: boolean) => void;
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    form?: ReactNode;
    submitName?: string;
    formik: any;
}

const PopUp = ({ open = false, title = "ADD USER FORM", handleSubmit = (e) => { e.preventDefault(); }, form = <></>, setOpen = (_value: boolean) => { }, submitName = "Submit", formik }: props) => {
    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {form}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" type="submit">{formik.isSubmitting ? "Submitting..." : submitName}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
export default PopUp;