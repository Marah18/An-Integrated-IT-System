import axios from 'axios';
import { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../css/logIn.css';
import { useNavigate } from 'react-router-dom';
import PORT from '../config.js';


function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setBusinessType] = useState('Förskola');
    const [kitchen, setKitchen] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    function handleSubmit(e) {
        e.preventDefault();


        if (!email) {
            setMessage('E-postadress får inte vara tom.');
            return;
        }

        if (!password) {
            setMessage('Lösenord får inte vara tomt.');
            return;
        }


        if (!type) {
            setMessage('Type får inte vara tom.');
            return;
        }

        if (!kitchen) {
            setMessage('Kökets namn får inte vara tomt.');
            return;
        }

        if (email.length < 5 || password.length < 5) {
            setMessage('E-postadress och lösenord måste vara minst 5 tecken långa.');
            return;
        }

        if (!validateEmail(email)) {
            setMessage('Vänligen ange en giltig e-postadress.');
            return;
        }

        const userData = {
            email: email,
            password: password,
            type: type,
            kitchen: kitchen
        };

        axios.post(`http://localhost:${PORT}/create`, userData)
            .then((res) => {
                console.log(res);
                console.log(res.data);
                localStorage.setItem('kitchen', kitchen);

                if (res.data.message === 'User added successfully') {
                    setMessage('Användaren har registrerats framgångsrikt');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2500);

                } else {
                    setMessage('E-post eller köksnamn har redan använts!');
                }
            })
            .catch((err) => {
                console.log(err);
                setMessage('E-post eller köksnamn har redan använts!');
            });
    }


    return (
        <>
            <Header />
            <div className="container-logIn">
                <div className="login-form">
                    <h3>Registrera</h3>
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
                            placeholder="Ange ett lösenord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="kitchen"
                            className="box"
                            placeholder="Ange kökets namn"
                            value={kitchen}
                            onChange={(e) => setKitchen(e.target.value)}
                        />

                        <select value={type} onChange={(e) => setBusinessType(e.target.value)}>
                            <option value="Förskola">Förskola</option>
                            <option value="Grundskola">Grundskola</option>
                            <option value="Gymnasieskola">Gymnasieskola</option>
                            <option value="Äldreomsorg">Äldreomsorg</option>
                            <option value="Sjukhus">Sjukhus</option>
                        </select>
                        <br />

                        <input type="submit" value="Registrera" className="btn" />
                    </form>
                    {message && <p className="message">{message}</p>}
                    {/* <Link to="/LogIn">Inloggningssidan</Link> */}

                </div>
            </div>
            <Footer />
        </>
    );
}
