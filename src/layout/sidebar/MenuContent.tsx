// import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ChairIcon from '@mui/icons-material/Chair';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import CorporateFareIcon from '@mui/icons-material/CorporateFare';

import { Link, useLocation } from 'react-router-dom';

const mainListItems = [
  // { text: 'Dashboard', icon: <HomeRoundedIcon />, path: "/" },
  { text: 'Users & Accounts', icon: <ManageAccountsIcon />, path: "/users" },
  { text: 'Roles & Permissions', icon: <AdminPanelSettingsIcon />, path: "/roles" },
  { text: 'Books Management', icon: <LibraryBooksIcon />, path: "/books" },
  { text: 'Seating Management', icon: <ChairIcon />, path: "/seating" },
  { text: 'Fees Management', icon: <ReceiptLongIcon />, path: "/fees" },
];

const secondaryListItems = [
  // { text: 'Settings', icon: <SettingsRoundedIcon />, path: "/settings" },
  // { text: 'Organizations', icon: <CorporateFareIcon />, path: "/orgs" },
  { text: 'About', icon: <InfoRoundedIcon />, path: "/about" },
  { text: 'Feedback', icon: <HelpRoundedIcon />, path: "/feedback" },
];

export default function MenuContent() {
  const location = useLocation();
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              to={item.path}
              // selected={location.pathname === item.path}
              sx={(theme) => ({
                bgcolor: location.pathname === item.path ? theme.palette.primary.dark : 'transparent',
                color: location.pathname === item.path ? theme.palette.common.white : theme.palette.text.primary,
                '&:hover': {
                  bgcolor: location.pathname === item.path ? theme.palette.primary.dark : theme.palette.action.hover,
                },
              })}
            >
              <ListItemIcon sx={(theme) => ({
                minWidth: "36px",
                color: location.pathname === item.path ? theme.palette.common.white : theme.palette.text.primary
              })}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: "36px" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
