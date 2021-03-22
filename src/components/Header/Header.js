import PropTypes from 'prop-types'
import LogoutButton from '../LogoutButton'
import SecondaryNavbar from './SecondaryNavbar'
import logo from './logo.png'

const Header = ({ isLoading }) => {

    if (isLoading) {
        return <div>Loading ...</div>;
      }

    return (
        <header className='header'>
            <img src={logo} alt = "logo"/>
            <h1>VocabuLazy</h1>
            <SecondaryNavbar />
            
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
