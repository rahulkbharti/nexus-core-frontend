import { Typography } from "@mui/material";
import { type ReactNode } from "react";

type PropType = {
    title: string;
    icon: ReactNode;
};

const PageTitle = ({ title, icon }: PropType) => {
    return (
        <Typography variant="h4" component="h1" gutterBottom sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            mb: 3
        }}>
            {icon}
            {title}
        </Typography>
    );
}

export default PageTitle;