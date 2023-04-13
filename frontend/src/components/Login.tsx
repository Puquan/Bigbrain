import React, { FormEvent } from 'react';
import Alert from './Alert';

interface Props {
  onFormSwitch: (formName: string) => void;
  onSubmit: (data: string) => void;
}

function Login ({ onFormSwitch, onSubmit }: Props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setAlertVisible(true);
      setErrorMessages(['Please enter your email and password']);
      return;
    }
    handleLogin();
  };

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await res.json();
    if (data.error) {
      setAlertVisible(true);
      setErrorMessages(data.error);
      return;
    }
    onSubmit(data.token);
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
        <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
        <button className="link-btn" onClick={() => onFormSwitch('register')}>Don&lsquo;t have accounts? Register here</button>
      </div>
    </>
  );
}

export default Login;
