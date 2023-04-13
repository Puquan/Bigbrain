import React from 'react';
import Navbar from './Navbar';

interface Props {
    token: null | string;
}

function DashBoard ({ token }: Props) {
  const [quizzes, setQuizzes] = React.useState([]);

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

  const handleTestclick = () => {
    console.log('test')
    fetchAllQuizzes();
    console.log(quizzes)
  }

  return (
    <>
    <Navbar/>
      <div className='dashboard'>
        <h1>Dashboard</h1>
      </div>
      <button className='test' onClick={handleTestclick}> Test </button>
    </>
  );
}

export default DashBoard;
