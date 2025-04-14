import { render, screen } from '@testing-library/react';
import Layout from '../popup/Layout.tsx';
import React from 'react';

describe('App', () => {
  test('renders learn react link', () => {
    render(<Layout />);
    const linkElement = screen.getByText(/Hello, World./i);
    expect(linkElement).toBeInTheDocument();
  });
});
