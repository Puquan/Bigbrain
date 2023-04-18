import { TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import React from 'react'

interface Props {
  quizId: string;
  onSubmit: (data: boolean) => void;
}

function EditBox ({ quizId, onSubmit }: Props) {
  const [quizName, setQuizName] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [thumbnailName, setThumbnailName] = React.useState('');

  async function updateQuiz () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        question: [{}],
        name: quizName,
        thumbnail,
      }),
    })
    const data = await response.json();
    console.log(data);
  }

  function handleImageChange (event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
      setThumbnailName(file.name);
    }
  }

  function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuiz();
    onSubmit(true);
  }

  return (
      <div className="EditGameBox">
          <Typography variant="h6">Edit Game</Typography>
          <form onSubmit={handleSubmit} >
              <TextField
                  style={{ width: '10em', margin: '1em' }}
                  type="text"
                  label="Game Name"
                  variant="outlined"
                  value={quizName}
                  onChange={(event) => setQuizName(event.target.value)}
              />
              <br />
              <IconButton color="primary" aria-label="upload picture" component="label">
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                  <PhotoCamera />
              </IconButton>
              <br />
              {thumbnail && <img width='100' src={thumbnail} alt="thumbnail" />}
              <br />
              {thumbnailName && <Typography variant="body2">{thumbnailName}</Typography>}
              <br />
              <Button type='submit' variant="contained" color="primary">
                  save
              </Button>
          </form>
      </div>
  )
}

export default EditBox
