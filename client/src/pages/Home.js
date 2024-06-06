import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/Home.css';
import im1 from "../img/logIn/kalmarSlot.jpeg";
import im2 from "../img/home/savefood4.jpeg";
import im3 from "../img/home/savefood2.webp";
import im4 from "../img/home/savefood3.jpeg";

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const slides = [
        { image: im1, mainText: "Sveriges matsvinn måste minska", additionalText: "Regering har beslutat om att Sveriges matsvinn ska minska enligt målen i Agenda 2030. Ambitionen är att hålla ännu högre takt." },
        { image: im2, mainText: "En tredjedel av den matproduktionen slängs.", additionalText: " Matsvinn representerar den mat som slängs i onödan, trots att den kunde ha konsumerats om den hanterats mer effektivt." },
        { image: im3, mainText: "Effektiva Strategier för Att Minska Matsvinnet", additionalText: "Genom att jämföra och utforska bästa strategier har offentliga kök en betydande möjlighet att minska detta slöseri genom att effektivisera sin verksamhet." },
        { image: im4, mainText: "Matslängning är ohållbart. ", additionalText: "Att producera och slänga mat är ohållbart då det innebär onödig användning av energi, vatten och mark, ur miljömässig, ekonomisk och etisk synvinkel" }
    ];

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
        const storedEmail = localStorage.getItem('email');
        setUserEmail(storedEmail || ''); 
    }, []);

    const handleClick = (index) => {
        setCurrentSlide(index);
    };

    function handleLogout() {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    }

    return (
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />
            <section className="home" id="home">
                <div className="content">
                    <h3 className="black-text">{slides[currentSlide].mainText}</h3>
                    <p className="black-text">{slides[currentSlide].additionalText}</p>

                </div>

                <div className="controls">
                    {slides.map((slide, index) => (
                        <span key={index} className={`imge-btn ${currentSlide === index ? 'blue' : ''}`} onClick={() => handleClick(index)}></span>
                    ))}
                </div>
                <div className="img-container">
                    {/* the image for the current slide */}
                    <img src={slides[currentSlide].image} id="img-slider" alt="img" />
                </div>
            </section>

            <Footer />
        </>
    );
}
