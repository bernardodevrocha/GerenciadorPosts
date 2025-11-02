import P from 'prop-types';
import './styles.css';

// eslint-disable-next-line react/prop-types
export const TextInput = ({ searchValue, handleChange, className = '' }) => {
  return (
    <input
      className={`input ${className}`}
      onChange={handleChange}
      value={searchValue}
      type="search"
      placeholder="Type your search"
    />
  );
};

TextInput.propTypes = {
  searchValue: P.string.isRequired,
  handleChange: P.func.isRequired,
};
