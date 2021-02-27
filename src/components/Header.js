import PropTypes from 'prop-types'
import LogoutButton from './LogoutButton'

const Header = ({ title, isAuthenticated, isLoading }) => {

    if (isLoading) {
        return <div>Loading ...</div>;
      }

    return (
        <header className='header'>
            <h1>{title}</h1>
            {isAuthenticated && <LogoutButton />}
        </header>
    )
}

Header.defaultProps = {
    title: 'Vocabulazy'
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

//CSS IN JS
// const headingStyle = {
//     color: 'red',
//     backgroundColor: 'black'
// }

export default Header
