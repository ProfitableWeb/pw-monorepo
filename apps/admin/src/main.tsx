import { createRoot } from 'react-dom/client';
import { QueryProvider } from './providers/QueryProvider';
import App from './app/App.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
);
