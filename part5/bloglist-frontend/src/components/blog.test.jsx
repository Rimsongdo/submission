import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import { describe, it, expect } from 'vitest';

describe('<Blog />', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    id: '5a422a851b54a676234d17f7',
  };

  it('renders title and author but does not render URL or likes by default', () => {
    render(<Blog blog={blog} />);

    // Check that title and author are rendered
    expect(screen.getByText('React patterns')).toBeDefined();
    expect(screen.getByText('Michael Chan')).toBeDefined();

    // Check that URL and likes are not rendered by default
    expect(screen.queryByText('https://reactpatterns.com/')).toBeNull();
    expect(screen.queryByText('Likes 7')).toBeNull();
  });
});
