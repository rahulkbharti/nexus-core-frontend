import React, { useState, useEffect } from 'react';
import {
    Box, List, ListItemButton, ListItemIcon, ListItemText, Divider,
    Collapse, styled, useTheme
} from "@mui/material";
import {
    Dashboard, LibraryBooks, People, Lock, AttachMoney,
    ExpandLess, ExpandMore, Business, ExitToApp
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

// Menu configuration
const menuItems = [
    // { id: "dashboard", icon: <Dashboard />, label: "Dashboard", link: "/" },
    {
        id: "users", icon: <People />, label: "Users & Accounts",
        subItems: [
            { label: "Students", link: "/users/students" },
            { label: "Staffs", link: "/users/staffs" },
        ]
    },
    {
        id: "roles", icon: <Lock />, label: "Roles & Permissions",
        subItems: [
            { label: "Roles", link: "/roles/groups" },
            { label: "Update Permissions", link: "/roles/permissions" },
        ]
    },
    {
        id: "library", icon: <LibraryBooks />, label: "Library Management",
        subItems: [
            { label: "Books Management", link: "/library-management/books" },
            { label: "Seats", link: "/library-management/seats" },
            { label: "Seat Reservations", link: "/library-management/reservations" },
        ]
    },
    {
        id: "fees", icon: <AttachMoney />, label: "Fees and Payment",
        subItems: [
            { label: "Member Fees", link: "/fees/student-fees" },
            { label: "Staff Payment", link: "/fees/staff-payment" }
        ]
    },
];

const secondaryItems = [
    { id: "organization", icon: <Business />, label: "Organization", link: "/organization" },
    { id: "logout", icon: <ExitToApp />, label: "Logout", link: "/logout" },
];

// Styled components
const StyledListItem = styled(ListItemButton)(({ theme, active }) => ({
    margin: theme.spacing(0.25, 1),
    padding: theme.spacing(0.8, 1.5),
    borderRadius: theme.shape.borderRadius,
    minHeight: 44,
    color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
    backgroundColor: active ? theme.palette.primary.main : 'transparent',
    transition: 'all 0.2s ease-in-out',

    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: theme.spacing(1.5),
        justifyContent: "center",
        color: 'inherit',
    },

    '& .MuiListItemText-primary': {
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 500,
    },

    '&:hover': {
        backgroundColor: active ? theme.palette.primary.main : theme.palette.action.hover,
        transform: 'translateX(4px)',
    },
}));

const StyledSubListItem = styled(ListItemButton)(({ theme, active }) => ({
    padding: theme.spacing(0.5, 1.5),
    paddingLeft: theme.spacing(4),
    minHeight: 38,
    backgroundColor: active ? theme.palette.action.selected : 'transparent',
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    margin: theme.spacing(0.25, 1),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',

    '&::before': {
        content: '"›"',
        display: 'block',
        marginRight: theme.spacing(1.5),
        color: active ? theme.palette.primary.main : theme.palette.text.disabled,
        fontSize: '1.2rem',
        transition: 'color 0.2s ease-in-out',
    },

    '&:hover': {
        backgroundColor: active ? theme.palette.action.selected : theme.palette.action.hover,
        color: active ? theme.palette.primary.main : theme.palette.text.primary,
        transform: 'translateX(4px)',
        '&::before': {
            color: active ? theme.palette.primary.main : theme.palette.text.secondary,
        }
    },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 280,
    height: '100vh',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 0),
}));

const Logo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),

    '& h2': {
        fontWeight: 600,
        color: theme.palette.primary.main,
        margin: 0,
    }
}));

// Menu Item Component
const MenuItem = ({ item, openMenu, setOpenMenu }) => {
    const { pathname } = useLocation();
    const isOpen = openMenu === item.id;

    const isParentActive = item.subItems
        ? item.subItems.some(sub => pathname.startsWith(sub.link))
        : pathname === item.link;

    const handleClick = () => {
        if (item.subItems) {
            setOpenMenu(isOpen ? null : item.id);
        }
    };

    return (
        <>
            <NavLink
                to={item.link || '#'}
                style={{ textDecoration: 'none' }}
                onClick={item.subItems ? (e) => { e.preventDefault(); handleClick(); } : undefined}
            >
                <StyledListItem active={isParentActive ? 1 : 0}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {item.subItems && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </StyledListItem>
            </NavLink>

            {item.subItems && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.subItems.map((subItem) => (
                            <NavLink key={subItem.link} to={subItem.link} style={{ textDecoration: 'none' }}>
                                <StyledSubListItem active={pathname.startsWith(subItem.link) ? 1 : 0}>
                                    <ListItemText primary={subItem.label} />
                                </StyledSubListItem>
                            </NavLink>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

const SecondaryMenuItem = ({ item }) => {
    const { pathname } = useLocation();

    return (
        <NavLink to={item.link} style={{ textDecoration: 'none' }}>
            <StyledListItem active={pathname === item.link ? 1 : 0}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
            </StyledListItem>
        </NavLink>
    );
};

const NewMenu = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const { pathname } = useLocation();

    // Auto-open the menu if the current path matches a sub-item
    useEffect(() => {
        for (const item of menuItems) {
            if (item.subItems && item.subItems.some(sub => pathname.startsWith(sub.link))) {
                setOpenMenu(item.id);
                break;
            }
        }
    }, [pathname]);

    return (


        <List sx={{ px: 1, flexGrow: 1 }}>
            {menuItems.map((item) => (
                <MenuItem
                    key={item.id}
                    item={item}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                />
            ))}
        </List>

    );
};

export default NewMenu;