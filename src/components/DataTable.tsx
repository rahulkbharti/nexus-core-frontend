import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Typography,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';

// Define types
export interface Column {
    id: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    width?: string;
    renderCell?: (value: any, row: any) => React.ReactNode;
}

export interface User {
    id: number;
    name: string;
    email: string;
    contact: string;
    age: number;
    country: string;
    status: 'Verified' | 'Rejected' | 'Pending';
}

interface UserTableProps {
    columns: Column[];
    data: User[];
    title?: string;
    searchable?: boolean;
}

// Default columns configuration
export const defaultColumns: Column[] = [
    {
        id: 'name',
        label: 'USER NAME',
        renderCell: (value, row) => (
            <Box>
                <Typography variant="subtitle2">{value}</Typography>
                <Typography variant="body2" color="textSecondary">
                    {row.email}
                </Typography>
            </Box>
        )
    },
    { id: 'contact', label: 'CONTACT' },
    { id: 'age', label: 'AGE', align: 'center', width: '10%' },
    { id: 'country', label: 'COUNTRY' },
    {
        id: 'status',
        label: 'STATUS',
        align: 'center',
        width: '15%',
        renderCell: (value) => {
            const getStatusColor = (status: string) => {
                switch (status) {
                    case 'Verified': return 'success';
                    case 'Rejected': return 'error';
                    case 'Pending': return 'warning';
                    default: return 'default';
                }
            };

            return (
                <Chip
                    label={value}
                    color={getStatusColor(value) as any}
                    size="small"
                />
            );
        }
    },
    {
        id: 'actions',
        label: 'ACTIONS',
        align: 'center',
        width: '15%',
        renderCell: () => (
            <>
                <IconButton size="small" color="primary">
                    <ViewIcon />
                </IconButton>
                <IconButton size="small" color="primary">
                    <EditIcon />
                </IconButton>
                <IconButton size="small" color="error">
                    <DeleteIcon />
                </IconButton>
            </>
        )
    },
];

// Sample data
export const sampleUsers: User[] = [
    {
        id: 102,
        name: 'Ada Evans',
        email: 'jablawpuh@gmail.com',
        contact: '+1 (232) 479-2902',
        age: 32,
        country: 'St. Pierre & Miquelon',
        status: 'Rejected'
    },
    {
        id: 34,
        name: 'Adele McDaniel',
        email: 'li@gmail.com',
        contact: '+1 (227) 665-3977',
        age: 22,
        country: 'Argentina',
        status: 'Verified'
    },
    {
        id: 180,
        name: 'Adele Mills',
        email: 'hogmultep@gmail.com',
        contact: '+1 (303) 494-7324',
        age: 45,
        country: 'Congo-Kinshasa',
        status: 'Verified'
    },
    {
        id: 161,
        name: 'Aiden Fletcher',
        email: 'arhepo@gmail.com',
        contact: '+1 (412) 605-2121',
        age: 42,
        country: 'Kuwait',
        status: 'Rejected'
    },
    {
        id: 15,
        name: 'Albert Wood',
        email: 'hi@gmail.com',
        contact: '+1 (419) 627-2135',
        age: 39,
        country: 'Caribbean Netherlands',
        status: 'Rejected'
    },
    {
        id: 134,
        name: 'Alice Bishop',
        email: 'kisof@gmail.com',
        contact: '+1 (657) 598-8679',
        age: 55,
        country: 'Senegal',
        status: 'Rejected'
    },
    {
        id: 176,
        name: 'Alma Gibbs',
        email: 'lilegi@gmail.com',
        contact: '+1 (326) 217-8189',
        age: 40,
        country: 'Morocco',
        status: 'Rejected'
    },
    {
        id: 162,
        name: 'Alvin Price',
        email: 'awa@gmail.com',
        contact: '+1 (517) 445-5660',
        age: 65,
        country: 'Austria',
        status: 'Pending'
    },
    {
        id: 65,
        name: 'Amanda Gibbs',
        email: 'ru@gmail.com',
        contact: '+1 (331) 350-1168',
        age: 61,
        country: 'Togo',
        status: 'Verified'
    }
];

const UserTable: React.FC<UserTableProps> = ({
    columns,
    data,
    title = "User Records",
    searchable = true
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredData = data.filter(item =>
        columns.some(column => {
            if (column.id === 'actions') return false;
            const value = item[column.id as keyof User];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
    );

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {title}
            </Typography>

            {searchable && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        Search {filteredData.length} records...
                    </Typography>
                    <TextField
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        size="small"
                    />
                </Box>
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="user records table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || 'left'}
                                        sx={{ width: column.width, fontWeight: 'bold' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row) => (
                                <TableRow key={row.id}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align || 'left'}
                                            sx={{ width: column.width }}
                                        >
                                            {column.renderCell
                                                ? column.renderCell(row[column.id as keyof User], row)
                                                : row[column.id as keyof User]
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default UserTable;