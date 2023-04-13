import React, { FormEvent } from 'react';
import Alert from './Alert';
import { useNavigate } from 'react-router-dom';

interface Props {
  onSubmit: (data: string) => void;
}

function Login ({ onSubmit }: Props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log('submitting');
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
      <div className='auth-page'>
        <div className='auth-div'>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor='email'>Email: </label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' name='email' id='email' />
            <label htmlFor='password'>Password: </label>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} name='password' id='password' />
            <button className="auth-button" type='submit'>Login</button>
          </form>
          <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
          <button className="link-btn" onClick={() => navigate('/register')}>Don&lsquo;t have accounts? Register here</button>
        </div>
      </div>
    </>
  );
}

export default Login;
