import P from 'prop-types';
import './styles.css';

// eslint-disable-next-line react/prop-types
export const Button = ({ text, onClick, disabled = false, className = '' }) => (
  <button className={`btn ${className}`} onClick={onClick} disabled={disabled}>
    {text}
  </button>
);

Button.defaultProps = {
  disabled: false,
};

Button.propTypes = {
  text: P.string.isRequired,
  onClick: P.func.isRequired,
  disabled: P.bool,
};
