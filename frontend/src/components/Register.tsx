import React, { FormEvent } from 'react';
import Alert from './Alert';

interface Props {
  onFormSwitch: (formName: string) => void;
  onSubmit: (data: string) => void;
}

function Register ({ onFormSwitch, onSubmit }: Props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password || !username) {
      setAlertVisible(true);
      setErrorMessages(['Please enter your email, username and password']);
      return;
    }
    handleRegister();
  };

  const handleRegister = async () => {
    const res = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
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
        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor='username'>Username: </label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' name='username' id='username' />
          <label htmlFor='email'>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' name='email' id='email' />
          <label htmlFor='password'>Password: </label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} name='password' id='password' />
          <button className="auth-button" type='submit'>Register</button>
        </form>
        <button className="link-btn" onClick={() => onFormSwitch('login')}>Already have an account? Log In here!</button>
      </div>
      <div className='errorWindow'> {alertVisible && <Alert onClose={() => setAlertVisible(false)}>{errorMessages}</Alert>} </div>
    </>
  );
}

export default Register;
