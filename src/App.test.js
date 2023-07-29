import React from 'react'; 
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders My Promises header', () => {
  render(<App />);
  const linkElement = screen.getByText(/My Promises/i);
  expect(linkElement).toBeInTheDocument();
});
