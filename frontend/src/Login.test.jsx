import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './page/Login';
import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login component', () => {
  const onSubmitMock = jest.fn();

  beforeEach(() => {
    onSubmitMock.mockClear();
  });

  it('renders login form with email and password inputs', () => {
    render(<BrowserRouter>
        <Login onSubmit={onSubmitMock} />
        </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('shows an error message if the user submits the form with empty email and password', async () => {
    render(<BrowserRouter>
            <Login onSubmit={onSubmitMock} />
        </BrowserRouter>
    );
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    await waitFor(() => {
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveTextContent(/please enter your email and password/i);
    });
  });

  it('shows an error message if the user enters incorrect email and password', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: 'Incorrect email or password' }),
      })
    );

    render(<BrowserRouter>
            <Login onSubmit={onSubmitMock} />
        </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveTextContent(/incorrect email or password/i);
    });
  });

  it('calls onSubmit callback with token if the user enters correct email and password', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhheWRlbkB1bnN3LmVkdS5hdSIsImlhdCI6MTYwMzk0MzIzMH0.b37PfwlcH_cue6yhgvDt2IiNvhRACf79hTNtacYB94Q';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ token }),
      })
    );

    render(<BrowserRouter>
            <Login onSubmit={onSubmitMock} />
        </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(token);
    });
  });

  it('navigates to register page when register button is clicked', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    render(<Login onSubmit={onSubmitMock} />);
    const registerButton = screen.getByText('Don‘t have accounts? Register here');
    fireEvent.click(registerButton);
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
