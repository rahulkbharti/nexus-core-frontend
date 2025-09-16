import React from 'react';
import { useField } from 'formik';

import {
    TextField,
} from '@mui/material';

// Create a custom FormInput component that automatically connects to Formik
type FormInputProps = {
    name: string;
    label: string;
    type?: string;
    [key: string]: any;
};

const FormInput: React.FC<FormInputProps> = ({ name, label, type = 'text', ...props }) => {
    const [field, meta] = useField(name);

    return (
        <TextField
            {...field}
            {...props}
            size='small'
            label={label}
            type={type}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    );
};

export default FormInput;
