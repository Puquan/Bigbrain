import React from 'react';
import Login from './components/Login'
import Register from './components/Register';
import Alert from './components/Alert';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App () {
  const [currentForm, setCurrentForm] = React.useState('login');

  const toggleForm = (formName:string) => {
    setCurrentForm(formName);
  }

  return (
    <>
      <div className='auth-page'>
       {
      currentForm === 'login' ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
       }
      </div>
    </>
  );
}

export default App;
