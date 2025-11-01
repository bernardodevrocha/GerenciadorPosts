import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadPosts } from '../utils/load-posts';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => setPosts(await loadPosts()))().catch(console.error);
  }, []);

  return (
    <div className="grid">
      {posts.map((p) => (
        <article key={p.id} className="card">
          {p.cover && <img src={p.cover} alt={p.title} />}
          <h2>{p.title}</h2>
          <p>{p.body.slice(0, 120)}...</p>
          <Link to={`/posts/${p.id}`}>Veja mais</Link>
        </article>
      ))}
    </div>
  );
}
