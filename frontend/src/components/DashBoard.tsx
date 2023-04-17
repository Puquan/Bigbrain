import React from 'react';
import Navbar from './Navbar';
import QuizList from './QuizList';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Alert from './Alert';
import {
  useNavigate,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';

interface Props {
    token: null | string;
}

interface data {
  id: number;
  createdAt: string;
  name: string;
  thumbnail: string;
  owner: string;
  active: boolean | null;
  oldSessions: any[];
  questions: any[];
}

function DashBoard ({ token }: Props) {
  const [quizzes, setQuizzes] = React.useState<data[]>([]);
  const [first, setFirst] = React.useState(true);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [createWindowVisible, setCreateWindowVisible] = React.useState(false);
  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizNameInput, setQuizNameInput] = React.useState('');
  const [session, setSession] = React.useState<any>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchAllQuizzes();
  }, [newGameShow]);

  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    setQuizzes(data.quizzes);
    setSession(data);
    setFirst(false);
  }

  async function CreateQuiz (quizName: string) {
    const response = await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: quizName,
      }),
    })
    const data = await response.json();
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
      return;
    }
    fetchAllQuizzes();
    setNewGameShow(true);
  }

  const handleTestclick = () => {
    console.log(session);
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuizNameInput(event.target.value);
  }

  const handleSendClick = () => {
    console.log(quizNameInput);
    if (!quizNameInput) {
      setAlertVisible(true);
      setErrorMessages(['Please enter the game name']);
      setCreateWindowVisible(false);
      return;
    }
    CreateQuiz(quizNameInput);
    setCreateWindowVisible(false);
    setQuizNameInput('');
  }

  const handleCreateGameClick = () => {
    setCreateWindowVisible(!createWindowVisible);
  }

  return (
    <>
    <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
    <Navbar/>
      <div className='dashboard'>
        <Button variant="contained" data-testid="create-new-quiz" onClick={handleCreateGameClick}>Create Quiz</Button>
        { createWindowVisible && <div className="createWindow">
          <TextField
            helperText="Please enter the game name"
            id="demo-helper-text-aligned"
            label="Game"
            onChange={handleTextFieldChange}>
          </TextField>
          <Button onClick={handleSendClick} variant="contained" endIcon={<SendIcon />} id='send-quizName'>
            Send
          </Button>
        </div>
        }
      </div>
      <button className='test' onClick={handleTestclick}> Test </button>
    {!first && <QuizList items={quizzes} heading='Your Quiz List'/>}
    </>
  );
}

export default DashBoard;
