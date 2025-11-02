import { API_BASE } from './api';

export async function listPosts() {
  const res = await fetch(`${API_BASE}/api/posts`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Falha ao listar posts');
  return json;
}

export async function getPost(id) {
  const res = await fetch(`${API_BASE}/api/posts/${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || `Falha ao carregar post ${id}`);
  return json;
}

export async function createPost({ title, body, cover }) {
  const res = await fetch(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, cover }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || 'Falha ao criar post');
  return json;
}

export async function updatePost(id, { title, body, cover }) {
  const res = await fetch(`${API_BASE}/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, cover }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Falha ao atualizar post');
  return json;
}

export async function deletePost(id) {
  const res = await fetch(`${API_BASE}/api/posts/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.error || 'Falha ao excluir post');
  }
}
