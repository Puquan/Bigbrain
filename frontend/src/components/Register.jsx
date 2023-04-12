import React from 'react';

function Register (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');

  function registerUser () {
    console.log(email, password, username);
    fetch('http://localhost:5005/admin/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        props.onFormSwitch('dashborad');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  }

  return (
    <>
      <div>
        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor='username'>Username: </label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' name='username' id='username' />
          <label htmlFor='email'>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' name='email' id='email' />
          <label htmlFor='password'>Password: </label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} name='password' id='password' />
          <button className="auth-button" type='submit'>Login</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Log In here!</button>
      </div>
    </>
  );
}

export default Register;
