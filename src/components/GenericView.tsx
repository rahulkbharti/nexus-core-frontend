import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { type ReactNode } from "react";

interface ViewProps {
    open: boolean;
    id: number;
    [key: string]: unknown;
}

interface GenericViewProps {
    title?: string;
    children?: ReactNode;
    view: ViewProps;
    setView: any;
}

const GenericView: React.FC<GenericViewProps> = ({ title = "View", children, view = { id: 0, open: true }, setView }) => {
    // console.log(view)
    return (
        <Dialog open={view.open} onClose={() => { setView({ id: view?.id, open: false }); }} maxWidth="md" fullWidth>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => setView({ id: view?.id, open: false })}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GenericView;