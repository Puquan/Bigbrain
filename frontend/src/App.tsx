import React from 'react';
import Login from './components/Login'
import Register from './components/Register';
import Alert from './components/Alert';
import DashBoard from './components/DashBoard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

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
      console.log('111')
    } else {
      setToken(null);
      console.log('222' + token)
    }
  });

  if (token) {
    console.log('333')
    console.log(token)
  }

  if (token === null) {
    return (
      <>
        <div className='auth-page'>
          {
            currentForm === 'login' ? <Login onFormSwitch={toggleForm} onSubmit={manageTokenSet} /> : <Register onFormSwitch={toggleForm} onSubmit={manageTokenSet} />
          }
        </div>
      </>
    );
  } else {
    return (
      <DashBoard token={token} />
    );
  }
}

export default App;
