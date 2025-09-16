import React from 'react';
import { useField } from 'formik';

import {
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
} from '@mui/material';

// Create a custom FormOption component that automatically connects to Formik
type FormOptionProps = {
    name: string;
    label: string;
    type?: string;
    [key: string]: any;
};

const FormOption: React.FC<FormOptionProps> = ({ children, name, label, type = 'text', ...props }) => {
    const [field, meta] = useField(name);
    // console.log("Rendering FormOption", { field, meta });
    return (
        <FormControl size="small" sx={{ minWidth: 120, marginY: 2 }} fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                label={label}
                error={meta.touched && Boolean(meta.error)}
                fullWidth
                variant="outlined"
                {...props}
            >
                {children}
            </Select>
            {meta.touched && meta.error && (
                <FormHelperText error>{meta.error}</FormHelperText>
            )}
        </FormControl>
    );
};

export default FormOption;
