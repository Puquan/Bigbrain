import React from 'react';
import Login from './components/Login'
import Register from './components/Register';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

function App () {
  const [currentPage, setCurrentPage] = React.useState('login');
  const test = 1;

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
