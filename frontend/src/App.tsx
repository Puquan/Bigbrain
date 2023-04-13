import React from 'react';
import Login from './components/Login'
import Register from './components/Register';
import Alert from './components/Alert';
import DashBoard from './components/DashBoard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from './components/ListGroup';
import Book from './components/Book';
import About from './components/About';
import {
  useNavigate,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';

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
      <Route path='/dashboard' element={<DashBoard token={token} />} />
    </Routes>
    </>
  );
}

export default App;
