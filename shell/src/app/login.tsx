import { useState } from 'react';
import { supabase } from '@payroll-system/shared';

export function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });

    if (error) {
      alert(error.message);
    } else {
      setMessage('✅ Check your email for the login link!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>

        <div style={styles.header}>
          <div style={styles.logoPlaceholder}></div>
          <h2 style={styles.title}>Payroll System</h2>
          <p style={styles.subtitle}>Sign in to manage employees & salaries</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Work Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button
            disabled={loading}
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          >
            {loading ? 'Sending Link...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <div style={styles.successMessage}>
            {message}
          </div>
        )}

        <p style={styles.footer}>
          Powered by Supabase & React
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // Light gray background
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '30px',
  },
  logoPlaceholder: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#111827',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb', // Professional Blue
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  successMessage: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#ecfdf5',
    color: '#047857',
    borderRadius: '6px',
    fontSize: '14px',
  },
  footer: {
    marginTop: '30px',
    fontSize: '12px',
    color: '#9ca3af',
  },
};
