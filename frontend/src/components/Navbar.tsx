import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar () {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <nav className='navbar'>
        <a className='bigbrain-titile'>
            Big Brain
        </a>
      <ul>
        <li>
            <a>Create Quiz</a>
        </li>
        <li>
            <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
        </nav>
    </>
  );
}

export default Navbar;
