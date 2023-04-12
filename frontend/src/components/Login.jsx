import React from 'react';

function Login (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function loginUser () {
    fetch('http://localhost:5005/admin/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
    console.log(email, password)
  }

  return (
    <>
      <div className='auth-div'>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor='email'>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' name='email' id='email' />
          <label htmlFor='password'>Password: </label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} name='password' id='password' />
          <button className="auth-button" type='submit'>Login</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don&lsquo;t have accounts? Register here</button>
      </div>
    </>
  );
}

export default Login;
