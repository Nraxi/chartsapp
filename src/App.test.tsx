import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders fetch endpoints button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /fetch endpoints/i });
  expect(buttonElement).toBeInTheDocument();
});
