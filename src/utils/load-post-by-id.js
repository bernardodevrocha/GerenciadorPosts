import { API_BASE } from './api';

export async function loadPostsById(id) {
  const res = await fetch(`${API_BASE}/api/posts/${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Falha ao carregar post');
  return json;
}
