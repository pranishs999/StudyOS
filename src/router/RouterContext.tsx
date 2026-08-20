import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface RouteMatch {
  pathname: string;
  search: string;
  query: Record<string, string>;
  params: Record<string, string>;
}

interface RouterContextType {
  pathname: string;
  search: string;
  fullPath: string;
  query: Record<string, string>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  matchRoute: (pattern: string) => { matches: boolean; params: Record<string, string> };
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parseQuery(search: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!search) return params;
  const clean = search.startsWith('?') ? search.slice(1) : search;
  const pairs = clean.split('&');
  for (const pair of pairs) {
    if (!pair) continue;
    const [k, v] = pair.split('=');
    if (k) params[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
  }
  return params;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return '/dashboard';
    const path = window.location.pathname || '/';
    // Normalize root to /dashboard if initially blank or /
    return (path === '/' ? '/dashboard' : path) + window.location.search;
  });

  const [pathname, search] = useMemo(() => {
    const qIndex = currentUrl.indexOf('?');
    if (qIndex === -1) return [currentUrl, ''];
    return [currentUrl.slice(0, qIndex), currentUrl.slice(qIndex)];
  }, [currentUrl]);

  const query = useMemo(() => parseQuery(search), [search]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/dashboard';
      const searchStr = window.location.search || '';
      setCurrentUrl((path === '/' ? '/dashboard' : path) + searchStr);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const target = to.startsWith('/') ? to : `/${to}`;
    if (options?.replace) {
      window.history.replaceState({}, '', target);
    } else {
      window.history.pushState({}, '', target);
    }
    setCurrentUrl(target);
    window.scrollTo(0, 0);
  }, []);

  const matchRoute = useCallback((pattern: string): { matches: boolean; params: Record<string, string> } => {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = pathname.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) {
      return { matches: false, params: {} };
    }

    const params: Record<string, string> = {};
    for (let i = 0; i < patternParts.length; i++) {
      const pPart = patternParts[i];
      const actualPart = pathParts[i];

      if (pPart.startsWith(':')) {
        const paramName = pPart.slice(1);
        params[paramName] = decodeURIComponent(actualPart);
      } else if (pPart !== actualPart) {
        return { matches: false, params: {} };
      }
    }

    return { matches: true, params };
  }, [pathname]);

  const value = useMemo(() => ({
    pathname,
    search,
    fullPath: currentUrl,
    query,
    navigate,
    matchRoute,
  }), [pathname, search, currentUrl, query, navigate, matchRoute]);

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
  id?: string;
}> = ({ to, children, className = '', activeClassName = '', onClick, title, id }) => {
  const { pathname, navigate } = useRouter();
  const isActive = pathname === to || (to !== '/' && to !== '/dashboard' && pathname.startsWith(to));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a
      id={id}
      href={to}
      title={title}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
    >
      {children}
    </a>
  );
};
