import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/logIn.css';
import { Link, useNavigate } from 'react-router-dom';
import PORT from '../config.js';

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('email'));
    const [loggedInKitchen, setLoggedInKitchen] = useState(localStorage.getItem('kitchen'));

    const navigate = useNavigate();

    useEffect(() => {
        // Update isLoggedIn state when localStorage changes
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        setLoggedInUser(localStorage.getItem('email')); // Update logged in user's email
        setLoggedInKitchen(localStorage.getItem('kitchen'));
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password) {
            setMessage('E-post och lösenord får inte vara tomma.');
            return;
        }

        const userData = {
            email: email,
            password: password,
        };

        axios.post(`http://localhost:${PORT}/logging`, userData)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setMessage('Login successful!');
                    setIsLoggedIn(true);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('email', email);
                    setLoggedInUser(email);
                    localStorage.setItem('kitchen', res.data.user.kitchen);
                    setLoggedInKitchen(res.data.user.kitchen);

                    console.log('Kitchen from response:', res.data.user.kitchen);
                    console.log('loggedInKitchen:', loggedInKitchen);

                    navigate('/');

                } else {
                    setMessage('Invalid email or password.');
                }
            })
            .catch((err) => {
                console.log(err);
                setMessage('Fel email eller lösenord');
            });
    }

    function handleLogout() {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('email');
        localStorage.removeItem('kitchen')
        setLoggedInUser('');
        setLoggedInKitchen('');
    }

    return (
        <>
            <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} loggedInUser={loggedInUser} />
            <div className="container-logIn">
                <div className="login-form">
                    <h3>Logga in</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="box"
                            placeholder="Ange din e-postadress"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="box"
                            placeholder="Ange ditt lösenord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input type="submit" value="Login now" className="btn" />
                    </form>
                    {message && <p className="message">{message}</p>}
                    <p> Har du inget konto ! </p>
                    {/* Display logged in user's email */}
                    <Link to="/register">Registrera dig</Link>
                </div>
            </div>
            <Footer />
        </>
    );
}
