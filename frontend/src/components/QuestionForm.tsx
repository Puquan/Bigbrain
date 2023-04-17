import React, { useState } from 'react';
import Navbar from './Navbar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, FormControlLabel, IconButton, Radio, RadioGroup } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Alert from './Alert';
import { PhotoCamera } from '@mui/icons-material';

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
  questionId: number;
  questionType: string;
  question: string;
  timeLimit: string;
  points: string;
  url: string;
  answerOptions: AnswerOption[];
  image: string;
}

const initialAnswerOptions: AnswerOption[] = [
  { id: 1, value: '', isCorrect: false },
  { id: 2, value: '', isCorrect: false },
];

const initialQuestion: Question = {
  questionId: 0,
  questionType: '',
  question: '',
  timeLimit: '',
  points: '',
  url: '',
  answerOptions: [],
  image: '',
};

function QuestionForm () {
  const classes = useStyles();
  const param = useParams();
  const navigate = useNavigate();
  const [questionId, setQuestionId] = React.useState<number>(Date.now());
  const [questionType, setQuestionType] = React.useState('single-choice');
  const [question, setQuestion] = React.useState('');
  const [timeLimit, setTimeLimit] = React.useState<string>('');
  const [points, setPoints] = React.useState<string>('');
  const [url, setUrl] = React.useState('');
  const [answerOptions, setAnswerOptions] = React.useState<AnswerOption[]>(initialAnswerOptions);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(true);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [QuestionfromDB, setQuestionfromDB] = React.useState<any>(null);
  const [image, setImage] = React.useState('');
  const [imageName, setImageName] = React.useState('');
  const [IsAnswerCompleted, setIsAnswerCompleted] = React.useState(false);
  const [IsRequireCompleted, setIsRequireCompleted] = React.useState(false);
  const [newQuestion, setNewQuestion] = React.useState<Question>(initialQuestion);
  const [first, setFirst] = React.useState(true);

  React.useEffect(() => {
    if (param.quizId) {
      fetchQuizbyId(param.quizId);
      setNewQuestion({ questionId, questionType, question, timeLimit, points, url, answerOptions, image });
    }
  }, []);

  React.useEffect(() => {
    setNewQuestion({ questionId, questionType, question, timeLimit, points, url, answerOptions, image });
  }, [questionId, questionType, question, timeLimit, points, url, answerOptions, image, imageName, IsAnswerCompleted, IsRequireCompleted]);

  React.useEffect(() => {
    if (QuestionfromDB) {
      if (first) {
        setQuestionfromDB((prevState: any) => [...prevState, newQuestion]);
        setFirst(false);
      } else {
        const updatedQuestions = [...QuestionfromDB];
        updatedQuestions[updatedQuestions.length - 1] = newQuestion;
        setQuestionfromDB(updatedQuestions);
      }
    }
  }, [newQuestion]);

  const handleRequireValidation = () => {
    let isComplete = true;
    const requiredFields = [question, timeLimit, points];

    requiredFields.forEach(field => {
      if (!field) {
        isComplete = false;
      }
    });
    setIsRequireCompleted(isComplete);
  };

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

  async function createQuestion () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${param.quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        questions: QuestionfromDB,
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
    if (questionType === 'multiple-choice') {
      const isCorrectAnswerSelected = answerOptions.some(
        option => option.isCorrect
      );
      if (!isCorrectAnswerSelected) {
        setAlertVisible(true);
        setErrorMessages(['Please select at least one correct answer']);
        return;
      }
    }
    if (IsRequireCompleted === false || IsAnswerCompleted === false) {
      setAlertVisible(true);
      setErrorMessages(['Please fill all required fields']);
      return;
    }
    createQuestion();
    navigate(`/editGame/${param.quizId}`);
  }

  function handleImageChange (event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageName(file.name);
    }
  }

  const handleValidation = () => {
    const isComplete = answerOptions.every(option => option.value !== '');
    setIsAnswerCompleted(isComplete);
  }

  return (
    <>
    <Navbar />
    <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
    <Box className={classes.root}>
      <Typography variant="h6">Create a Question</Typography>
      <FormControl className={classes.formControl}>
          <RadioGroup
            aria-label="question-type"
            defaultValue="single-choice"
            name="question-type"
            value={questionType}
            onChange={event => setQuestionType(event.target.value)}
          >
            <FormControlLabel value="single-choice" control={<Radio />} label="Single Choice" />
            <FormControlLabel value="multiple-choice" control={<Radio />} label="Multiple Choice" />
          </RadioGroup>
          </FormControl>
            <TextField
                required
                variant="outlined"
                id="outlined-required"
                className={classes.element}
                label="Question"
                value={question}
                onChange={event => setQuestion(event.target.value)}
                onBlur={handleRequireValidation}
            />
            <TextField
                required
                variant="outlined"
                id="outlined-required"
                className={classes.element}
                label="Time Limit/ min"
                value={timeLimit}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                onChange={event => setTimeLimit(event.target.value)}
                onBlur={handleRequireValidation}
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
                onBlur={handleRequireValidation}
            />
            <TextField
                variant="outlined"
                id="outlined-required"
                className={classes.element}
                label="URL"
                value={url}
                onChange={event => setUrl(event.target.value)}
            />
            <IconButton color="primary" aria-label="upload picture" component="label">
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              <PhotoCamera />
            </IconButton>
            <br />
            {image && <img width='100' src={image} alt="image" />}
            {imageName && <Typography variant="body2">{imageName}</Typography> && <br/>}
            {answerOptions.map(option => (
              <div key={option.id}>
                <TextField
                    required
                    variant="outlined"
                    className={classes.element}
                    key={option.id}
                    label={`Answer Option ${option.id}`}
                    value={option.value}
                    onChange={event => handleAnswerOptionChange(option.id, event.target.value)}
                    onBlur={handleValidation}
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
}

export default QuestionForm;
