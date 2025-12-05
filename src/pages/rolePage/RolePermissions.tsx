import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useQuery } from '@tanstack/react-query';
import api from '../../apis/api';
import { Box, CircularProgress } from '@mui/material';

type Permission = { id: number; name: string; desc: string };

function not(a: readonly Permission[], b: readonly Permission[]) {
    return a.filter((value) => !b.some(item => item.id === value.id));
}

function intersection(a: readonly Permission[], b: readonly Permission[]) {
    return a.filter((value) => b.some(item => item.id === value.id));
}

function union(a: readonly Permission[], b: readonly Permission[]) {
    return [...a, ...not(b, a)];
}

const RolePermissions = ({ permissions = [], setPermissions = () => { } }: { permissions?: Permission[], setPermissions?: (permissions: Permission[]) => void }) => {
    const [checked, setChecked] = React.useState<readonly Permission[]>([]);
    const [left, setLeft] = React.useState<readonly Permission[]>([]);
    const [right, setRight] = React.useState<readonly Permission[]>([]);

    const { data: allPermissions, isLoading } = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const response = await api.get('/auth/permissions');
            return (response.data as any)?.permissions || [];
        },
        refetchOnWindowFocus: false, // Disable refetch on window focus
        staleTime: 1 * 60 * 1000, // 5 minutes
    });

    React.useEffect(() => {
        if (allPermissions) {
            setRight(permissions);
            setLeft(not(allPermissions, permissions));
        }
    }, [allPermissions, permissions]);


    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (permission: Permission) => () => {
        const currentIndex = checked.findIndex(item => item.id === permission.id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(permission);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: readonly Permission[]) =>
        intersection(checked, items).length;

    const handleToggleAll = (items: readonly Permission[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        const newRight = [...right, ...leftChecked];
        setRight(newRight);
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        setPermissions(newRight);
    };

    const handleCheckedLeft = () => {
        const newRight = not(right, rightChecked);
        setLeft([...left, ...rightChecked]);
        setRight(newRight);
        setChecked(not(checked, rightChecked));
        setPermissions(newRight);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    const customList = (title: React.ReactNode, items: readonly Permission[]) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: '100%',
                    minWidth: 250,
                    height: 230,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((permission: Permission) => {
                    const labelId = `transfer-list-all-item-${permission.id}-label`;
                    const isChecked = checked.some(item => item.id === permission.id);
                    return (
                        <ListItemButton
                            key={permission.id}
                            role="listitem"
                            onClick={handleToggle(permission)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={isChecked}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={permission.name} secondary={permission.desc} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>{customList('Available', left)}</Grid>
            <Grid size={{ xs: 12, md: 2 }}>
                <Grid container direction={{ xs: 'row', md: 'column' }} alignItems="center" justifyContent="center">
                    <Button
                        sx={{ m: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ m: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>{customList('Enabled', right)}</Grid>
        </Grid>
    );
}
export default RolePermissions;