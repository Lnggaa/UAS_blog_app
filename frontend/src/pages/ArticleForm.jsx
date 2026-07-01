import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ArticleForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', body: '', published: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
    if (isEdit) {
      api.get(`/articles/${id}`).then(res => {
        setForm({ title: res.data.title, body: res.data.body, published: res.data.published });
      }).catch(() => navigate('/'));
    }
  }, [id, user]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/articles/${id}`, form);
        navigate(`/articles/${id}`);
      } else {
        const res = await api.post('/articles', form);
        navigate(`/articles/${res.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <p style={styles.eyebrow}>{isEdit ? 'Sunting artikel' : 'Artikel baru'}</p>
        <h1 style={styles.title}>{isEdit ? 'Edit tulisanmu' : 'Tulis sesuatu'}</h1>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Judul</label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Judul artikel yang menarik…"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Isi Artikel</label>
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            required
            placeholder="Tulis isi artikelmu di sini…"
            style={styles.textarea}
            rows={18}
          />
        </div>

        <div style={styles.publishRow}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              style={styles.checkbox}
            />
            <span>Publikasikan langsung</span>
          </label>
          <span style={styles.publishHint}>
            {form.published ? 'Artikel akan langsung terlihat oleh pembaca.' : 'Artikel disimpan sebagai draft.'}
          </span>
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>
            Batal
          </button>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Menyimpan…' : isEdit ? 'Simpan perubahan' : 'Terbitkan artikel'}
          </button>
        </div>
      </form>
    </main>
  );
}

const styles = {
  main: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  header: {
    marginBottom: '36px',
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
    fontSize: '30px',
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
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#444',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  input: {
    padding: '12px 14px',
    border: '1px solid #ddd',
    borderRadius: '2px',
    fontSize: '18px',
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#111',
    outline: 'none',
    letterSpacing: '-0.2px',
  },
  textarea: {
    padding: '14px',
    border: '1px solid #ddd',
    borderRadius: '2px',
    fontSize: '15px',
    color: '#111',
    lineHeight: '1.8',
    resize: 'vertical',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '300',
  },
  publishRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '16px',
    background: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '2px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#111',
    cursor: 'pointer',
  },
  checkbox: {
    width: '15px',
    height: '15px',
    cursor: 'pointer',
    accentColor: '#111',
  },
  publishHint: {
    fontSize: '12px',
    color: '#999',
    paddingLeft: '23px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '8px',
    borderTop: '1px solid #ebebeb',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: 'transparent',
    color: '#757575',
    border: '1px solid #ddd',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 24px',
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
};
