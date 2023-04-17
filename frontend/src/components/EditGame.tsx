import {
  Typography,
  TextField,
  Button,
  Box,
  ButtonGroup,
} from '@mui/material'
import QuestionList from './QuestionList';
import EditBox from './EditBox';
import { useNavigate, useParams } from 'react-router-dom'
import * as React from 'react';
import Alert from './Alert';
import Navbar from './Navbar';
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

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
}

interface Game {
  active: null | boolean;
  createdAt: string;
  id: number;
  name: string;
  oldSessions: any[];
  thumbnail: string;
  questions: Question[];
}

function EditGame () {
  const param = useParams();
  const navigate = useNavigate();
  const [id, setId] = React.useState<any>('');
  const [quiz, setQuiz] = React.useState<any>([]);
  const [first, setFirst] = React.useState(true);
  const [game, setGame] = React.useState<Game>({
    active: null,
    createdAt: '',
    id: 0,
    name: '',
    oldSessions: [],
    thumbnail: '',
    questions: [],
  });
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [editQuiz, setEditQuiz] = React.useState(false);
  const [showQuestionList, setShowQuestionList] = React.useState(false);

  React.useEffect(() => {
    setId(param.id);
    fetchQuizbyId(id);
  }, [showQuestionList]);

  async function fetchQuizbyId (id: string | number) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    const data = await response.json();
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
      return;
    }
    setQuiz(data);
    setFirst(false);
    setShowQuestionList(true);
  }

  const handleDeleteClick = (quizId: undefined | string) => {
    deleteQuiz(quizId);
    navigate('/dashboard');
  };

  const handleAddQuestionClick = (quizId: undefined | string, questionId: undefined | number) => {
    navigate(`/questionForm/${quizId}/${questionId}/create`);
  };

  const handleEditQuizClick = () => {
    setEditQuiz(!editQuiz);
  };

  async function deleteQuiz (quizId: undefined | string) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'DELETE',
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
  }

  React.useEffect(() => {
    fetchQuizbyId(id);
  }, [id, editQuiz]);

  React.useEffect(() => {
    setGame((prev) => ({ ...prev, name: quiz.name }));
    setGame((prev) => ({ ...prev, thumbnail: quiz.thumbnail }));
    setGame((prev) => ({ ...prev, active: quiz.active }));
    setGame((prev) => ({ ...prev, id }));
    setGame((prev) => ({ ...prev, createdAt: quiz.createdAt }));
    setGame((prev) => ({ ...prev, oldSessions: quiz.oldSessions }));
  }, [first, quiz, id]);

  const handleSubmit = (editQuiz: boolean) => {
    setEditQuiz(!editQuiz);
  }

  return (
    <>
      <Navbar />
      <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button color='success' startIcon={<AddIcon />} onClick={() => handleAddQuestionClick(param.id, game.questions.length)} >Add Question</Button>
        <Button startIcon={<EditIcon />} onClick={handleEditQuizClick} >Edit GAME Profile</Button>
        <Button color='error' startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(param.id)} >Delete Quiz</Button>
      </ButtonGroup>
      <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
      {showQuestionList && <QuestionList game={quiz} quizId={id} />}
      {editQuiz && <EditBox quizId={id} onSubmit={() => handleSubmit(editQuiz)}/>}
    </>
  );
}

export default EditGame;
