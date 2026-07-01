import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function ArticleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    api.get(`/articles/${id}`)
      .then(res => {
        setArticle(res.data);
        setLikeCount(res.data._count?.likes ?? 0);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await api.post(`/articles/${id}/like`);
      setLiked(res.data.liked);
      setLikeCount(c => res.data.liked ? c + 1 : c - 1);
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      const res = await api.post(`/articles/${id}/comments`, { content: comment });
      setArticle(prev => ({
        ...prev,
        comments: [...(prev.comments || []), res.data],
      }));
      setComment('');
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/articles/${id}`);
      navigate('/');
    } catch {}
  };

  const isOwner = user && article && user.id === article.authorId;

  if (loading) return (
    <main style={styles.main}>
      <p style={styles.loadingText}>Memuat artikel…</p>
    </main>
  );

  if (!article) return null;

  return (
    <main style={styles.main}>
      {/* Header */}
      <div style={styles.articleHeader}>
        <div style={styles.metaRow}>
          <span style={styles.author}>{article.author?.name}</span>
          <span style={styles.sep}>·</span>
          <time style={styles.date}>{formatDate(article.createdAt)}</time>
          {article.updatedAt !== article.createdAt && (
            <>
              <span style={styles.sep}>·</span>
              <span style={styles.date}>diperbarui {formatDate(article.updatedAt)}</span>
            </>
          )}
        </div>
        <h1 style={styles.title}>{article.title}</h1>
      </div>

      {/* Owner actions */}
      {isOwner && (
        <div style={styles.ownerBar}>
          <Link to={`/articles/${id}/edit`} style={styles.editBtn}>Edit artikel</Link>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)} style={styles.deleteBtn}>Hapus</button>
          ) : (
            <div style={styles.confirmRow}>
              <span style={styles.confirmText}>Yakin hapus?</span>
              <button onClick={handleDelete} style={styles.confirmYes}>Ya, hapus</button>
              <button onClick={() => setDeleteConfirm(false)} style={styles.confirmNo}>Batal</button>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div style={styles.body}>
        {article.body.split('\n').map((p, i) => (
          <p key={i} style={styles.paragraph}>{p}</p>
        ))}
      </div>

      {/* Like bar */}
      <div style={styles.likeBar}>
        <button onClick={handleLike} style={{ ...styles.likeBtn, ...(liked ? styles.likeBtnActive : {}) }}>
          {liked ? '— Batalkan suka' : '+ Suka artikel ini'}
        </button>
        <span style={styles.likeCount}>{likeCount} orang menyukai ini</span>
      </div>

      {/* Divider */}
      <div style={styles.sectionDivider} />

      {/* Comments */}
      <section style={styles.commentsSection}>
        <h2 style={styles.sectionTitle}>
          {article.comments?.length ?? 0} Komentar
        </h2>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleComment} style={styles.commentForm}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tulis komentarmu…"
              style={styles.textarea}
              rows={3}
            />
            <div style={styles.commentFormFooter}>
              <span style={styles.commenterName}>{user.name}</span>
              <button type="submit" disabled={submitting || !comment.trim()} style={styles.submitBtn}>
                {submitting ? 'Mengirim…' : 'Kirim'}
              </button>
            </div>
          </form>
        ) : (
          <div style={styles.loginPrompt}>
            <Link to="/login" style={styles.loginPromptLink}>Masuk</Link>
            <span style={styles.loginPromptText}> untuk meninggalkan komentar.</span>
          </div>
        )}

        {/* Comment list */}
        <div style={styles.commentList}>
          {(!article.comments || article.comments.length === 0) && (
            <p style={styles.emptyComments}>Belum ada komentar. Jadilah yang pertama.</p>
          )}
          {article.comments?.map(c => (
            <div key={c.id} style={styles.commentItem}>
              <div style={styles.commentMeta}>
                <span style={styles.commentAuthor}>{c.user?.name}</span>
                <span style={styles.commentSep}>·</span>
                <time style={styles.commentDate}>{formatDate(c.createdAt)}</time>
              </div>
              <p style={styles.commentContent}>{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = {
  main: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#999',
    textAlign: 'center',
    paddingTop: '80px',
  },
  articleHeader: {
    marginBottom: '40px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '16px',
  },
  author: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  sep: { color: '#c4c4c4', fontSize: '12px' },
  date: { fontSize: '12px', color: '#757575' },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
    color: '#111',
  },
  ownerBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    padding: '12px 0',
    borderTop: '1px solid #ebebeb',
    borderBottom: '1px solid #ebebeb',
    marginBottom: '36px',
  },
  editBtn: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '1px solid #111',
    paddingBottom: '1px',
  },
  deleteBtn: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    background: 'none',
    border: 'none',
  },
  confirmRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: '12px',
    color: '#555',
  },
  confirmYes: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#c0392b',
    background: 'none',
    border: 'none',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    cursor: 'pointer',
  },
  confirmNo: {
    fontSize: '12px',
    color: '#999',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  body: {
    marginBottom: '48px',
  },
  paragraph: {
    fontSize: '17px',
    lineHeight: '1.85',
    color: '#2a2a2a',
    marginBottom: '20px',
    fontWeight: '300',
  },
  likeBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 0',
    borderTop: '1px solid #ebebeb',
  },
  likeBtn: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '2px',
    padding: '7px 16px',
    color: '#555',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  likeBtnActive: {
    background: '#111',
    color: '#fff',
    borderColor: '#111',
  },
  likeCount: {
    fontSize: '12px',
    color: '#999',
  },
  sectionDivider: {
    height: '1px',
    background: '#ebebeb',
    margin: '40px 0',
  },
  commentsSection: {},
  sectionTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '20px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '24px',
  },
  commentForm: {
    border: '1px solid #ddd',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '32px',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    color: '#111',
    lineHeight: '1.6',
    resize: 'none',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  commentFormFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: '#fafafa',
  },
  commenterName: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#555',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  submitBtn: {
    padding: '6px 16px',
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  loginPrompt: {
    padding: '16px',
    border: '1px solid #eee',
    borderRadius: '2px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  loginPromptLink: {
    fontWeight: '600',
    color: '#111',
    borderBottom: '1px solid #111',
  },
  loginPromptText: {
    color: '#757575',
  },
  commentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  emptyComments: {
    fontSize: '14px',
    color: '#aaa',
    paddingTop: '8px',
  },
  commentItem: {
    padding: '20px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  commentMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  commentAuthor: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  commentSep: { color: '#c4c4c4', fontSize: '12px' },
  commentDate: { fontSize: '12px', color: '#999' },
  commentContent: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.7',
  },
};
