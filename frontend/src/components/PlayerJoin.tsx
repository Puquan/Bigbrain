import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'
import { Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Alert from './Alert';

const CenterContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

function PlayerJoin () {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [username, setUsername] = React.useState('')
  const [sessionId, setSessionID] = React.useState('')
  const [IsCompleted, setIsCompleted] = React.useState(false);
  const [playerId, setPlayerId] = React.useState('');

  const navigate = useNavigate()

  React.useEffect(() => {
    if (playerId) {
      navigate(`/playerjoin/${playerId}/${sessionId}`)
    }
  }, [playerId])

  async function enterGame () {
    console.log(username);
    const response = await fetch(`http://localhost:5005/play/join/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: username,
      }),
    })
    const data = await response.json();
    console.log(data);
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
    } else {
      setPlayerId(data.playerId);
    }
  }

  const handleRequireValidation = () => {
    let isComplete = true;
    const requiredFields = [username, sessionId];

    requiredFields.forEach(field => {
      if (!field) {
        isComplete = false;
      }
    });
    setIsCompleted(isComplete);
  };

  const handleEnterGameClick = () => {
    if (IsCompleted) {
      enterGame();
    } else {
      setAlertVisible(true);
      setErrorMessages(['Please fill in all required fields']);
    }
  }

  return (
    <>
    <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
    <CenterContainer>
    <Stack spacing={2}>
      <Typography variant="h5" >Please Enter Session ID to Join</Typography>
      <TextField
          variant="outlined"
          required
          id="outlined-required"
          label="Session ID"
          value={sessionId}
          onBlur={handleRequireValidation}
          onChange={(e) => setSessionID(e.target.value)}
          />
      <TextField
          variant="outlined"
          required
          id="outlined-required"
          label="Your Name"
          value={username}
          onBlur={handleRequireValidation}
          onChange={(e) => setUsername(e.target.value) }
        />
          <Button variant="contained" color="success" onClick={handleEnterGameClick}>
          ENTER GAME
      </Button>
    </Stack>
    </CenterContainer>
    </>
  )
}

export default PlayerJoin;
