import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.css';

export const PostCard = ({ post, showActions = false, onEdit = () => {}, onDelete = () => {} }) => {
  return (
    <article className="post">
      {post.cover && (
        <Link to={`/posts/${post.id}`} aria-label={`Abrir ${post.title}`}>
          <img src={post.cover} alt={post.title} />
        </Link>
      )}

      <div className="post-content">
        <h2>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h2>
        <p>{post.body?.slice(0, 120)}...</p>

        <div className="post-actions">
          {showActions && (
            <>
              <button type="button" onClick={() => onEdit(post.id)}>
                Editar
              </button>
              <button type="button" onClick={() => onDelete(post.id)}>
                Excluir
              </button>
            </>
          )}
          <Link className="btn" to={`/posts/${post.id}`}>
            Veja mais
          </Link>
        </div>
      </div>
    </article>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    cover: PropTypes.string,
  }),
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
