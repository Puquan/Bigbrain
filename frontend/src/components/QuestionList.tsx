import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from './Alert';

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

interface Props {
  game: Game;
  quizId: string;
}

const useStyles = makeStyles({
  icon: {
    '&:hover': {
      color: 'blue',
      backgroundColor: 'transparent',
    },
  },
});

function QuestionList ({ game, quizId }: Props) {
  const [gameName, setGameName] = React.useState(game.name);
  const [ErrorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [gameThumbnail, setGameThumbnail] = React.useState(game.thumbnail);
  const [gameQuestions, setGameQuestions] = React.useState(game.questions);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const navigate = useNavigate();
  const style = useStyles();

  async function DeleteQuestion () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        questions: gameQuestions,
      }),
    })
    const data = await response.json();
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
    }
  }

  React.useEffect(() => {
    setGameName(game.name);
    setGameThumbnail(game.thumbnail);
    setGameQuestions(game.questions);
  }, [game]);

  const handleEditClick = (questionId: string | number) => {
    console.log('go to edit page');
    navigate(`/questionForm/${quizId}/${questionId}/edit`)
  };

  const handleDeleteClick = (questionId: string | number) => {
    console.log(questionId);
    console.log('delete');
    setGameQuestions(gameQuestions.filter((question) => question.questionId !== questionId));
  };

  React.useEffect(() => {
    if (gameQuestions) {
      DeleteQuestion();
    }
  }, [gameQuestions]);

  return (
    <>
      <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{ErrorMessages}</Alert>} </div>
      <Card>
        <CardHeader
          title= {gameName} />
        <CardContent>
          <CardMedia
            component="img"
            alt='Do not have a Thumbnail yet!'
            height="50"
            image={gameThumbnail}
          />
          {gameQuestions && gameQuestions.map((question: any, index) => {
            return (
              <div key={question.questionId}>
                <Typography>{'Question' + (index + 1)}: {question.question}</Typography>
                <IconButton data-testid={`edit${question.questionId}`} title="Edit the Quiz" className={style.icon} onClick={() => handleEditClick(question.questionId)}>
                  <EditIcon />
                </IconButton>
                <IconButton data-testid={`delete${question.questionId}`} title="Delete the Quiz" className={style.icon} onClick={() => handleDeleteClick(question.questionId)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            )
          })
          }
        </CardContent>
      </Card>
    </>
  )
}

export default QuestionList
