import React from 'react';
import Login from './page/Login'
import Register from './page/Register';
import DashBoard from './page/DashBoard';
import './App.css';
import QuizResult from './components/QuizResult';
import QuestionFormEdit from './page/QuestionFormEdit';
import {
  useNavigate,
  Routes,
  Route,
} from 'react-router-dom';
import EditGame from './page/EditGame';
import QuestionForm from './page/QuestionForm';
import PlayerJoin from './page/PlayerJoin';
import PlayerSession from './page/PlayerSession';

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
