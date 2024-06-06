import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logInIcon from '../img/logIn/logInIcon.jpeg';
import { UserAuth } from "../middleware/UserAuth";

const Header = () => {
    const { isLoggedIn, userKitchen: kitchen, userEmail, handleLogout } = UserAuth();
    const [menuActive, setMenuActive] = useState(false);


    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <div className='body'>
            <header>
                <div id="menu-bar" className={menuActive ? "active" : ""} onClick={toggleMenu}>
                    <p>Menu</p>
                </div>
                <nav className={`navbar ${menuActive ? "active" : ""}`}>
                    <Link to="/">Hem</Link>
                    <Link to="/prize">Matsvinn Hantering</Link>
                    <Link to="/charts">Visualisering</Link>
                    <Link to="/top">Rankning</Link>
                    {isLoggedIn ? (
                        <>
                            <button className="navbar-icon-btn"

                                onClick={handleLogout}>
                                <p> Logga ut, {kitchen} </p>   

                            </button>
                        </>
                    ) : (
                        <Link to="/LogIn" className="navbar-icon">
                            <img src={logInIcon} className="navbar-icon-img" alt="log in icon" />
                        </Link>
                    )}
                </nav>
            </header>
        </div>
    );
};

export default Header;
