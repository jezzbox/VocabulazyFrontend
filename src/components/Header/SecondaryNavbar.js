import './navbar.css'
import { Link } from 'react-router-dom'
const SecondaryNavbar = ({ isAuthenticated, isLoading }) => {
    return (

     <nav className=" border-terraCotta-500 border-2 m-4 flex justify-end items-end p-2  rounded-full">
        <Link className=" text-xl hover:text-viola-600" to="\">About</Link>
        {isLoading ||!isAuthenticated ?
        <>
            <Link className=" ml-5 text-xl hover:text-viola-600" to="\">Log in</Link>
            <Link className=" ml-5 text-xl hover:text-viola-600" to="\">Sign up</Link>
        </> :
        <Link className=" ml-5 text-xl hover:text-viola-600" to="\">Log out</Link>}
     </nav>
    )
};

export default SecondaryNavbar

