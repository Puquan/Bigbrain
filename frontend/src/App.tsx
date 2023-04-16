import React from 'react';
import Login from './components/Login'
import Register from './components/Register';
import Alert from './components/Alert';
import DashBoard from './components/DashBoard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  useNavigate,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';
import { Edit } from '@mui/icons-material';
import EditGame from './components/EditGame';
import QuestionForm from './components/QuestionForm';

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

  const onSaveGame = () => {
    navigate('/dashboard');
  }

  return (
    <>
    <Routes>
      <Route path='/' element={<Login onSubmit={manageTokenSet} />} />
      <Route path='/register' element={<Register onSubmit={manageTokenSet} /> } />
        {token && <Route path='/dashboard/*' element={<DashBoard token={token} />} />}
      <Route path='/editGame/:id' element={<EditGame/>}/>
      <Route path='/questionForm/:quizId/:questionId' element={<QuestionForm/>} />
    </Routes>
    </>
  );
}

export default App;
