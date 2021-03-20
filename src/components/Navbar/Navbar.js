import MenuItems from './MenuItems'
import './navbar.css'
const Navbar = ( { toggleNavMenu, onToggleNavMenu  } ) => {
    return (

     <nav className="NavbarItems">
        <ul className="nav-menu">
            {MenuItems.map((item) => {
                return (
                    <li>
                        <a key={item.id} className={item.cName} href={item.url} >
                            {item.title}
                        </a>
                    </li>
                )
            })}
        </ul>
     </nav>
    )
};

export default Navbar

