import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>
          Tulisan<span style={styles.brandDot}>.</span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>
            Beranda
          </Link>
          {user && (
            <Link to="/new" style={{ ...styles.link, ...(isActive('/new') ? styles.linkActive : {}) }}>
              Tulis
            </Link>
          )}
        </div>

        <div style={styles.auth}>
          {user ? (
            <>
              <span style={styles.username}>{user.name}</span>
              <button onClick={handleLogout} style={styles.btnOutline}>
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.btnGhost}>Masuk</Link>
              <Link to="/register" style={styles.btnFill}>Daftar</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    borderBottom: '1px solid #e8e8e8',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  nav: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  brand: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '22px',
    fontWeight: '600',
    color: '#111',
    letterSpacing: '-0.5px',
    flexShrink: 0,
  },
  brandDot: {
    color: '#111',
  },
  links: {
    display: 'flex',
    gap: '24px',
    flex: 1,
  },
  link: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: '400',
    color: '#757575',
    letterSpacing: '0.01em',
    transition: 'color 0.15s',
  },
  linkActive: {
    color: '#111',
    fontWeight: '500',
  },
  auth: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  username: {
    fontSize: '13px',
    color: '#757575',
    fontWeight: '500',
  },
  btnGhost: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#111',
    padding: '6px 14px',
    border: 'none',
    background: 'transparent',
    letterSpacing: '0.01em',
  },
  btnFill: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#fff',
    padding: '6px 16px',
    background: '#111',
    border: '1px solid #111',
    borderRadius: '2px',
    letterSpacing: '0.01em',
  },
  btnOutline: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#111',
    padding: '6px 14px',
    background: 'transparent',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    letterSpacing: '0.01em',
  },
};
