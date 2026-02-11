import 'zone.js';
import React, { useEffect, useState, useRef } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { supabase } from '@payroll-system/shared';
import { Login } from './login';

// @ts-ignore
const SalaryMfe = React.lazy(() => import('salaryMfe/Module'));

const AngularWrapper = () => {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    const ANGULAR_PORT = 4205;
    const scripts = [
      { src: 'styles.js', isModule: true },
      { src: 'vendor.js', isModule: true },
      { src: 'main.js', isModule: true }
    ];

    const loadScripts = async () => {
      for (const file of scripts) {
        const fullUrl = `http://localhost:${ANGULAR_PORT}/${file.src}`;
        if (document.querySelector(`script[src="${fullUrl}"]`)) continue;

        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = fullUrl;
          script.crossOrigin = 'anonymous';
          file.isModule ? (script.type = 'module') : (script.defer = true);
          script.onload = () => resolve(true);
          script.onerror = () => {
            console.error(`Failed to load ${fullUrl}`);
            resolve(true);
          };
          document.body.appendChild(script);
        });
      }
    };

    loadScripts();
  }, []);

  // @ts-ignore
  return <employee-root></employee-root>;
};

export function App() {
  const [session, setSession] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <Login />;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={styles.layout}>

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>Payroll System</div>
          <nav style={styles.nav}>
            <Link to="/" style={isActive('/') ? { ...styles.link, ...styles.linkActive } : styles.link}>
              Dashboard
            </Link>
            <Link to="/employees" style={isActive('/employees') ? { ...styles.link, ...styles.linkActive } : styles.link}>
              Employees
            </Link>
            <Link to="/salaries" style={isActive('/salaries') ? { ...styles.link, ...styles.linkActive } : styles.link}>
              Salaries
            </Link>
          </nav>
        </div>

        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{session.user.email}</span>
          <button onClick={() => supabase.auth.signOut()} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.container}>
        <div style={styles.contentWrapper}>
          <Routes>
            <Route path="/" element={
              <div style={styles.welcomePanel}>
                <h2 style={styles.pageHeader}>System Overview</h2>
                <p style={styles.text}>Welcome to the Payroll Management System. Please select a module from the navigation bar above.</p>
              </div>
            } />

            <Route path="/salaries" element={
              <React.Suspense fallback={<div style={styles.loading}>Loading Module...</div>}>
                <SalaryMfe />
              </React.Suspense>
            } />

            <Route path="/employees" element={<AngularWrapper />} />
            <Route path="/employees/*" element={<AngularWrapper />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    zIndex: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  },
  logo: {
    fontWeight: '700',
    fontSize: '18px',
    color: '#333',
    letterSpacing: '-0.5px',
  },
  nav: {
    display: 'flex',
    gap: '8px',
  },
  link: {
    textDecoration: 'none',
    color: '#5f6368',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s, color 0.2s',
  },
  linkActive: {
    color: '#1a73e8',
    backgroundColor: '#e8f0fe',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userEmail: {
    fontSize: '13px',
    color: '#5f6368',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #dadce0',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '13px',
    color: '#3c4043',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  },
  container: {
    flex: 1,
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  contentWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #dadce0',
    minHeight: '600px',
    padding: '24px',
  },
  welcomePanel: {
    padding: '20px',
  },
  pageHeader: {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '22px',
    color: '#202124',
    fontWeight: '400',
  },
  text: {
    color: '#5f6368',
    lineHeight: '1.5',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#5f6368',
    fontSize: '14px',
  }
};
