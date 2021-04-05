import './navbar.css'
import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
const SecondaryNavbar = ({ isAuthenticated, isLoading }) => {
    const { logout } = useAuth0();
    return (

     <nav className=" border-terraCotta-500 border-2 m-4 flex justify-end items-end p-2  rounded-full">
        <Link className=" text-xl hover:text-viola-600" to="/about">About</Link>
        {isLoading ||!isAuthenticated ?
        <>
            <Link className=" ml-5 text-xl hover:text-viola-600" to="/">Log in</Link>
            <Link className=" ml-5 text-xl hover:text-viola-600" to="/">Sign up</Link>
        </> :
        <button className=" ml-5 text-xl hover:text-viola-600" onClick={() => logout({ returnTo: window.location.origin })}>Log out</button>}
     </nav>
    )
};

export default SecondaryNavbar
