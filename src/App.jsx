import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './templates/Home';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/admin/posts/new" element={<PostForm />} />
        <Route path="/admin/posts/:id/edit" element={<PostForm />} />
      </Routes>
    </BrowserRouter>
  );
}
