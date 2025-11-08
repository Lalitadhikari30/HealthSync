import { useState, useCallback } from 'react';

export function useNavigate() {
  const [, setPath] = useState(window.location.pathname);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setPath(path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  return navigate;
}