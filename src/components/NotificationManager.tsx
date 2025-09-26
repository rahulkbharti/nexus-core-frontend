import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';
import eventEmitter from '../utils/eventEmitter';
import { type SyntheticEvent } from 'react';

type Notification = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

function NotificationManager() {
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    // Listen for the 'showNotification' event
    const handleShowNotification = ({ message, severity }: { message: string; severity?: AlertColor }) => {
      setNotification({ open: true, message, severity: severity || 'info' });
    };

    eventEmitter.on('showNotification', handleShowNotification);

    // Important: Clean up the listener when the component is unmounted
    return () => {
      // This part is missing in many tutorials but is crucial
      delete eventEmitter.events['showNotification'];
    };
  }, []);

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={() => handleClose(undefined, undefined)} severity={notification.severity} sx={{ width: '100%' }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default NotificationManager;