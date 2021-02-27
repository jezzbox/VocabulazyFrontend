import MenuItems from './MenuItems'
import './navbar.css'
const Navbar = ( { toggleNavMenu, onToggleNavMenu  } ) => {
    return (

     <nav className="NavbarItems">
        <h1 className="navbar-logo">VocabuLazy</h1>
        <div className="menu-icon" onClick={onToggleNavMenu}>
            <i className={toggleNavMenu ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        <div className="nav-container">
        <ul className="nav-menu">
            {MenuItems.map((item, index) => {
                return (
                    <li>
                        <a className={item.cName} href={item.url} >
                            {item.title}
                        </a>
                    </li>
                )
            })}
        </ul>
        </div>
     </nav>
    )
};

export default Navbar

