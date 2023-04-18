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
        setTimer(Number(data.question.timeLimit));
      }
      setCurrentQuestion(data.question);
    } else {
      setQuizState('complete')
    }
  }

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

  console.log(playerResults)

  const handleTestclick = () => {
    startedQuiz();
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
      // reset highlighted answers for next question
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
      console.log(timer);
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
            <button onClick={handleTestclick}>Test</button>
        </CenterContainer>
    }
    {(quizState === 'quiz' && currentQuestion.length !== 0)
      ? <CenterContainer>
          <Card>
            <CardHeader
              title={`Question: ${currentQuestion.question}`}
              subheader={currentQuestion.questionType}
            />
            <p>Timer [Seconds]: {timer}</p>
            <CardMedia
              component="img"
              height="200"
              image={currentQuestion.image}
              alt="Question Image"
            />
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
