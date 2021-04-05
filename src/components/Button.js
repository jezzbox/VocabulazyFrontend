import PropTypes from 'prop-types'
const Button = ({ text, onClick, className }) => {
    return <button
        onClick={onClick}
        className={className}>{text}</button>
}

Button.defaultProps = {
    className: 'btn'
}

Button.propTypes = {
    text: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
}

export default Button
