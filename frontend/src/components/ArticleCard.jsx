import { Link } from 'react-router-dom';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function excerpt(text, max = 160) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

export default function ArticleCard({ article }) {
  return (
    <article style={styles.card}>
      <div style={styles.meta}>
        <span style={styles.author}>{article.author?.name}</span>
        <span style={styles.sep}>·</span>
        <time style={styles.date}>{formatDate(article.createdAt)}</time>
      </div>

      <Link to={`/articles/${article.id}`} style={styles.titleLink}>
        <h2 style={styles.title}>{article.title}</h2>
      </Link>

      <p style={styles.excerpt}>{excerpt(article.body)}</p>

      <div style={styles.footer}>
        <Link to={`/articles/${article.id}`} style={styles.readMore}>
          Baca selengkapnya
        </Link>
        <div style={styles.counts}>
          <span style={styles.count}>{article._count?.likes ?? 0} suka</span>
          <span style={styles.countSep}>·</span>
          <span style={styles.count}>{article._count?.comments ?? 0} komentar</span>
        </div>
      </div>
    </article>
  );
}

const styles = {
  card: {
    padding: '32px 0',
    borderBottom: '1px solid #ebebeb',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '10px',
  },
  author: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  sep: {
    color: '#c4c4c4',
    fontSize: '12px',
  },
  date: {
    fontSize: '12px',
    color: '#757575',
  },
  titleLink: {
    display: 'block',
    marginBottom: '10px',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '22px',
    fontWeight: '600',
    color: '#111',
    lineHeight: '1.3',
    letterSpacing: '-0.3px',
    transition: 'opacity 0.15s',
  },
  excerpt: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.7',
    marginBottom: '16px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readMore: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid #111',
    paddingBottom: '1px',
  },
  counts: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  count: {
    fontSize: '12px',
    color: '#757575',
  },
  countSep: {
    color: '#c4c4c4',
    fontSize: '12px',
  },
};
