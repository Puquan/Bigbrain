import React from 'react';
import Login from './components/Login'
import Register from './components/Register';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

function App () {
  const [currentPage, setCurrentPage] = React.useState('login');
  const [token, setToken] = React.useState(null);
  const test = 1;

  function manageToken (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }

  function logout () {
    setToken(null);
    localStorage.removeItem('token');
  }

  const togglePage = (page) => {
    setCurrentPage(page);
  }
  if (test === 1) {
    return (
    <div className='App'>
      {currentPage === 'login' ? <Login onFormSwitch={togglePage} /> : currentPage === 'register' ? <Register onFormSwitch={togglePage}/> : <>Dash Borad</>}
    </div>
    );
  } else {
    return (<>DashBoard</>);
  }
}

export default App;
