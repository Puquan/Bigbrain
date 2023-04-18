import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { green, purple } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

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
    zIndex: 50,
  },
  button1: {
    marginTop: '2em',
    backgroundColor: purple[500],
  },
  button2: {
    marginTop: '2em',
    backgroundColor: green[500],
  },
}));

interface Props {
  open: boolean;
  handleClose: () => void;
  sessionId: string;
  isStart: boolean;
  quizId: string;
}

function SessionPopUp ({ open, handleClose, sessionId, isStart, quizId }: Props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId);
  }

  const handleViewResult = () => {
    navigate(`/quizResult/${quizId}/${sessionId}`);
  };

  return (
    <>
      {sessionId
        ? <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {isStart
            ? <div className={classes.paper}>
                <Typography variant="h5"> Session ID: {sessionId} </Typography>
                <Button className={classes.button1} variant="contained" color="primary" size="medium" onClick={handleCopy}>Copy URL</Button>
                <Button className={classes.button2} variant="contained" color="primary" size="medium" onClick={handleViewResult}>Manage Game</Button>
              </div >
            : <div className={classes.paper}>
                <Typography variant="h5"> See Result? </Typography>
              <Button className={classes.button1} variant="contained" color="primary" size="medium" onClick={handleViewResult}>View Result</Button>
              </div>
          }
        </Modal>
      </div>
        : <div>loading</div>}
    </>
  )
}

export default SessionPopUp
