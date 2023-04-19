import React from 'react';
import Login from './components/Login'
import Register from './components/Register';
import DashBoard from './components/DashBoard';
import './App.css';
import QuizResult from './components/QuizResult';
import QuestionFormEdit from './components/QuestionFormEdit';
import {
  Navigate,
  useNavigate,
  Routes,
  Route,
} from 'react-router-dom';
import EditGame from './components/EditGame';
import QuestionForm from './components/QuestionForm';
import PlayerJoin from './components/PlayerJoin';
import PlayerSession from './components/PlayerSession';

function App () {
  const [token, setToken] = React.useState<null | string>(null);
  const navigate = useNavigate();

  function manageTokenSet (token: string) {
    setToken(token);
    localStorage.setItem('token', token);
    navigate('/dashboard');
  }

  React.useEffect(function () {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    } else {
      setToken(null);
    }
  }, [token]);

  return (
    <>
    <Routes>
      <Route path='/' element={<Login onSubmit={manageTokenSet} />} />
      <Route path='/register' element={<Register onSubmit={manageTokenSet} /> } />
        {token && <Route path='/dashboard/*' element={<DashBoard token={token} />} />}
      <Route path='/editGame/:id' element={<EditGame />}/>
      <Route path='/questionForm/:quizId/:questionId/create' element={<QuestionForm />} />
      <Route path='/quizResult/:quizId/:sessionId' element={<QuizResult />} />
      <Route path='/questionForm/:quizId/:questionId/edit' element={<QuestionFormEdit />} />
      <Route path="/playerjoin" element={<PlayerJoin />} />
      <Route path="/playerjoin/:playerId/:sessionid" element={<PlayerSession />} />
    </Routes>
    </>
  );
}

export default App;
