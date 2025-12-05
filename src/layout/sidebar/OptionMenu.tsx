import * as React from 'react';
import { styled } from '@mui/material/styles';
import { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from '../../components/MenuButton';
import api from '../../apis/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, type AuthState } from '../../store/features/authSlice';
import { CircularProgress } from '@mui/material';


const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

export default function OptionsMenu() {
  const authData = useSelector((state: { auth: AuthState }) => state?.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleLogout = async (callApi = true) => {
    setIsLoggingOut(true);
    try {
      if (callApi) {
        const data = authData?.loginData;
        await api.post("/auth/logout", {
          accessToken: data?.accessToken,
          refreshToken: data?.refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setTimeout(() => {
        dispatch(logout());
        navigate("/login");
        setIsLoggingOut(false);
      }, 1000);
    }
  }
  if (!authData) {
    navigate("/login");
    return null;
  }
  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Add another account</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem> */}
        {/* <Divider /> */}
        <MenuItem
          onClick={() => handleLogout()}
          disabled={isLoggingOut}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            {isLoggingOut ? <CircularProgress size={20} /> : <LogoutRoundedIcon fontSize="small" />}
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
