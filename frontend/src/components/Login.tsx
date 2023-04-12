import React, { FormEvent } from 'react';

interface Props {
  onFormSwitch: (formName: string) => void;
}

function Login ({ onFormSwitch }: Props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(password, email);
  };

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
        <button className="link-btn" onClick={() => onFormSwitch('register')}>Don&lsquo;t have accounts? Register here</button>
      </div>
    </>
  );
}

export default Login;
