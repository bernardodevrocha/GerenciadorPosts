import { useCallback, useEffect, useState } from 'react';
import './styles.css';
import { Posts } from '../../components/Posts';
import { loadPosts } from '../../utils/load-posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { createPost } from '../../utils/postApi';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [postsPerPage] = useState(2);
  const [searchValue, setSearchValue] = useState('');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [cover, setCover] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleLoadPosts = useCallback(async (page, postsPerPage) => {
    const postsAndPhotos = await loadPosts();
    setPosts(postsAndPhotos.slice(page, postsPerPage));
    setAllPosts(postsAndPhotos);
  }, []);

  useEffect(() => {
    handleLoadPosts(0, postsPerPage);
  }, [handleLoadPosts, postsPerPage]);

  const loadMorePosts = () => {
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    // evitar mutação:
    setPosts((prev) => [...prev, ...nextPosts]);
    setPage(nextPage);
  };

  const handleChange = (e) => setSearchValue(e.target.value);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      await createPost({ title, body, cover: cover || undefined });
      setTitle('');
      setBody('');
      setCover('');
      await handleLoadPosts(0, postsPerPage);
      setPage(0);
    } catch (err) {
      setCreateError(err.message || 'Falha ao criar post');
    } finally {
      setCreating(false);
    }
  }

  const noMorePosts = page + postsPerPage >= allPosts.length;
  const filteredPosts = searchValue
    ? allPosts.filter((post) => post.title.toLowerCase().includes(searchValue.toLowerCase()))
    : posts;

  return (
    <section className="container">
      <div className="search-container">
        {!!searchValue && <h1>Search value: {searchValue}</h1>}
        <TextInput searchValue={searchValue} handleChange={handleChange} />
      </div>

      <form onSubmit={handleCreate} className="form" style={{ margin: '12px 0 20px', display: 'grid', gap: 8 }}>
        <strong>Novo Post</strong>
        <input
          className="input"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input"
          placeholder="Conteúdo"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="URL da capa (opcional)"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn" disabled={creating}>
            {creating ? 'Criando...' : '+ Criar'}
          </button>
          {createError && <span style="var(--danger)">{createError}</span>}
        </div>
      </form>

      {/* lista de cards */}
      {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}
      {filteredPosts.length === 0 && <p>Não existem posts =(</p>}

      <div className="button-container">
        {!searchValue && <Button text="Load more posts" onClick={loadMorePosts} disabled={noMorePosts} />}
      </div>
    </section>
  );
}
