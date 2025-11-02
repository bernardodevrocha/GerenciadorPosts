import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createPost, getPost, updatePost } from '../utils/postApi';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [cover, setCover] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getPost(id)
      .then((p) => {
        setTitle(p.title || '');
        setBody(p.body || '');
        setCover(p.cover || '');
      })
      .catch(() => {});
  }, [isEdit, id]);

  async function onSubmit(e) {
    e.preventDefault();
    const payload = { title, body, cover: cover || undefined };
    try {
      if (isEdit) {
        const updated = await updatePost(id, payload);
        navigate(`/posts/${updated.id}`);
      } else {
        const created = await createPost(payload);
        navigate(`/posts/${created.id}`);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <section className="container">
      <h1>{isEdit ? 'Editar Post' : 'Novo Post'}</h1>
      <form onSubmit={onSubmit} className="form">
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Texto
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} required />
        </label>
        <label>
          URL da capa (opcional)
          <input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://..." />
        </label>

        <div className="actions">
          <button type="submit">{isEdit ? 'Salvar' : 'Criar'}</button>
          <Link to="/">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
