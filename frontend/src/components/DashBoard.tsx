import React from 'react';
import Navbar from './Navbar';
import QuizList from './QuizList';

interface Props {
    token: null | string;
}

function DashBoard ({ token }: Props) {
  const [quizzes, setQuizzes] = React.useState<any[]>([]);
  const [quizName, setQuizName] = React.useState<any []>([]);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [newGameShow, setNewGameShow] = React.useState(false);
  const items = ['An item', 'An item', 'A third item', 'A fourth item', 'And a fifth one']

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
  }

  React.useEffect(() => {
    fetchAllQuizzes();
  }, []);

  React.useEffect(() => {
    if (quizzes.length !== 0) {
      for (let i = 0; i < quizzes.length; i++) {
        setQuizName(quizName => [...quizName, quizzes[i].name]);
      }
    }
  }, [quizzes]);

  const handleTestclick = () => {
    setNewGameShow(!newGameShow);
  }

  return (
    <>
    <Navbar/>
      <div className='dashboard'>
        <h1>Dashboard</h1>
      </div>
      <button className='test' onClick={handleTestclick}> Test </button>
      {newGameShow && (
        <>
        <QuizList items={quizName} heading='Quiz'/>
        </>
      )}
    </>
  );
}

export default DashBoard;
