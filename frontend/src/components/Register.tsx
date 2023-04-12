import React from 'react';

interface Props {
  onFormSwitch: (formName: string) => void;
}

function Register ({ onFormSwitch }: Props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');

  const handleSubmit = () => {
    console.log('test');
  };

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
          <button className="auth-button" type='submit'>Login</button>
        </form>
        <button className="link-btn" onClick={() => onFormSwitch('login')}>Already have an account? Log In here!</button>
      </div>
    </>
  );
}

export default Register;
