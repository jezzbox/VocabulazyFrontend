import PropTypes from 'prop-types'
import SecondaryNavbar from './SecondaryNavbar'
import logo from './vocabulazy-logo.svg'

const Header = ({isAuthenticated, isLoading}) => {


    return (
        <header className="flex flex-wrap justify-center sm:justify-between h-78 md:h-20 ">
            <div className="flex items-center h-20">
                <div>
                    <img className="object-contain p-2 h-20" src={logo} alt = "logo"/>
                </div>
                <h1 className="text-center text-viola-600 text-5xl p-2">VocabuLazy</h1>
            </div>
            <SecondaryNavbar isAuthenticated={isAuthenticated} isLoading = {isLoading} />
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
