import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ReviewPage } from './components/ReviewPage';
import './styles/global.css';
import './styles/review.css';

const isReviewPage = window.location.pathname === '/review' || window.location.pathname === '/review/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isReviewPage ? <ReviewPage /> : <App />}
  </StrictMode>,
);
