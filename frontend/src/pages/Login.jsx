import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.top}>
          <p style={styles.eyebrow}>Selamat datang kembali</p>
          <h1 style={styles.title}>Masuk ke akun</h1>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="nama@email.com"
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password kamu"
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Memproses…' : 'Masuk'}
          </button>
        </form>

        <p style={styles.footer}>
          Belum punya akun?{' '}
          <Link to="/register" style={styles.footerLink}>Daftar sekarang</Link>
        </p>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    background: '#fafafa',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#fff',
    border: '1px solid #e8e8e8',
    padding: '40px',
  },
  top: {
    marginBottom: '32px',
  },
  eyebrow: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: '8px',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '26px',
    fontWeight: '600',
    color: '#111',
    letterSpacing: '-0.5px',
  },
  errorBox: {
    background: '#fdf2f2',
    border: '1px solid #f0d0d0',
    borderRadius: '2px',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#c0392b',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#444',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '2px',
    fontSize: '14px',
    color: '#111',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  btn: {
    marginTop: '4px',
    padding: '11px',
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '24px',
    fontSize: '13px',
    color: '#757575',
    textAlign: 'center',
  },
  footerLink: {
    color: '#111',
    fontWeight: '600',
    borderBottom: '1px solid #111',
  },
};
