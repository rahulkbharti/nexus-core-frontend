import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    // Grid,
    IconButton,
    Avatar,
    Divider,
    // Card,
    // CardContent,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    Stack,
    Pagination
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Payment as PaymentIcon,
    AccountCircle as MemberIcon,
    // Receipt as ReceiptIcon,
    // AttachMoney as MoneyIcon,
    Search as SearchIcon
} from '@mui/icons-material';

// Define types
interface Fee {
    id: string;
    memberId: string;
    memberName: string;
    type: 'membership' | 'late' | 'damage' | 'processing' | 'other';
    amount: number;
    balance: number;
    status: 'pending' | 'partial' | 'paid' | 'overdue';
    issueDate: string;
    dueDate: string;
    description: string;
    transactions: Transaction[];
}

interface Transaction {
    id: string;
    feeId: string;
    amount: number;
    paymentDate: string;
    method: 'cash' | 'card' | 'online' | 'check';
    processedBy: string;
}

interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    membershipType: 'student' | 'faculty' | 'public';
    joinDate: string;
    totalFees: number;
    paidFees: number;
    balance: number;
}

// Sample data
const initialFees: Fee[] = [
    {
        id: 'F-001',
        memberId: 'M-001',
        memberName: 'John Smith',
        type: 'late',
        amount: 15.00,
        balance: 15.00,
        status: 'overdue',
        issueDate: '2023-10-01',
        dueDate: '2023-10-15',
        description: 'Late return of "Introduction to React"',
        transactions: []
    },
    {
        id: 'F-002',
        memberId: 'M-002',
        memberName: 'Sarah Johnson',
        type: 'membership',
        amount: 25.00,
        balance: 0,
        status: 'paid',
        issueDate: '2023-09-15',
        dueDate: '2023-10-15',
        description: 'Annual membership renewal',
        transactions: [
            {
                id: 'T-001',
                feeId: 'F-002',
                amount: 25.00,
                paymentDate: '2023-09-16',
                method: 'card',
                processedBy: 'Admin'
            }
        ]
    },
    {
        id: 'F-003',
        memberId: 'M-003',
        memberName: 'Michael Brown',
        type: 'damage',
        amount: 35.50,
        balance: 20.00,
        status: 'partial',
        issueDate: '2023-10-05',
        dueDate: '2023-10-20',
        description: 'Damage to book cover',
        transactions: [
            {
                id: 'T-002',
                feeId: 'F-003',
                amount: 15.50,
                paymentDate: '2023-10-10',
                method: 'cash',
                processedBy: 'Librarian'
            }
        ]
    },
    {
        id: 'F-004',
        memberId: 'M-001',
        memberName: 'John Smith',
        type: 'late',
        amount: 10.00,
        balance: 10.00,
        status: 'pending',
        issueDate: '2023-10-12',
        dueDate: '2023-10-27',
        description: 'Late return of "Advanced JavaScript"',
        transactions: []
    },
    {
        id: 'F-005',
        memberId: 'M-004',
        memberName: 'Emily Davis',
        type: 'processing',
        amount: 5.00,
        balance: 5.00,
        status: 'pending',
        issueDate: '2023-10-15',
        dueDate: '2023-10-30',
        description: 'Inter-library loan processing fee',
        transactions: []
    }
];

const initialMembers: Member[] = [
    {
        id: 'M-001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        membershipType: 'student',
        joinDate: '2022-03-15',
        totalFees: 25.00,
        paidFees: 0,
        balance: 25.00
    },
    {
        id: 'M-002',
        name: 'Sarah Johnson',
        email: 'sarahj@example.com',
        phone: '(555) 234-5678',
        membershipType: 'faculty',
        joinDate: '2021-08-10',
        totalFees: 25.00,
        paidFees: 25.00,
        balance: 0
    },
    {
        id: 'M-003',
        name: 'Michael Brown',
        email: 'm.brown@example.com',
        phone: '(555) 345-6789',
        membershipType: 'public',
        joinDate: '2023-01-20',
        totalFees: 35.50,
        paidFees: 15.50,
        balance: 20.00
    },
    {
        id: 'M-004',
        name: 'Emily Davis',
        email: 'emilyd@example.com',
        phone: '(555) 456-7890',
        membershipType: 'student',
        joinDate: '2023-05-05',
        totalFees: 5.00,
        paidFees: 0,
        balance: 5.00
    }
];

const FeesManagementSystem: React.FC = () => {
    const [fees, setFees] = useState<Fee[]>(initialFees);
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
    // const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    // const [memberDialogOpen, setMemberDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [_tabValue, setTabValue] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [newFee, setNewFee] = useState<Partial<Fee>>({
        type: 'late',
        amount: 0,
        status: 'pending',
        description: ''
    });
    const [newPayment, setNewPayment] = useState<Partial<Transaction>>({
        amount: 0,
        method: 'cash',
        paymentDate: new Date().toISOString().split('T')[0]
    });
    const [searchTerm, setSearchTerm] = useState('');

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    //     setTabValue(newValue);
    // };

    const handleOpenFeeDialog = (fee?: Fee) => {
        if (fee) {
            setSelectedFee(fee);
            setNewFee({ ...fee });
        } else {
            setSelectedFee(null);
            setNewFee({
                type: 'late',
                amount: 0,
                status: 'pending',
                description: ''
            });
        }
        setDialogOpen(true);
    };

    const handleSaveFee = () => {
        if (!newFee.memberId || !newFee.amount) {
            showSnackbar('Member and amount are required', 'error');
            return;
        }

        const member = members.find(m => m.id === newFee.memberId);

        if (selectedFee) {
            // Update existing fee
            const updatedFees = fees.map(fee =>
                fee.id === selectedFee.id
                    ? {
                        ...fee,
                        type: newFee.type || 'late',
                        amount: newFee.amount || 0,
                        description: newFee.description || '',
                        status: newFee.status || 'pending'
                    }
                    : fee
            );
            setFees(updatedFees);
            showSnackbar('Fee updated successfully');
        } else {
            // Add new fee
            const feeId = `F-${String(fees.length + 1).padStart(3, '0')}`;
            const feeToAdd: Fee = {
                id: feeId,
                memberId: newFee.memberId || '',
                memberName: member?.name || '',
                type: newFee.type || 'late',
                amount: newFee.amount || 0,
                balance: newFee.amount || 0,
                status: 'pending',
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
                description: newFee.description || '',
                transactions: []
            };

            // Update member balance
            const updatedMembers = members.map(m =>
                m.id === newFee.memberId
                    ? { ...m, totalFees: m.totalFees + feeToAdd.amount, balance: m.balance + feeToAdd.amount }
                    : m
            );

            setFees([...fees, feeToAdd]);
            setMembers(updatedMembers);
            showSnackbar('Fee added successfully');
        }
        setDialogOpen(false);
    };

    const handleOpenPaymentDialog = (fee: Fee) => {
        setSelectedFee(fee);
        setNewPayment({
            amount: fee.balance,
            method: 'cash',
            paymentDate: new Date().toISOString().split('T')[0]
        });
        setPaymentDialogOpen(true);
    };

    const handleProcessPayment = () => {
        if (!selectedFee || !newPayment.amount) {
            showSnackbar('Payment amount is required', 'error');
            return;
        }

        const paymentAmount = newPayment.amount;
        if (paymentAmount <= 0 || paymentAmount > selectedFee.balance) {
            showSnackbar('Invalid payment amount', 'error');
            return;
        }

        const transactionId = `T-${String(selectedFee.transactions.length + 1).padStart(3, '0')}`;
        const transaction: Transaction = {
            id: transactionId,
            feeId: selectedFee.id,
            amount: paymentAmount,
            paymentDate: newPayment.paymentDate || new Date().toISOString().split('T')[0],
            method: newPayment.method || 'cash',
            processedBy: 'Admin' // In a real app, this would be the logged-in user
        };

        // Update fee with new transaction
        const updatedFees = fees.map(fee =>
            fee.id === selectedFee.id
                ? {
                    ...fee,
                    transactions: [...fee.transactions, transaction],
                    balance: fee.balance - paymentAmount,
                    status: fee.balance - paymentAmount === 0 ? 'paid' :
                        fee.balance - paymentAmount > 0 ? 'partial' : fee.status
                }
                : fee
        );

        // Update member balance
        const updatedMembers = members.map(member =>
            member.id === selectedFee.memberId
                ? {
                    ...member,
                    paidFees: member.paidFees + paymentAmount,
                    balance: member.balance - paymentAmount
                }
                : member
        );

        setFees(updatedFees);
        setMembers(updatedMembers);
        setPaymentDialogOpen(false);
        showSnackbar('Payment processed successfully');
    };

    const handleOpenDeleteDialog = (fee: Fee) => {
        setSelectedFee(fee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteFee = () => {
        if (selectedFee) {
            // Update member balance if fee wasn't fully paid
            if (selectedFee.balance > 0) {
                const updatedMembers = members.map(member =>
                    member.id === selectedFee.memberId
                        ? {
                            ...member,
                            totalFees: member.totalFees - selectedFee.amount,
                            balance: member.balance - selectedFee.balance
                        }
                        : member
                );
                setMembers(updatedMembers);
            }

            // Remove the fee
            const updatedFees = fees.filter(fee => fee.id !== selectedFee.id);
            setFees(updatedFees);
            setDeleteDialogOpen(false);
            showSnackbar('Fee deleted successfully');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'success';
            case 'pending': return 'default';
            case 'partial': return 'warning';
            case 'overdue': return 'error';
            default: return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'membership': return 'primary';
            case 'late': return 'error';
            case 'damage': return 'warning';
            case 'processing': return 'info';
            case 'other': return 'default';
            default: return 'default';
        }
    };

    const filteredFees = fees.filter(fee =>
        fee.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // const totalPendingFees = fees.filter(f => f.status !== 'paid').reduce((sum, fee) => sum + fee.balance, 0);
    // const totalPaid = fees.reduce((sum, fee) => sum + (fee.amount - fee.balance), 0);
    // const overdueFees = fees.filter(f => f.status === 'overdue').reduce((sum, fee) => sum + fee.balance, 0);

    return (
        <Box sx={{ minHeight: '100vh' }}>
            {/* Summary Cards */}
            {/* <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Pending Fees
                            </Typography>
                            <Typography variant="h5" component="div" color="primary">
                                ${totalPendingFees.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Collected
                            </Typography>
                            <Typography variant="h5" component="div" color="success.main">
                                ${totalPaid.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Overdue Fees
                            </Typography>
                            <Typography variant="h5" component="div" color="error.main">
                                ${overdueFees.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Fees
                            </Typography>
                            <Typography variant="h5" component="div">
                                ${fees.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid> */}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                    placeholder="Search fees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    variant="outlined"
                    size="small"
                    sx={{ width: 300 }}
                />
                <Stack gap={2} direction={"row"}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            // value={filterStatus}
                            label="Status"
                        // onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="available">Available</MenuItem>
                            <MenuItem value="borrowed">Borrowed</MenuItem>
                            <MenuItem value="reserved">Reserved</MenuItem>
                            <MenuItem value="maintenance">Maintenance</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFeeDialog()}
                    >
                        Add New Fee
                    </Button>
                </Stack>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fee ID</TableCell>
                                <TableCell>Member</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Balance</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredFees.map((fee) => (
                                <TableRow key={fee.id}>
                                    <TableCell>{fee.id}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                                                <MemberIcon />
                                            </Avatar>
                                            {fee.memberName}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={fee.type} color={getTypeColor(fee.type)} size="small" />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 200 }}>{fee.description}</TableCell>
                                    <TableCell align="right">${fee.amount.toFixed(2)}</TableCell>
                                    <TableCell align="right">${fee.balance.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip label={fee.status} color={getStatusColor(fee.status)} size="small" />
                                    </TableCell>
                                    <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenFeeDialog(fee)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenPaymentDialog(fee)}
                                            disabled={fee.balance === 0}
                                        >
                                            <PaymentIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleOpenDeleteDialog(fee)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                <Pagination count={10} showFirstButton showLastButton />
            </Stack>
            {/* Fee Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedFee ? 'Edit Fee' : 'Create New Fee'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            select
                            fullWidth
                            label="Member"
                            value={newFee.memberId || ''}
                            onChange={(e) => {
                                const memberId = e.target.value;
                                const member = members.find(m => m.id === memberId);
                                setNewFee({
                                    ...newFee,
                                    memberId,
                                    memberName: member?.name || ''
                                });
                            }}
                            margin="normal"
                        >
                            {members.map((member) => (
                                <MenuItem key={member.id} value={member.id}>
                                    {member.name} ({member.membershipType})
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            fullWidth
                            label="Fee Type"
                            value={newFee.type}
                            onChange={(e) => setNewFee({ ...newFee, type: e.target.value as any })}
                            margin="normal"
                        >
                            <MenuItem value="late">Late Return</MenuItem>
                            <MenuItem value="damage">Damage</MenuItem>
                            <MenuItem value="membership">Membership</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            type="number"
                            label="Amount"
                            value={newFee.amount}
                            onChange={(e) => setNewFee({ ...newFee, amount: parseFloat(e.target.value) })}
                            margin="normal"
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={newFee.description}
                            onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveFee} variant="contained">
                        {selectedFee ? 'Update Fee' : 'Create Fee'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Process Payment for {selectedFee?.memberName}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            Fee: {selectedFee?.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Total Amount: ${selectedFee?.amount.toFixed(2)} | Balance: ${selectedFee?.balance.toFixed(2)}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <TextField
                            fullWidth
                            type="number"
                            label="Payment Amount"
                            value={newPayment.amount}
                            onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
                            margin="normal"
                            inputProps={{
                                min: 0,
                                max: selectedFee?.balance,
                                step: 0.01
                            }}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Payment Method"
                            value={newPayment.method}
                            onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value as any })}
                            margin="normal"
                        >
                            <MenuItem value="cash">Cash</MenuItem>
                            <MenuItem value="card">Card</MenuItem>
                            <MenuItem value="online">Online</MenuItem>
                            <MenuItem value="check">Check</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            type="date"
                            label="Payment Date"
                            value={newPayment.paymentDate}
                            onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleProcessPayment} variant="contained" color="primary">
                        Process Payment
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
                        Are you sure you want to delete this fee? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteFee} color="error" variant="contained">
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
        </Box>
    );
};

export default FeesManagementSystem;