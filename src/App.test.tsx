import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './components/Navbar';

describe('App', () => {
  it('renders navbar correctly', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Samyra's/i)).toBeInTheDocument();
    expect(screen.getByText(/Yummy Cakes/i)).toBeInTheDocument();
  });
});
