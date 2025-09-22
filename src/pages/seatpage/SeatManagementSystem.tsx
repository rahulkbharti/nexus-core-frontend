import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    IconButton,
    Chip,
    Divider,
    Fab,
    LinearProgress,
    MenuItem,
} from '@mui/material';
import {
    Chair as ChairIcon,
    MeetingRoom as HallIcon,
    EventSeat as SeatIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../apis/api';

import FormInput from '../common/FormInput';
import GenericForm from '../../components/GenericForm';
import FormOption from '../common/FormOption';

const SeatManagementSystem: React.FC = () => {
    const queryClient = useQueryClient();
    const [hallId, setHallId] = useState<number | null>(null);
    const [openHallForm, setOpenHallForm] = useState(false);
    const [hallForm, setHallForm] = useState({ name: 'Hall2', description: 'Sample description', totalCapacity: 0 });
    // Seat Options
    const [seatId, setSeatId] = useState<number | null>(null);
    const [openSeatForm, setOpenSeatForm] = useState(false);
    const [seatForm, setSeatForm] = useState({ seatNumber: 'A1', seatType: 'STANDARD', status: 'AVAILABLE' });

    // All Query Seat + Halls
    const { data: halls, isLoading, isFetching } = useQuery({
        queryKey: ['halls'],
        queryFn: async () => {
            const responce = await api.get('/halls');
            return (responce.data as { halls: any[] })?.halls ?? [];
        }
    })

    //Form Handling
    const { mutate: hallformMutate } = useMutation({
        mutationFn: async ({ method, data, id }: { method: "POST" | "PUT" | "DELETE"; data: any, id: number }) => {
            // console.log("Method", method, "data", data, "id", id);
            // return;
            if (method === 'POST') {
                const responce = await api.post('/halls', { ...data });
                return responce.data;
            } else if (method === 'PUT') {
                const responce = await api.put(`/halls/${id}`, { ...data });
                return responce.data;
            } else if (method === 'DELETE') {
                const responce = await api.delete(`/halls/${id}`);
                return responce.data;
            }
            return { message: "Provide right method" };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['halls'] });
        }
    })
    // Seat Form Handling
    const { mutate: seatformMutate } = useMutation({
        mutationFn: async ({ method, data, id }: { method: "POST" | "PUT" | "DELETE"; data: any, id: number }) => {
            // console.log("Method", method, "data", data, "id", id, "hallId", hallId);
            // return;
            if (method === 'POST') {
                const responce = await api.post(`/halls/${hallId}/seats`, data);
                return responce.data;
            } else if (method === 'PUT') {
                const responce = await api.put(`/halls/${hallId}/seats/${id}`, data);
                return responce.data;
            } else if (method === 'DELETE') {
                const responce = await api.delete(`/halls/${hallId}/seats/${id}`);
                return responce.data;
            }
            return { message: "Provide right method" };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['halls'] })

        }
    });

    const handleHallForm = (values: any) => {
        // console.log("hall form submitted", values)
        hallformMutate(values);
    }

    const handleSeatForm = (values: any) => {
        // console.log("seat form submitted", values)
        seatformMutate(values);
    }

    // console.log(halls)
    return (
        <Box>
            {(isLoading || isFetching) && <LinearProgress sx={{ mb: 1 }} />}
            {/* Hall Form */}
            <GenericForm open={openHallForm} setOpen={setOpenHallForm} initialValue={hallForm} onSubmit={handleHallForm} id={hallId}>
                <FormInput name="name" label="Name" type="text" required />
                <FormInput name="description" label="Description" type="text" required />
                <FormInput name="totalCapacity" label="Total Capacity" type="number" required />
            </GenericForm>

            {/* Seat Form */}
            <GenericForm open={openSeatForm} setOpen={setOpenSeatForm} initialValue={seatForm} onSubmit={handleSeatForm} id={seatId}>
                <FormInput name="seatNumber" label="Seat Number" type="text" required />
                <FormOption name="seatType" label="Seat Type" required>
                    <MenuItem value="STANDARD">STANDARD</MenuItem>
                </FormOption>
                <FormOption name="status" label="Status" required>
                    <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
                    <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
                    <MenuItem value="RESERVED">RESERVED</MenuItem>
                </FormOption>
            </GenericForm>

            <Grid container spacing={3}>
                {halls && halls.sort((a, b) => a.seats.length > b.seats.length ? -1 : 1).map((hall) => (
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
                                        onClick={() => {
                                            setHallId(hall.id);
                                            setHallForm({ name: hall.name, description: hall.description, totalCapacity: hall.totalCapacity });
                                            setOpenHallForm(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => {
                                            hallformMutate({ method: "DELETE", data: {}, id: hall?.id });
                                        }}
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
                                    Seats: {hall.seats.length} / {hall.totalCapacity}
                                </Typography>
                                <Fab
                                    color="primary"
                                    aria-label="add"
                                    size='small'
                                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                                    onClick={() => {
                                        setHallId(hall.id);
                                        setSeatId(null);
                                        setSeatForm({ seatNumber: '', seatType: 'STANDARD', status: 'AVAILABLE' });
                                        setOpenSeatForm(true);
                                    }}
                                >
                                    <AddIcon />
                                </Fab>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Grid container spacing={1}>
                                    {hall.seats.map((seat: any) => (
                                        <Grid size={{ xs: 4, sm: 3, md: 2 }} key={seat.id}>

                                            <IconButton
                                                onClick={() => {
                                                    setHallId(hall.id);
                                                    setSeatId(seat.id);
                                                    setSeatForm({ seatNumber: seat.seatNumber, seatType: seat.seatType, status: seat.status });
                                                    setOpenSeatForm(true);
                                                }}
                                                sx={{
                                                    p: 0.5,
                                                    border: 1,
                                                    borderColor: 'grey.300',
                                                    borderRadius: 1,
                                                    backgroundColor: seat.status.toUpperCase() === 'AVAILABLE' ? 'success.light' :
                                                        seat.status.toUpperCase() === 'OCCUPIED' ? 'error.light' :
                                                            seat.status.toUpperCase() === 'RESERVED' ? 'warning.light' :
                                                                'grey.200',
                                                    '&:hover': {
                                                        backgroundColor: seat.status.toUpperCase() === 'AVAILABLE' ? 'success.main' :
                                                            seat.status.toUpperCase() === 'OCCUPIED' ? 'error.main' :
                                                                seat.status.toUpperCase() === 'RESERVED' ? 'warning.main' :
                                                                    'grey.300',
                                                    },
                                                    position: 'relative'
                                                }}
                                                disabled={seat.status.toUpperCase() === 'MAINTENANCE'}
                                            >
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -10,
                                                        right: -10,
                                                        backgroundColor: 'paper',
                                                        border: '1px solid',
                                                        width: 15,
                                                        height: 15,
                                                        opacity: 0,
                                                        color: 'error.main',
                                                        transition: 'opacity 0.2s',
                                                        pointerEvents: 'none',
                                                        '.MuiIconButton-root:hover &': {
                                                            opacity: 1,
                                                            pointerEvents: 'auto',
                                                        },
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setHallId(hall.id);
                                                        seatformMutate({ method: "DELETE", data: {}, id: seat.id });
                                                    }}
                                                >
                                                    <CloseIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    position: "relative"
                                                }}>

                                                    {/* {seat.status.toLowerCase() == 'Avialable' ? 'success.light' : 'dfd'} */}
                                                    {/* {seat.status.toLowerCase() === 'available' ? 'success.light' :
                                                        seat.status.toLowerCase() === 'occupied' ? 'error.light' :
                                                            seat.status.toLowerCase() === 'reserved' ? 'warning.light' :
                                                                'grey.200'} */}
                                                    {/* {seat.status} */}
                                                    <ChairIcon color="primary" sx={{ fontSize: '2.5rem' }} />
                                                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'common.black' }}>
                                                        {seat.seatNumber}
                                                    </Typography>
                                                </Box>
                                            </IconButton>

                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                <Chip icon={<SeatIcon color="success" />} label="Available" variant="outlined" size="small" />
                                <Chip icon={<SeatIcon color="error" />} label="Occupied" variant="outlined" size="small" />
                                <Chip icon={<SeatIcon color="warning" />} label="Reserved" variant="outlined" size="small" />
                                <Chip icon={<SeatIcon color="action" />} label="Maintenance" variant="outlined" size="small" />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {(!halls || halls.length === 0) && (
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        No Hall Created
                    </Typography>
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => {
                    setHallId(null);
                    setHallForm({ name: '', description: '', totalCapacity: 0 });
                    setOpenHallForm(true);
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default SeatManagementSystem;