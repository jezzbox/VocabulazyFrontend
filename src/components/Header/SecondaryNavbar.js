import './navbar.css'
import { Link }from 'react-router-dom'
const SecondaryNavbar = () => {
    return (

     <nav className="NavbarItems">
        <ul className="nav-menu">
            <li>
            <Link to="\">About</Link>
            </li>
            <li>
            <Link to="\">Logout</Link>
            </li>
        </ul>
     </nav>
    )
};

export default SecondaryNavbar

