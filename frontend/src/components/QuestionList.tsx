import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

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
}

function QuestionList ({ game }: Props) {
  const [gameName, setGameName] = React.useState(game.name);
  const [gameThumbnail, setGameThumbnail] = React.useState(game.thumbnail);
  const [gameQuestions, setGameQuestions] = React.useState(game.questions);

  React.useEffect(() => {
    setGameName(game.name);
    setGameThumbnail(game.thumbnail);
    setGameQuestions(game.questions);
  }, [game]);

  return (
    <>
      <Card>
        <CardHeader
          title= {gameName} />
        <CardContent>
          <CardMedia
            component="img"
            alt='Do not have a Thumbnail yet'
            height="50"
            image={gameThumbnail}
          />
          {gameQuestions.map((question: Question) => {
            return (
              <div key={question.id}>
                <p>{question.name}</p>
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
