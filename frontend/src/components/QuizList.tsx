import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Typography } from '@mui/material';
import Alert from './Alert';
import SessionPopUp from './SessionPopUp';
import PauseIcon from '@mui/icons-material/Pause';
import Tooltip from '@mui/material/Tooltip';

interface data {
  id: number;
  createdAt: string;
  name: string;
  thumbnail: string;
  owner: string;
  active: boolean | null;
  oldSessions: any[];
}

interface Props {
  items: data[];
  heading: string;
}

const useStyles = makeStyles({
  icon: {
    '&:hover': {
      color: 'blue',
      backgroundColor: 'transparent',
    },
  },
  card: {
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    background: 'linear-gradient(135deg, #E3E8EF 60%, #FFD8CB 100%)',
  },
  content: {
    display: 'flex',
    justifyContent: 'left',
  },
  timeIcon: {
    marginRight: '4px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  iconButton: {
    '&:hover': {
      color: 'blue',
      backgroundColor: 'transparent',
    },
  },
});

function QuizList ({ items, heading }: Props) {
  const [quizzes, setQuizzes] = React.useState<any[]>([...items]);
  const navigate = useNavigate();
  const [timeCostSum, setTimeCostSum] = React.useState<any[]>([]);
  const [questionNumber, setQuestionNumber] = React.useState<any[]>([]);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [sessionPopUp, setSessionPopUp] = React.useState(false);
  const style = useStyles();
  const [playQuizId, setPlayQuizId] = React.useState<string>('');
  const [sessionId, setSessionId] = React.useState<string>('');
  const [open, setOpen] = React.useState(false);
  const [isStart, setIsStart] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    setQuizzes([...items]);
  }, [items]);

  React.useEffect(() => {
    fetchQuizInformation();
  }, [quizzes]);

  async function fetchQuizInformation () {
    const sumList = [];
    const numberlist = [];
    for (let i = 0; i < quizzes.length; i++) {
      const quizId = quizzes[i].id;
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      const data = await response.json();
      console.log('data', data.questions);
      numberlist.push(data.questions.length);
      let sum = 0;
      if (data.questions.length > 0) {
        for (let j = 0; j < data.questions.length; j++) {
          sum += Number(data.questions[j].timeLimit);
        }
      }
      sumList.push(sum);
    }
    setTimeCostSum([...sumList]);
    setQuestionNumber([...numberlist]);
  }

  async function fetchQuizSession (quizId: number) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    const data = await response.json();
    setSessionId(data.active);
  }

  const handleEditClick = (quizid: number) => {
    console.log('edit ' + quizid)
    console.log('go to edit page')
    navigate(`/editGame/${quizid}`)
  };

  const handleDeleteClick = (quizId: number) => {
    deleteQuiz(quizId);
    setQuizzes(quizzes.filter((item) => item.id !== quizId));
  };

  const handlePlayClick = (quizId: number) => {
    console.log('play ' + quizId)
    setPlayQuizId(quizId.toString());
    startQuiz(quizId);
    fetchQuizSession(quizId);
    setIsStart(true);
    setOpen(true);
    setSessionPopUp(true);
  };

  const handlePauseClick = (quizId: number) => {
    console.log('pause ' + quizId)
    StopQuiz(quizId);
    setOpen(true);
    setIsStart(false);
  };

  async function StopQuiz (quizId: number) {
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
    console.log(data);
  }

  async function startQuiz (quizId: number) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}/start`, {
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
  }

  async function deleteQuiz (quizId: number) {
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

  return (
    <>
    <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h5" component="h5">{heading}</Typography>
    </div>
    {quizzes.length === 0 && <p>No Game found, you can create a game through above button</p>}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyItems: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {quizzes.map((quizzes, index) => (
      <Box key={index} sx={{ width: '100%', maxWidth: '400px', p: '1em' }}>
        <Card key={index} className={style.card}>
        <CardHeader
            data-testid="display-quiz"
            title={quizzes.name}
            subheader={'Total questions: ' + questionNumber[index]}
        />
        <CardMedia
          component="img"
          alt='This quiz has no thumbnail, you can add one by clicking the edit button'
          height="175"
          image={quizzes.thumbnail}
        />
        <CardContent sx={{
          display: 'flex',
          justifyContent: 'left',
        }}>
        <div className="parent">
          <Tooltip title="Total Game Time" arrow>
              <AccessTimeFilledIcon />
          </Tooltip>
          <p>{timeCostSum[index]}</p>
        </div>
        </CardContent>
        <CardActions>
            <Tooltip title="Edit the Game" arrow>
              <IconButton className={style.icon} onClick={() => handleEditClick(quizzes.id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete the Game" arrow>
              <IconButton className={style.icon} onClick={() => handleDeleteClick(quizzes.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Start the Game" arrow>
              <IconButton className={style.icon} onClick={() => handlePlayClick(quizzes.id)} >
                  <PlayArrowIcon data-testid="startquiz" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop the Game" arrow>
              <IconButton className={style.icon} onClick={() => handlePauseClick(quizzes.id)} data-testid="stopquiz">
                <PauseIcon />
              </IconButton>
            </Tooltip>
        </CardActions>
        </Card>
        </Box>))}
        {sessionPopUp && sessionId && <SessionPopUp open={open} handleClose={handleClose} sessionId={sessionId} isStart={isStart} quizId={playQuizId}/>}
    </Box>
    </>
  )
}

export default QuizList
