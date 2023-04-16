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
import AddIcon from '@mui/icons-material/Add';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { makeStyles } from '@material-ui/core/styles';
import QuestionForm from './QuestionForm';

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
});

function QuizList ({ items, heading }: Props) {
  const [quizzes, setQuizzes] = React.useState<any[]>([...items]);
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const style = useStyles();

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    setQuizzes([...items]);
  }, [items]);

  const handleEditClick = (quizid: number) => {
    console.log('edit ' + quizid)
    console.log('go to edit page')
    navigate(`/editGame/${quizid}`)
  };

  const handleDeleteClick = (quizId: number) => {
    deleteQuiz(quizId);
    setQuizzes(quizzes.filter((item) => item.id !== quizId));
    console.log('delete quiz id: ' + quizId)
  };

  async function deleteQuiz (quizId: number) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    const data = await response.json();
    console.log(data);
  }

  return (
    <>
    <h1>{heading}</h1>
    {quizzes.length === 0 && <p>No Quiz found</p>}
    <ul className="list-group">
        {quizzes.map((quizzes, index) => (
        <Card key={index}>
        <CardHeader
            action={
              <IconButton aria-label="settings">
                  <AddIcon/>
              </IconButton>
            }
            title={quizzes.name}
            subheader={quizzes.owner}
        />
        <CardMedia
          component="img"
          alt='green_igloo'
          height="50"
          image={quizzes.thumbnail}
        />
          <CardContent sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <AccessTimeFilledIcon />
        </CardContent>
        <CardActions>
            <IconButton title="Edit the Quiz" className={style.icon} onClick={() => handleEditClick(quizzes.id)}>
              <EditIcon />
            </IconButton>
              <IconButton title="Delete the Quiz" className={style.icon} onClick={() => handleDeleteClick(quizzes.id)}>
              <DeleteIcon />
            </IconButton>
        </CardActions>
        </Card>))}
    </ul>
    </>
  )
}

export default QuizList
