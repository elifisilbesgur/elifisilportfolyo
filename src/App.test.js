import { render, screen } from '@testing-library/react';
import App from './App';

test('ad ve proje başlıkları görünür', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'Elif Işıl Beşgür' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'LumaNote' })).toBeInTheDocument();
});
