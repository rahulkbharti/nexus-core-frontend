import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    IconButton,
    Chip,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Fab,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Chair as ChairIcon,
    MeetingRoom as HallIcon,
    EventSeat as SeatIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

// Define types
interface Seat {
    id: string;
    row: string;
    number: number;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
    type?: 'standard' | 'premium' | 'accessible';
    description?: string;
}

interface Hall {
    id: string;
    name: string;
    description?: string;
    seats: Seat[];
}

// Initial sample data
const initialHalls: Hall[] = [
    {
        id: 'hall-1',
        name: 'Study Hall 1',
        description: 'Main study area with individual seating',
        seats: [
            { id: '1-A1', row: 'A', number: 1, status: 'available', type: 'standard', description: 'Window seat' },
            { id: '1-A2', row: 'A', number: 2, status: 'available', type: 'standard', description: 'Near power outlet' },
            { id: '1-A3', row: 'A', number: 3, status: 'occupied', type: 'standard', description: '' },
            { id: '1-A4', row: 'A', number: 4, status: 'available', type: 'standard', description: '' },
            { id: '1-A5', row: 'A', number: 5, status: 'reserved', type: 'standard', description: 'Reserved for group study' },
            { id: '1-B1', row: 'B', number: 1, status: 'available', type: 'premium', description: 'Extra legroom' },
            { id: '1-B2', row: 'B', number: 2, status: 'occupied', type: 'premium', description: 'Monitor included' },
            { id: '1-B3', row: 'B', number: 3, status: 'maintenance', type: 'premium', description: 'Under repair' },
            { id: '1-B4', row: 'B', number: 4, status: 'available', type: 'premium', description: '' },
            { id: '1-B5', row: 'B', number: 5, status: 'available', type: 'premium', description: '' },
            { id: '1-C1', row: 'C', number: 1, status: 'available', type: 'accessible', description: 'Wheelchair accessible' },
            { id: '1-C2', row: 'C', number: 2, status: 'occupied', type: 'accessible', description: 'Wheelchair accessible' },
            { id: '1-C3', row: 'C', number: 3, status: 'available', type: 'accessible', description: 'Wheelchair accessible' },
            { id: '1-C4', row: 'C', number: 4, status: 'reserved', type: 'accessible', description: 'Reserved for special needs' },
            { id: '1-C5', row: 'C', number: 5, status: 'available', type: 'accessible', description: 'Wheelchair accessible' },
        ]
    },
    {
        id: 'hall-2',
        name: 'Quiet Study Hall',
        description: 'Silent study area with strict noise rules',
        seats: [
            { id: '2-A1', row: 'A', number: 1, status: 'available', type: 'standard', description: '' },
            { id: '2-A2', row: 'A', number: 2, status: 'occupied', type: 'standard', description: '' },
            { id: '2-A3', row: 'A', number: 3, status: 'available', type: 'standard', description: '' },
            { id: '2-A4', row: 'A', number: 4, status: 'available', type: 'standard', description: '' },
            { id: '2-A5', row: 'A', number: 5, status: 'reserved', type: 'standard', description: 'Reserved for exam preparation' },
            { id: '2-B1', row: 'B', number: 1, status: 'available', type: 'premium', description: 'Double monitor setup' },
            { id: '2-B2', row: 'B', number: 2, status: 'occupied', type: 'premium', description: '' },
            { id: '2-B3', row: 'B', number: 3, status: 'available', type: 'premium', description: '' },
            { id: '2-B4', row: 'B', number: 4, status: 'maintenance', type: 'premium', description: 'Hardware upgrade in progress' },
            { id: '2-B5', row: 'B', number: 5, status: 'available', type: 'premium', description: '' },
        ]
    }
];

const SeatManagementSystem: React.FC = () => {
    const [halls, setHalls] = useState<Hall[]>(initialHalls);
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
    const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [hallDialogOpen, setHallDialogOpen] = useState(false);
    const [seatDialogOpen, setSeatDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [editingHall, setEditingHall] = useState<Hall | null>(null);
    const [editingSeat, setEditingSeat] = useState<Seat | null>(null);
    const [newHall, setNewHall] = useState<Partial<Hall>>({
        name: '',
        description: '',
        seats: []
    });
    const [newSeat, setNewSeat] = useState<Partial<Seat>>({
        row: 'A',
        number: 1,
        status: 'available',
        type: 'standard',
        description: ''
    });

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSeatClick = (seat: Seat, hall: Hall) => {
        setSelectedSeat(seat);
        setSelectedHall(hall);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedSeat(null);
        setSelectedHall(null);
    };

    const handleReserveSeat = () => {
        if (selectedSeat && selectedHall) {
            const updatedHalls = halls.map(hall => ({
                ...hall,
                seats: hall.id === selectedHall.id
                    ? hall.seats.map(seat =>
                        seat.id === selectedSeat.id ? { ...seat, status: 'reserved' } : seat
                    )
                    : hall.seats
            }));
            setHalls(updatedHalls);
            setDialogOpen(false);
            showSnackbar(`Seat ${selectedSeat.row}${selectedSeat.number} reserved successfully`);
        }
    };

    const handleOccupySeat = () => {
        if (selectedSeat && selectedHall) {
            const updatedHalls = halls.map(hall => ({
                ...hall,
                seats: hall.id === selectedHall.id
                    ? hall.seats.map(seat =>
                        seat.id === selectedSeat.id ? { ...seat, status: 'occupied' } : seat
                    )
                    : hall.seats
            }));
            setHalls(updatedHalls);
            setDialogOpen(false);
            showSnackbar(`Seat ${selectedSeat.row}${selectedSeat.number} marked as occupied`);
        }
    };

    const handleFreeSeat = () => {
        if (selectedSeat && selectedHall) {
            const updatedHalls = halls.map(hall => ({
                ...hall,
                seats: hall.id === selectedHall.id
                    ? hall.seats.map(seat =>
                        seat.id === selectedSeat.id ? { ...seat, status: 'available' } : seat
                    )
                    : hall.seats
            }));
            setHalls(updatedHalls);
            setDialogOpen(false);
            showSnackbar(`Seat ${selectedSeat.row}${selectedSeat.number} is now available`);
        }
    };

    const handleOpenHallDialog = (hall?: Hall) => {
        if (hall) {
            setEditingHall(hall);
            setNewHall({ ...hall });
        } else {
            setEditingHall(null);
            setNewHall({
                name: '',
                description: '',
                seats: []
            });
        }
        setHallDialogOpen(true);
    };

    const handleSaveHall = () => {
        if (!newHall.name) {
            showSnackbar('Hall name is required', 'error');
            return;
        }

        if (editingHall) {
            // Update existing hall
            const updatedHalls = halls.map(hall =>
                hall.id === editingHall.id
                    ? { ...hall, name: newHall.name || '', description: newHall.description || '' }
                    : hall
            );
            setHalls(updatedHalls);
            showSnackbar('Hall updated successfully');
        } else {
            // Add new hall
            const newHallId = `hall-${Date.now()}`;
            const hallToAdd: Hall = {
                id: newHallId,
                name: newHall.name || 'New Hall',
                description: newHall.description || '',
                seats: []
            };
            setHalls([...halls, hallToAdd]);
            showSnackbar('Hall added successfully');
        }
        setHallDialogOpen(false);
    };

    const handleOpenSeatDialog = (hall: Hall, seat?: Seat) => {
        setSelectedHall(hall);
        if (seat) {
            setEditingSeat(seat);
            setNewSeat({ ...seat });
        } else {
            setEditingSeat(null);
            // Find the next available seat number
            const lastSeat = hall.seats[hall.seats.length - 1];
            const nextNumber = lastSeat ? lastSeat.number + 1 : 1;

            setNewSeat({
                row: 'A',
                number: nextNumber,
                status: 'available',
                type: 'standard',
                description: ''
            });
        }
        setSeatDialogOpen(true);
    };

    const handleSaveSeat = () => {
        if (!selectedHall || !newSeat.row || !newSeat.number) {
            showSnackbar('Seat information is incomplete', 'error');
            return;
        }

        const seatId = `${selectedHall.id}-${newSeat.row}${newSeat.number}`;

        if (editingSeat) {
            // Update existing seat
            const updatedHalls = halls.map(hall =>
                hall.id === selectedHall.id
                    ? {
                        ...hall,
                        seats: hall.seats.map(seat =>
                            seat.id === editingSeat.id
                                ? {
                                    ...seat,
                                    row: newSeat.row || 'A',
                                    number: newSeat.number || 1,
                                    status: newSeat.status || 'available',
                                    type: newSeat.type || 'standard',
                                    description: newSeat.description || ''
                                }
                                : seat
                        )
                    }
                    : hall
            );
            setHalls(updatedHalls);
            showSnackbar('Seat updated successfully');
        } else {
            // Add new seat
            const seatToAdd: Seat = {
                id: seatId,
                row: newSeat.row || 'A',
                number: newSeat.number || 1,
                status: newSeat.status || 'available',
                type: newSeat.type || 'standard',
                description: newSeat.description || ''
            };

            const updatedHalls = halls.map(hall =>
                hall.id === selectedHall.id
                    ? { ...hall, seats: [...hall.seats, seatToAdd] }
                    : hall
            );
            setHalls(updatedHalls);
            showSnackbar('Seat added successfully');
        }
        setSeatDialogOpen(false);
    };

    const handleOpenDeleteDialog = (type: 'hall' | 'seat', hall?: Hall, seat?: Seat) => {
        if (type === 'hall' && hall) {
            setSelectedHall(hall);
        } else if (type === 'seat' && hall && seat) {
            setSelectedHall(hall);
            setSelectedSeat(seat);
        }
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedHall && !selectedSeat) {
            // Delete hall
            const updatedHalls = halls.filter(hall => hall.id !== selectedHall.id);
            setHalls(updatedHalls);
            showSnackbar('Hall deleted successfully');
        } else if (selectedHall && selectedSeat) {
            // Delete seat
            const updatedHalls = halls.map(hall =>
                hall.id === selectedHall.id
                    ? { ...hall, seats: hall.seats.filter(seat => seat.id !== selectedSeat.id) }
                    : hall
            );
            setHalls(updatedHalls);
            showSnackbar('Seat deleted successfully');
        }
        setDeleteDialogOpen(false);
        setSelectedSeat(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'success';
            case 'occupied': return 'error';
            case 'reserved': return 'warning';
            case 'maintenance': return 'default';
            default: return 'default';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'premium': return <ChairIcon color="primary" />;
            case 'accessible': return <PersonIcon />;
            default: return <SeatIcon />;
        }
    };

    const getStatusActions = (status: string) => {
        switch (status) {
            case 'available':
                return <Button onClick={handleReserveSeat} variant="contained" color="primary">Reserve This Seat</Button>;
            case 'reserved':
                return <Button onClick={handleOccupySeat} variant="contained" color="primary">Mark as Occupied</Button>;
            case 'occupied':
                return <Button onClick={handleFreeSeat} variant="contained" color="success">Mark as Available</Button>;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                mb: 3
            }}>
                <ChairIcon sx={{ mr: 2, fontSize: '2.5rem' }} />
                Library Seat Management
            </Typography>

            <Grid container spacing={3}>
                {halls.map(hall => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={hall.id}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, position: 'relative' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'primary.main',
                                    mb: 1
                                }}>
                                    <HallIcon sx={{ mr: 1 }} />
                                    {hall.name}
                                </Typography>
                                <Box>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpenHallDialog(hall)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleOpenDeleteDialog('hall', hall)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            {hall.description && (
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    {hall.description}
                                </Typography>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2">
                                    Seats: {hall.seats.length}
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenSeatDialog(hall)}
                                >
                                    Add Seat
                                </Button>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Grid container spacing={1}>
                                    {hall.seats.sort((a, b) => a.row.localeCompare(b.row)).map(seat => (
                                        <Grid size={{ xs: 4, sm: 3, md: 2 }} key={seat.id}>
                                            <IconButton
                                                onClick={() => handleSeatClick(seat, hall)}
                                                sx={{
                                                    p: 0.5,
                                                    border: 1,
                                                    borderColor: 'grey.300',
                                                    borderRadius: 1,
                                                    backgroundColor: seat.status === 'available' ? 'success.light' :
                                                        seat.status === 'occupied' ? 'error.light' :
                                                            seat.status === 'reserved' ? 'warning.light' :
                                                                'grey.200',
                                                    '&:hover': {
                                                        backgroundColor: seat.status === 'available' ? 'success.main' :
                                                            seat.status === 'occupied' ? 'error.main' :
                                                                seat.status === 'reserved' ? 'warning.main' :
                                                                    'grey.300',
                                                    },
                                                    position: 'relative'
                                                }}
                                                disabled={seat.status === 'maintenance'}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    position: "relative"
                                                }}>
                                                    {getTypeIcon(seat.type || 'standard')}
                                                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'common.black' }}>
                                                        {seat.row}{seat.number}
                                                    </Typography>

                                                </Box>
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: -8,
                                                    right: -8,
                                                    backgroundColor: 'paper',
                                                    width: 20,
                                                    height: 20,
                                                    '&:hover': { backgroundColor: 'grey' }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenSeatDialog(hall, seat);
                                                }}
                                            >
                                                <EditIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                <Chip icon={<SeatIcon color="success" />} label="Available" variant="outlined" size="small" />
                                <Chip icon={<SeatIcon color="error" />} label="Occupied" variant="outlined" size="small" />
                                <Chip icon={<SeatIcon color="warning" />} label="Reserved" variant="outlined" size="small" />
                                <Chip icon={<SeatIcon color="default" />} label="Maintenance" variant="outlined" size="small" />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Seat Detail Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Seat Information: {selectedSeat?.row}{selectedSeat?.number}
                    {selectedHall && ` (${selectedHall.name})`}
                </DialogTitle>
                <DialogContent>
                    {selectedSeat && (
                        <Box sx={{ mt: 1 }}>
                            <Typography><strong>Status:</strong> {selectedSeat.status}</Typography>
                            <Typography><strong>Type:</strong> {selectedSeat.type}</Typography>
                            <Typography><strong>Seat ID:</strong> {selectedSeat.id}</Typography>
                            {selectedSeat.description && (
                                <Typography><strong>Description:</strong> {selectedSeat.description}</Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                    {selectedSeat && getStatusActions(selectedSeat.status)}
                    {selectedSeat && (
                        <Button
                            color="error"
                            onClick={() => handleOpenDeleteDialog('seat', selectedHall, selectedSeat)}
                        >
                            Delete Seat
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Hall Edit/Create Dialog */}
            <Dialog open={hallDialogOpen} onClose={() => setHallDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingHall ? 'Edit Hall' : 'Create New Hall'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Hall Name"
                            value={newHall.name}
                            onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={newHall.description}
                            onChange={(e) => setNewHall({ ...newHall, description: e.target.value })}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHallDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveHall} variant="contained">
                        {editingHall ? 'Update Hall' : 'Create Hall'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Seat Edit/Create Dialog */}
            <Dialog open={seatDialogOpen} onClose={() => setSeatDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingSeat ? 'Edit Seat' : 'Add New Seat'}
                    {selectedHall && ` (${selectedHall.name})`}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            select
                            fullWidth
                            label="Row"
                            value={newSeat.row}
                            onChange={(e) => setNewSeat({ ...newSeat, row: e.target.value })}
                            margin="normal"
                        >
                            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((row) => (
                                <MenuItem key={row} value={row}>
                                    Row {row}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            type="number"
                            label="Seat Number"
                            value={newSeat.number}
                            onChange={(e) => setNewSeat({ ...newSeat, number: parseInt(e.target.value) })}
                            margin="normal"
                        />
                        <TextField
                            select
                            fullWidth
                            label="Status"
                            value={newSeat.status}
                            onChange={(e) => setNewSeat({ ...newSeat, status: e.target.value as any })}
                            margin="normal"
                        >
                            <MenuItem value="available">Available</MenuItem>
                            <MenuItem value="occupied">Occupied</MenuItem>
                            <MenuItem value="reserved">Reserved</MenuItem>
                            <MenuItem value="maintenance">Maintenance</MenuItem>
                        </TextField>
                        <TextField
                            select
                            fullWidth
                            label="Seat Type"
                            value={newSeat.type}
                            onChange={(e) => setNewSeat({ ...newSeat, type: e.target.value as any })}
                            margin="normal"
                        >
                            <MenuItem value="standard">Standard</MenuItem>
                            <MenuItem value="premium">Premium</MenuItem>
                            <MenuItem value="accessible">Accessible</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Description"
                            value={newSeat.description}
                            onChange={(e) => setNewSeat({ ...newSeat, description: e.target.value })}
                            margin="normal"
                            multiline
                            rows={2}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSeatDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveSeat} variant="contained">
                        {editingSeat ? 'Update Seat' : 'Add Seat'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedSeat
                            ? `Are you sure you want to delete seat ${selectedSeat.row}${selectedSeat.number}?`
                            : `Are you sure you want to delete hall "${selectedHall?.name}"? This will also delete all seats in this hall.`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => handleOpenHallDialog()}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default SeatManagementSystem;