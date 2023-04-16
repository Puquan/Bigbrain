import React from 'react'
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

function QuizCards ({ items, heading }: Props) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const [quizzes, setQuizzes] = React.useState<any[]>([...items]);

  React.useEffect(() => {
    setQuizzes([...items]);
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
    console.log(e.currentTarget.innerText)
    setSelectedIndex(index);
  }

  const handleEditClick = () => {
    console.log('edit')
  };

  const handleDeleteClick = (quizId: number) => {
    deleteQuiz(quizId);
    setQuizzes(quizzes.filter((item) => item.id !== quizId));
    console.log('delete')
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
            {quizzes.length === 0 && <p>No items found</p>}
            <ul className="list-group">
                {quizzes.map((quizzes, index) => (
                    <li key={quizzes.id} className={
                        selectedIndex === index ? 'list-group-item active' : 'list-group-item list-group-item-action'}
                        onClick={(event) => handleClick(event, index)}>
                        {quizzes.name}
                        <Avatar
                            alt={'./alt.png'}
                            src={quizzes.thumbnail} />
                        <EditIcon onClick={handleEditClick} />
                        <DeleteIcon onClick={() => handleDeleteClick(quizzes.id)} />
                    </li>))}
            </ul>
        </>
  )
}

export default QuizCards
