import React, { useState } from 'react';
import Navbar from './Navbar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import Alert from './Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(10),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    element: {
      marginBottom: theme.spacing(2),
    },
    selectEmpty: {
      marginTop: theme.spacing(5),
    },
  })
);

interface AnswerOption {
    id: number;
    value: string;
    isCorrect: boolean;
}

interface Question {
  id: string;
  name: string;
  isMultipleChoice: boolean;
  answers: AnswerOption[];
  timeLimit: number;
  points: number;
}

const initialAnswerOptions: AnswerOption[] = [
  { id: 1, value: '', isCorrect: false },
  { id: 2, value: '', isCorrect: false },
];

const QuestionForm: React.FC = () => {
  const classes = useStyles();
  const param = useParams();
  const [questionType, setQuestionType] = useState('');
  const [question, setQuestion] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [points, setPoints] = useState('');
  const [url, setUrl] = useState('');
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>(initialAnswerOptions);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(true);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [QuestionfromDB, setQuestionfromDB] = React.useState<any>([]);

  async function fetchQuizbyId (id: string | number) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    const data = await response.json();
    setQuestionfromDB(data.questions);
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
    }
  }

  React.useEffect(() => {
    if (param.quizId) {
      fetchQuizbyId(param.quizId);
    }
    console.log(QuestionfromDB);
  }, []);

  React.useEffect(() => {
    if (answerOptions.length === 6) {
      setIsAddButtonDisabled(true);
    } else {
      setIsAddButtonDisabled(false);
    }
    if (answerOptions.length === 2) {
      setIsRemoveButtonDisabled(true);
    } else {
      setIsRemoveButtonDisabled(false);
    }
  }, [answerOptions]);

  const handleAnswerOptionChange = (id: number, value: string) => {
    setAnswerOptions(prevState =>
      prevState.map(option => (option.id === id ? { ...option, value } : option))
    );
  };

  const handleAddAnswerOption = () => {
    setAnswerOptions(prevState => [
      ...prevState,
      { id: prevState.length + 1, value: '', isCorrect: false },
    ]);
  };

  const handleRemoveAnswerOption = () => {
    setAnswerOptions(prevState => prevState.slice(0, -1));
  };

  const handleAnswerOptionChangeCheckbox = (id: number) => {
    setAnswerOptions(prevState =>
      prevState.map(option =>
        option.id === id ? { ...option, isCorrect: !option.isCorrect } : option
      )
    );
  };

  async function updateQuestion () {
    setQuestionfromDB((prevState: any) => [...prevState, {
      questionType: questionType,
      question: question,
      timeLimit: timeLimit,
      points: points,
      url: url,
      answerOptions: answerOptions
    }]);
    const response = await fetch(`http://localhost:5005/admin/quiz/${param.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        question: QuestionfromDB,
      }),
    })
    const data = await response.json();
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
    }
  }

  const handleCreateClick = () => {
    if (questionType === 'single-choice') {
      const isCorrectAnswerSelected = answerOptions.some(
        option => option.isCorrect
      );
      if (!isCorrectAnswerSelected) {
        setAlertVisible(true);
        setErrorMessages(['Please select a correct answer']);
        return;
      }
    }
    updateQuestion();
  }

  return (
    <>
    <Navbar />
    <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
    <Box className={classes.root}>
      <Typography variant="h6">Create a Question</Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="question-type-select-label" required shrink variant='outlined'>Question Type</InputLabel>
          <Select
            labelId="question-type-select-label"
            variant="outlined"
            id="question-type-select"
            value={questionType}
            onChange={event => setQuestionType(event.target.value as string)}
          >
          <MenuItem value="single-choice">Single Choice</MenuItem>
          <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
          </Select>
          </FormControl>
            <TextField
                required
                variant="outlined"
                id="outlined-required"
                className={classes.element}
                label="Question"
                value={question}
                onChange={event => setQuestion(event.target.value)}
            />
            <TextField
                required
                variant="outlined"
                id="outlined-required"
                className={classes.element}
                label="Time Limit"
                value={timeLimit}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                onChange={event => setTimeLimit(event.target.value)}
            />
            <TextField
                required
                variant="outlined"
                id="outlined-required"
                className={classes.element}
                label="Points"
                value={points}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                onChange={event => setPoints(event.target.value)}
            />
            <TextField
                variant="outlined"
                id="outlined-required"
                className={classes.element}
                label="URL"
                value={url}
                onChange={event => setUrl(event.target.value)}
            />
            {answerOptions.map(option => (
              <div key={option.id}>
                <TextField
                    variant="outlined"
                    className={classes.element}
                    key={option.id}
                    label={`Answer Option ${option.id}`}
                    value={option.value}
                    onChange={event => handleAnswerOptionChange(option.id, event.target.value)}
                />
                <br />
                <Typography>Correct Answer?<Checkbox checked={option.isCorrect} onClick={() => handleAnswerOptionChangeCheckbox(option.id)}/></Typography>
              </div>
            ))}
    </Box>
      <div className='button-group'>
        <IconButton disabled={isAddButtonDisabled} onClick={handleAddAnswerOption} ><AddIcon /></IconButton>
        <IconButton disabled={isRemoveButtonDisabled} onClick={handleRemoveAnswerOption}><RemoveIcon /> </IconButton>
      </div>
      <div className='button-group' >
      <Button variant="contained" color="primary" onClick={handleCreateClick}>Create</Button>
      </div>
    </>
  );
};

export default QuestionForm;
