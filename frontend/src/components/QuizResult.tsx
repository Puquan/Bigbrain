import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Stack, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import Alert from './Alert';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Navbar from './Navbar';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
  },
}));

function QuizResult () {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const param = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = React.useState<any>('');
  const [quizId, setQuizId] = React.useState<any>('');
  const [show, setShow] = React.useState<boolean>(false);
  const [quizStatus, setQuizStatus] = React.useState<boolean>(false);
  const [CurrentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(-1);
  const [CurrentQuestion, setCurrentQuestion] = React.useState<any>([]);
  const [isAdvance, setIsAdvance] = React.useState<boolean>(false);
  const [responseData, setResponseData] = React.useState<any>(null);

  React.useEffect(() => {
    setQuizId(param.quizId);
    setSessionId(param.sessionId);
    setShow(true);
  }, [sessionId, quizId]);

  React.useEffect(() => {
    if (show) {
      fetchSessionStatus(sessionId);
    }
  }, [show]);

  console.log('isAdvance', isAdvance);
  console.log('show', show);
  console.log('CurrentQuestion', CurrentQuestion);
  console.log('CurrentQuestionIndex', CurrentQuestionIndex);

  React.useEffect(() => {
    setQuizStatus(responseData?.results?.active);
    if (responseData?.results?.position > -1) {
      setCurrentQuestion(responseData?.results?.questions[responseData?.results?.position]);
      setCurrentQuestionIndex(responseData?.results?.position);
    }
  }, [responseData]);

  React.useEffect(() => {
    if (CurrentQuestionIndex > -1) {
      setIsAdvance(true);
      console.log('quizStatus', CurrentQuestion);
    }
  }, [CurrentQuestion, CurrentQuestionIndex]);

  async function fetchSessionStatus (sessionId: string | number) {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    setResponseData(data);
  }

  async function advanceQuiz (quizId: string | number) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}/advance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
  }

  async function StopQuiz (quizId: string | number) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}/end`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    const data = await response.json();
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
    }
    console.log('stop quiz');
  }

  const handlePauseClick = (quizId: string) => {
    StopQuiz(quizId);
  }

  const handleNextClick = (quizId: string) => {
    advanceQuiz(quizId);
    fetchSessionStatus(sessionId);
  }

  return (
    <>
      <Navbar/>
      <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
      { show && quizStatus
        ? <Stack className={classes.root} spacing={2}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button color="success" onClick={() => handleNextClick(quizId)} >Next Question</Button>
              <Button color="error" onClick={() => handlePauseClick(quizId)}>STOP GAME</Button>
            </ButtonGroup>
            { isAdvance
              ? <Card>
              <CardHeader
                title={CurrentQuestion.question}
                subheader={'TimeLimit: ' + CurrentQuestion.timeLimit + 'min'}/>
              </Card>
              : <Typography>Please Click Next Question to Start</Typography>}
          </Stack>
        : <h1>Quiz is not active</h1> }
    </>
  )
}

export default QuizResult
