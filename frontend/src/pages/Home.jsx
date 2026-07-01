import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ArticleCard from '../components/ArticleCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/articles')
      .then(res => setArticles(res.data))
      .catch(() => setError('Gagal memuat artikel.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={styles.main}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.eyebrow}>Platform Penulisan</p>
          <h1 style={styles.heroTitle}>
            Gagasan yang layak<br />untuk dibaca.
          </h1>
          <p style={styles.heroSub}>
            Tuliskan pemikiranmu. Bagikan perspektifmu.<br />
            Temukan tulisan yang membuatmu berpikir.
          </p>
          {!user && (
            <div style={styles.heroCta}>
              <Link to="/register" style={styles.ctaPrimary}>Mulai Menulis</Link>
              <Link to="/login" style={styles.ctaSecondary}>Sudah punya akun</Link>
            </div>
          )}
        </div>
      </section>

      {/* Divider */}
      <div style={styles.dividerRow}>
        <div style={styles.dividerLine} />
        <span style={styles.dividerLabel}>Artikel Terbaru</span>
        <div style={styles.dividerLine} />
      </div>

      {/* Articles */}
      <section style={styles.feed}>
        {loading && (
          <div style={styles.stateBox}>
            <p style={styles.stateText}>Memuat artikel…</p>
          </div>
        )}
        {error && (
          <div style={styles.stateBox}>
            <p style={styles.stateText}>{error}</p>
          </div>
        )}
        {!loading && !error && articles.length === 0 && (
          <div style={styles.emptyBox}>
            <p style={styles.emptyTitle}>Belum ada artikel.</p>
            <p style={styles.emptySub}>Jadilah yang pertama menulis.</p>
            {user && <Link to="/new" style={styles.ctaPrimary}>Tulis sekarang</Link>}
          </div>
        )}
        {articles.map(a => <ArticleCard key={a.id} article={a} />)}
      </section>
    </main>
  );
}

const styles = {
  main: {
    maxWidth: '780px',
    margin: '0 auto',
    padding: '0 24px 80px',
  },
  hero: {
    padding: '72px 0 56px',
    borderBottom: '1px solid #ebebeb',
  },
  heroInner: {},
  eyebrow: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#757575',
    marginBottom: '20px',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(36px, 6vw, 56px)',
    fontWeight: '600',
    lineHeight: '1.12',
    letterSpacing: '-1px',
    color: '#111',
    marginBottom: '20px',
  },
  heroSub: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.7',
    marginBottom: '36px',
    fontWeight: '300',
  },
  heroCta: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    display: 'inline-block',
    padding: '10px 24px',
    background: '#111',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: '2px',
  },
  ctaSecondary: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#757575',
    borderBottom: '1px solid #c4c4c4',
    paddingBottom: '1px',
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '40px 0 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#ebebeb',
  },
  dividerLabel: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#aaa',
    whiteSpace: 'nowrap',
  },
  feed: {},
  stateBox: {
    padding: '60px 0',
    textAlign: 'center',
  },
  stateText: {
    fontSize: '14px',
    color: '#999',
  },
  emptyBox: {
    padding: '80px 0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontFamily: "'Playfair Display', serif",
    fontWeight: '600',
    color: '#111',
    marginBottom: '4px',
  },
  emptySub: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '20px',
  },
};
