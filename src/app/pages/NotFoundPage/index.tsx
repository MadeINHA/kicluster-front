import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
}
