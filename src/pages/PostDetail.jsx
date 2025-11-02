import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { loadPostsById } from '../utils/load-post-by-id';
import { deletePost } from '../utils/postApi';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | error

  useEffect(() => {
    setStatus('loading');
    loadPostsById(id)
      .then((data) => {
        setPost(data);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Excluir este post?')) return;
    try {
      await deletePost(id);
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  }

  if (status === 'loading') return <p>Carregando...</p>;
  if (status === 'error') return <p>Erro ao carregar o post.</p>;
  if (!post) return <p>Não encontrado.</p>;

  return (
    <section className="container">
      <div className="pd-toolbar">
        <Link className="btn ghost" to="/">
          ← Voltar
        </Link>
        <div className="pd-actions">
          <Link className="btn ghost" to={`/admin/posts/${post.id}/edit`}>
            Editar
          </Link>
          <button className="btn danger" onClick={handleDelete}>
            Excluir
          </button>
        </div>
      </div>

      <article className="post-detail">
        <h1>{post.title}</h1>
        {post.cover && (
          <figure>
            <img src={post.cover} alt={post.title} />
          </figure>
        )}
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
      </article>
    </section>
  );
}
