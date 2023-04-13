import React from 'react';

function Navbar () {
  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return (
    <>
      <nav className='navbar'>
        <a href="/" className='bigbrain-titile'>
            Big Brain
        </a>
      <ul>
        <li>
            <a href="/create" >Create Quiz</a>
        </li>
        <li>
            <a href="/logout" onClick={handleLogout}>Logout</a>
        </li>
      </ul>
        </nav>
    </>
  );
}

export default Navbar;
