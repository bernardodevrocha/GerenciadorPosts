export const loadPosts = async () => {
  const [postsRes, photosRes] = await Promise.all([
    fetch('http://localhost:4000/api/posts'),
    fetch('http://localhost:4000/api/photos'),
  ]);

  const [postsJson, photosJson] = await Promise.all([postsRes.json(), photosRes.json()]);

  if (!postsRes.ok) {
    throw new Error(`GET /api/posts falhou: ${postsJson?.error ?? postsRes.status}`);
  }
  if (!photosRes.ok) {
    throw new Error(`GET /api/photos falhou: ${photosJson?.error ?? photosRes.status}`);
  }

  const postsArr = Array.isArray(postsJson) ? postsJson : [];
  const photosArr = Array.isArray(photosJson) ? photosJson : [];

  if (!Array.isArray(postsArr)) {
    throw new Error('API /api/posts não retornou um array.');
  }
  if (!Array.isArray(photosArr)) {
    throw new Error('API /api/photos não retornou um array.');
  }

  return postsArr.map((post, i) => ({
    ...post,
    cover: photosArr[i]?.url ?? null,
  }));
};
