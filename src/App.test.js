import React from 'react'; 
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders signup header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Signup/i);
  expect(linkElement).toBeInTheDocument();
});

