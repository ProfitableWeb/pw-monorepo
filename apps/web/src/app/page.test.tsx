import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('ProfitableWeb');
  });

  it('renders the description text', () => {
    render(<HomePage />);
    
    const description = screen.getByText(/Исследовательский блог для монетизации веб проектов/);
    expect(description).toBeInTheDocument();
  });

  it('has proper container structure', () => {
    render(<HomePage />);
    
    const container = screen.getByText('ProfitableWeb').closest('.container');
    expect(container).toBeInTheDocument();
  });
});