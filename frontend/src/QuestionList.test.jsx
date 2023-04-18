import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionList from './components/QuestionList';
import { BrowserRouter } from 'react-router-dom';

const mockGame = {
  active: null,
  createdAt: '2022-05-01T09:00:00.000Z',
  id: 1,
  name: 'Test Game',
  oldSessions: [],
  thumbnail: 'https://example.com/thumbnail.png',
  questions: [
    {
      questionId: 1,
      questionType: 'Multiple Choice',
      question: 'What is the capital of France?',
      timeLimit: '60',
      points: '10',
      url: 'https://example.com/question1',
    },
    {
      questionId: 2,
      questionType: 'True or False',
      question: 'Is the Earth round?',
      timeLimit: '30',
      points: '5',
      url: 'https://example.com/question2',
    },
  ],
};

describe('QuestionList component', () => {
  it('renders the game name and thumbnail', () => {
    render(
    <BrowserRouter>
        <QuestionList game={mockGame} quizId="1" />
    </BrowserRouter>
    );
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByAltText('Do not have a Thumbnail yet!')).toHaveAttribute('src', 'https://example.com/thumbnail.png');
  });

  it('renders the questions', () => {
    render(
    <BrowserRouter>
        <QuestionList game={mockGame} quizId="1" />
    </BrowserRouter>
    );
    expect(screen.getByText('Question1: What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('Question2: Is the Earth round?')).toBeInTheDocument();
  });

  it('calls the edit question function when edit button is clicked', () => {
    render(
    <BrowserRouter>
        <QuestionList game={mockGame} quizId="1"/>
    </BrowserRouter>);
    const editButton = screen.getByTestId('edit1');
    fireEvent.click(editButton.firstChild);
    expect(editButton).toBeInTheDocument();
  });

  it('calls the delete question function when delete button is clicked', async () => {
    const handleDeleteClick = jest.fn();
    render(
    <BrowserRouter>
        <QuestionList game={mockGame} quizId="1" handleDeleteClick={handleDeleteClick} />
    </BrowserRouter>);
    const deleteButton = screen.getByTestId('delete1');
    fireEvent.click(deleteButton.firstChild);
    // success delete
    expect(deleteButton).not.toBeInTheDocument();
  });
});
