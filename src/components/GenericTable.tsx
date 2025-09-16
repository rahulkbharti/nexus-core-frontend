import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TableSortLabel
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';

// Define types
export interface GenericColumn {
    id: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    width?: string;
    renderCell?: (value: any, row: any) => React.ReactNode;
}

interface GenericTableProps {
    columns: GenericColumn[];
    data: any[];
    title?: string;
    searchable?: boolean;
    actions?: boolean;
    keyField: string;
    handleSort: any;
    handleEdit?: any
}

const GenericTable: React.FC<GenericTableProps> = ({
    columns,
    data: filteredData,
    actions = true,
    keyField,
    handleSort = () => { },
    handleEdit = () => { }
}) => {
    // const [searchTerm, setSearchTerm] = useState('');

    // Filter data based on search term across all columns
    // const filteredData = data.filter(row =>
    //     columns.some(column => {
    //         const value = row[column.id];
    //         return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    //     })
    // );

    // Render cell content based on column configuration
    const renderCellContent = (row: any, column: GenericColumn) => {
        const value = row[column.id];

        if (column.renderCell) {
            return column.renderCell(value, row);
        }

        return value;
    };

    return (
        <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer sx={{ minHeight: 400 }}>
                <Table size='small' aria-label="generic table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    sx={{ width: column.width, fontWeight: 'bold' }}
                                >
                                    <TableSortLabel
                                        // active={orderBy === column.id}
                                        // direction={orderBy === column.id ? order : "asc"}
                                        onClick={() => handleSort(column.id)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                    {/* {column.label} */}
                                </TableCell>
                            ))}
                            {actions && (
                                <TableCell align="center" sx={{ width: '15%', fontWeight: 'bold' }}>
                                    ACTIONS
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(filteredData || []).map((row) => (
                            <TableRow key={row[keyField]}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || 'left'}
                                        sx={{ width: column.width }}
                                    >
                                        {renderCellContent(row, column)}
                                    </TableCell>
                                ))}
                                {actions && (
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => {
                                                const { id, ...rowWithoutId } = row;
                                                handleEdit("VIEW", rowWithoutId, id);
                                            }}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => {
                                                const { id, ...rowWithoutId } = row;
                                                handleEdit("EDIT", rowWithoutId, id);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                                const { id, ...rowWithoutId } = row;
                                                handleEdit("DELETE", rowWithoutId, id);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {(!filteredData || filteredData.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" sx={{ height: '100%' }}>
                                    No Data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default GenericTable;