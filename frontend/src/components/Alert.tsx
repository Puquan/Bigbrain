import React from 'react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';

interface AlertProps {
  children: React.ReactNode;
  onClose?: () => void;
}

const Alerts = ({ children, onClose }: AlertProps) => {
  return (
    <>
    <Alert severity="error" data-testid="alert">
      <AlertTitle>Error</AlertTitle>
      {children}
    </Alert>
    <Button onClick={onClose} data-bs-dismiss="alert" aria-label="Close">Close</Button>
    </>
  )
}

export default Alerts
