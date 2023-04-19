import React from 'react'
import Confetti from 'react-confetti';
import { useParams } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Alert from './Alert';

const CenterContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

interface answerOptions {
  id: number,
  value: string,
  isCorrect: boolean,
}

function PlayerSession () {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [quizState, setQuizState] = React.useState('lobby');
  const [currentQuestion, setCurrentQuestion] = React.useState<any>([]);
  const playerId = useParams<{playerId: string}>().playerId;
  const sessionId = useParams<{sessionId: string}>().sessionId;
  const [timer, setTimer] = React.useState(-10);
  const [selectedAnswerIds, setSelectedAnswerIds] = React.useState<number[]>([]);
  const [questionAnswers, setQuestionAnswers] = React.useState<any>([])
  const [playerResults, setPlayerResults] = React.useState<any>([]);
  const [startTime, setStartTime] = React.useState<number>(0);

  async function startedQuiz () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const data = await response.json();
    console.log(sessionId);
    if (response.status === 200 && data.started) {
      setQuizState('quiz');
    }
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(['The Game may be over or you may have entered the wrong session ID']);
    }
  }

  async function getQuizCurrentQuestion () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/question`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const data = await response.json();

    if (response.status === 200) {
      if (data.question.questionId !== currentQuestion.questionId) {
        console.log(data);
        const startTimeString = data.question.isoTimeLastQuestionStarted;
        console.log(startTimeString);
        const startTime = new Date(startTimeString);
        setStartTime(startTime.getTime());
        const endTime = new Date(startTime.getTime() + Number(data.question.timeLimit) * 1000);
        const diff = Math.floor((endTime.getTime() - new Date().getTime()) / 1000) + 1;
        setTimer(Number(diff));
      }
      setCurrentQuestion(data.question);
    } else {
      setQuizState('complete')
    }
  }

  React.useEffect(() => {
    // if start time changed means that a new question started
    if (startTime !== 0 && quizState === 'answer') {
      setQuizState('quiz');
    }
  }, [startTime])

  async function submitAnswer () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        answerIds: selectedAnswerIds,
      }),
    })
    const data = await response.json();
    console.log('submit:', data)
  }

  async function getAnswer () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'GET',
    })
    const data = await response.json();
    console.log('getAnswer:', data);
    setQuestionAnswers(data.answerIds);
  }

  async function getQuizResult () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/results`, {
      method: 'GET',
    })
    const data = await response.json();
    console.log('result:', data);
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
    } else {
      const temp = [];
      if (response.status === 200) {
        for (let i = 0; i < data.length; i++) {
          let text = `question${i + 1}: `
          if (data[i].correct) {
            text += 'Correct'
          } else {
            text += 'Incorrect'
          }
          temp.push(text);
        }
        setPlayerResults(temp);
      }
    }
  }

  React.useEffect(() => {
    if (quizState === 'quiz') {
      getQuizCurrentQuestion()
    }
  }, [quizState])

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (quizState === 'lobby') {
        startedQuiz();
      }
    }, 500)
    return () => clearInterval(interval)
  })

  React.useEffect(() => {
    if (quizState === 'answer') {
      setSelectedAnswerIds([]);
      getAnswer();
    }
  }, [quizState])

  React.useEffect(() => {
    const interval = setInterval(() => {
      if ((quizState === 'answer') || quizState === 'quiz') {
        getQuizCurrentQuestion();
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  React.useEffect(() => {
    if (quizState === 'quiz') {
      if (timer > 0) {
        setTimeout(() => {
          setTimer(timer - 1);
        }, 1000);
      } else if (timer === 0) {
        setQuizState('answer')
      }
    }
  })

  React.useEffect(() => {
    if (quizState === 'complete') {
      getQuizResult();
    }
  }, [quizState])

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const answerId = parseInt(event.target.value);
    let newSelectedAnswerIds: number[];
    if (currentQuestion.questionType === 'multiple-choice') {
      // multiple choice
      if (event.target.checked) {
        newSelectedAnswerIds = [...selectedAnswerIds, answerId];
      } else {
        newSelectedAnswerIds = selectedAnswerIds.filter((id) => id !== answerId);
      }
    } else {
      // single choice
      newSelectedAnswerIds = [answerId];
    }
    setSelectedAnswerIds(newSelectedAnswerIds);
  };

  const handleSubmit = () => {
    submitAnswer();
    // getAnswer();
  };

  return (
    <>
    <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
    {(quizState === 'lobby') &&
        <CenterContainer>
            <Typography variant="h3">Welcome!</Typography>
            <Typography variant="h5">Please wait for the host to start the game.</Typography>
            <Confetti />
        </CenterContainer>
    }
    {(quizState === 'quiz' && currentQuestion.length !== 0 && timer > 0)
      ? <CenterContainer>
          <Card>
            <CardHeader
              title={`Question: ${currentQuestion.question}`}
              subheader={currentQuestion.questionType}
            />
            <p>Time Left: {timer}</p>
            <CardMedia
              component="img"
              height="200"
              image={currentQuestion.image}
              alt="Question Image"
            />
            {/* url only allows Embed video, e.g https://www.youtube.com/embed/DEqiMEvJvV4 */}
            {currentQuestion.image === '' ? <div></div> : <iframe width="360" height="315" src={currentQuestion.url} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>}
            <CardActions>
              <FormControl component="fieldset">
                <FormGroup>
              {currentQuestion.answerOptions.map((answer: answerOptions) => (
                <FormControlLabel
                  key={answer.id}
                  value={answer.id.toString()}
                  label={answer.value}
                  control={
                    <Checkbox
                      checked={
                        currentQuestion.questionType === 'multiple-choice'
                          ? selectedAnswerIds.includes(answer.id)
                          : selectedAnswerIds[0] === answer.id
                      }
                      onChange={handleAnswerChange}
                    />
                  }
                />
              ))}
                </FormGroup>
              </FormControl>
            </CardActions>
          </Card>
          <Button variant='contained' onClick={handleSubmit}>
            Submit My Answer
          </Button>
        </CenterContainer>
      : <div></div>
    }
    {(quizState === 'answer')
      ? <Card>
          <CardHeader
            title={'Correct Answers:'}
          >
          </CardHeader>
          <CardContent>
            {questionAnswers.map((questionid: string, index: number) => (
              <div key={index}>
                <p>Option {questionid}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      : <div></div>
    }
    {(quizState === 'complete')
      ? <Card>
          <CardContent>
            <CardHeader
              title={'Quiz closed'}
              subheader={'Your Results:'}
            ></CardHeader>
            {playerResults.map((questionResult: string, index: number) => (
              <div key={index}>
                <p>{questionResult}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      : <div></div>
    }
    </>
  )
}

export default PlayerSession
