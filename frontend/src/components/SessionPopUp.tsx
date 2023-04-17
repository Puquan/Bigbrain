import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'background.paper',
    display: 'flex',
    flexDirection: 'column',
    width: 230,
    border: '1px solid #002',
    boxShadow: theme.shadows[10],
    padding: theme.spacing(2, 2, 2),
    top: '50%',
    left: '50%',
    transform: 'translate(-45%, -50%)',
    p: 4,
  },
}));

interface Props {
  open: boolean;
  handleClose: () => void;
  sessionId: string;
}

function SessionPopUp ({ open, handleClose, sessionId }: Props) {
  const classes = useStyles();

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <Typography variant="h5"> Session ID: {sessionId} </Typography>
          <Button variant="contained" color="primary" size="medium" onClick={handleCopy}>Copy URL</Button>
        </div >
      </Modal>
    </div>
  )
}

export default SessionPopUp
