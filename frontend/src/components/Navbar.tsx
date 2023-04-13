import React from 'react';
import { Link } from 'react-router-dom';

function Navbar () {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
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
