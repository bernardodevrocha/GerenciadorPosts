import PropTypes from 'prop-types';
import { PostCard } from '../PostCard';
import './styles.css';

export const Posts = ({ posts = [], showActions = false, onEdit, onDelete }) => {
  if (!Array.isArray(posts)) return null;

  return (
    <div className="posts">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showActions={showActions} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

Posts.propTypes = {
  posts: PropTypes.array,
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
