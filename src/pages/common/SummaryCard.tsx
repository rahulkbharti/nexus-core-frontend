import { Card, CardContent, Grid, Typography } from "@mui/material";
const SummaryCard = () => {
    const totalPendingFees = 1000; // Replace with actual data
    const totalPaid = 800; // Replace with actual data
    const overdueFees = 200; // Replace with actual data
    const fees = []; // Replace with actual data

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
        </Grid>
    )
}
export default SummaryCard;