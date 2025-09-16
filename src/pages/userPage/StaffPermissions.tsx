import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import api from '../../apis/api';

type Permission = { id: number; name: string; desc: string };

function not(a: readonly Permission[], b: readonly Permission[]) {
    return a.filter((value) => !b.some(item => item.id === value.id));
}

function intersection(a: readonly Permission[], b: readonly Permission[]) {
    return a.filter((value) => b.some(item => item.id === value.id));
}

const StaffPermissions = ({ permissions = [], setPermissions = () => { } }: { permissions?: Permission[], setPermissions?: (permissions: Permission[]) => void }) => {
    const [checked, setChecked] = React.useState<readonly Permission[]>([]);
    const [left, setLeft] = React.useState<readonly Permission[]>([]);
    const [right, setRight] = React.useState<readonly Permission[]>(permissions);

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

    const handleAllRight = () => {
        setRight([...right, ...left]);
        setLeft([]);
        setPermissions([...right, ...left]);
    };

    const handleCheckedRight = () => {
        setRight([...right, ...leftChecked]);
        setLeft(not(left, leftChecked));
        setPermissions([...right, ...leftChecked]);
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft([...left, ...rightChecked]);
        setRight(not(right, rightChecked));
        setPermissions(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft([...left, ...right]);
        setPermissions([]);
        setRight([]);
    };

    const { data: _permissions } = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const permissions = await api.get('/auth/permissions');
            const permissionData = (permissions.data as any)?.permissions || [];
            // Set left to permissions that are not in the right side
            setLeft(permissionData.filter((p: Permission) => !right.some(r => r.id === p.id)));
            return permissionData;
        }
    });

    const customList = (items: readonly Permission[]) => (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {items.map((permission) => {
                    const labelId = `transfer-list-item-${permission.id}-label`;
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
                            <ListItemText
                                id={labelId}
                                primary={`${permission.name} ${permission.id}`}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );

    return (
        <Grid
            container
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
            <Grid>{customList(left)}</Grid>
            <Grid>
                <Grid container direction="column" sx={{ alignItems: 'center' }}>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="contained"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="contained"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="contained"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="contained"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid>{customList(right)}</Grid>
        </Grid>
    );
}

export default StaffPermissions;