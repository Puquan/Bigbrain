import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import React from 'react';

describe('Navbar', () => {
  beforeEach(() => {
    render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
    );
  });

  test('renders Big Brain title', () => {
    const title = screen.getByText('Big Brain');
    expect(title).toBeInTheDocument();
  });

  test('clicking on title navigates to dashboard', () => {
    const title = screen.getByText('Big Brain');
    fireEvent.click(title);
    expect(window.location.pathname).toEqual('/dashboard');
  });

  test('renders Logout button', () => {
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  test('clicking on Logout button removes token and navigates to home', () => {
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.pathname).toEqual('/');
  });
});
