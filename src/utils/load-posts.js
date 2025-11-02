import { API_BASE } from './api';

export const loadPosts = async () => {
  try {
    const [postsRes, photosRes] = await Promise.all([fetch(`${API_BASE}/api/posts`), fetch(`${API_BASE}/api/photos`)]);

    if (!postsRes.ok) throw new Error(`GET /api/posts ${postsRes.status}`);
    if (!photosRes.ok) throw new Error(`GET /api/photos ${photosRes.status}`);

    const [posts, photos] = await Promise.all([postsRes.json(), photosRes.json()]);

    if (!Array.isArray(posts) || !Array.isArray(photos)) {
      throw new Error('API não retornou arrays');
    }

    return posts.map((post, i) => ({
      ...post,
      cover: photos[i]?.url ?? null,
    }));
  } catch (err) {
    console.error('[loadPosts] Failed:', err);
    throw err; // deixa o erro subir para o seu useEffect (para você ver no console)
  }
};
