import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadPostsById } from '../utils/load-post-by-id';

export default function PostDetail(){
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    loadPostsById(id)
      .then((data) => {
        setPost(data);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  if (status === 'loading') return <p>Carregando...</p>;
  if (status === 'error') return <p>Erro ao carregar o post.</p>;
  if (!post) return <p>Não encontrado...</p>;

  return (
    <article className="post-detail">
      <Link to="/">← Voltar</Link>
      <h1>{post.title}</h1>
      {post.cover && (
        <figure>
          <img src={post.cover} alt={post.title} />
        </figure>
      )}
      <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
    </article>
  );
}
