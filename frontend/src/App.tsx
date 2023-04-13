import React from 'react';
import Login from './components/Login'
import Register from './components/Register';
import Alert from './components/Alert';
import DashBoard from './components/DashBoard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams
} from 'react-router-dom';

function App () {
  const [currentForm, setCurrentForm] = React.useState('login');
  const [token, setToken] = React.useState<null | string>(null);

  const toggleForm = (formName: string) => {
    setCurrentForm(formName);
  }

  function manageTokenSet (token: string) {
    setToken(token);
    localStorage.setItem('token', token);
  }

  React.useEffect(function () {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    } else {
      setToken(null);
    }
  }, [token]);

  if (token === null) {
    return (
      <>
        <Router>
          <div className='auth-page'>
            {
              currentForm === 'login' ? <Link to='/login' style={{ textDecoration: 'none', color: 'white' }}><Login onFormSwitch={toggleForm} onSubmit={manageTokenSet} /></Link> : <Link to='/register' style={{ textDecoration: 'none', color: 'white' }}><Register onFormSwitch={toggleForm} onSubmit={manageTokenSet}/></Link>
            }
          </div>
        </Router>
      </>
    );
  } else {
    return (
      <DashBoard token={token} />
    );
  }
}

export default App;
