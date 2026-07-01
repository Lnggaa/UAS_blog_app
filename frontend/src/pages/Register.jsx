import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await api.post('/auth/register', form);
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.top}>
          <p style={styles.eyebrow}>Bergabung sekarang</p>
          <h1 style={styles.title}>Buat akun baru</h1>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nama Lengkap</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nama kamu"
              style={styles.input}
            />
          </div>
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
              placeholder="Minimal 6 karakter"
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Memproses…' : 'Buat Akun'}
          </button>
        </form>

        <p style={styles.footer}>
          Sudah punya akun?{' '}
          <Link to="/login" style={styles.footerLink}>Masuk di sini</Link>
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
  top: { marginBottom: '32px' },
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
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
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
