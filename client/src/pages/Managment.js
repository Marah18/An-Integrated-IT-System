// Management.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../css/Management.css'

function Management() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in by retrieving the login status 
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
    }, []);


    function handleLogout() {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    }
    return (
        <>
            <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <div className="management-container">

                <div className="form-contain">
                    <h3>lägga till data</h3>
                    <form>

                        {isLoggedIn ? (
                            <Link to="/db" style={{ textDecoration: 'none' }}>
                                <button type="submit">lägga till data</button>
                            </Link>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <button type="submit">lägga till data</button>
                            </Link>
                        )}

                    </form>
                </div>
                <div className="form-contain">
                    <h3>Visa data</h3>
                    <Link to="/view" style={{ textDecoration: 'none' }}>
                        <button>Visa data</button>
                    </Link>
                </div>
            </div>
            <Footer />
        </>

    );
}

export default Management;
