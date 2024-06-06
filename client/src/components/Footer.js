import React from 'react';
import { Link } from 'react-router-dom';
import contactIcon from '../img/operator (1).png';
import aboutIcon from '../img/people.png';
import privacyIcon from '../img/insurance (2).png';
import feedbackIcon from '../img/feedback (1).png';
import instagramIcon from '../img/instagram.png';
import facebookIcon from '../img/facebook.png';
import linkedinIcon from '../img/linkedin.png';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <ul className='footer-content'>
                    <li>
                        <div className="footer-col">
                            <div className="col">
                                <div className="col-info">
                                    <img src={contactIcon} alt="Contact Icon"/>
                                    <Link to="/contact">Kontakta oss</Link>
                                </div>
                                <div className="col-info">
                                    <img src={aboutIcon} alt="About Icon"/>
                                    <Link to="/about">Om oss</Link>
                                </div>
                            </div>
                        </div>
                        <div className="footer-col">
                            <div className="col">
                                <div className="col-info">
                                    <img src={privacyIcon} alt="Privacy Icon"/>
                                    <Link to="/privacypolicy">Privacypolicy</Link>
                                </div>
                                <div className="col-info">
                                    <img src={feedbackIcon} alt="Feedback Icon"/>
                                    <Link to="/feedback">Feedback</Link>
                                </div>
                            </div>
                        </div>
                        <div className="horizontal-line"></div>
                        <div className="footer-col">
                            <div className="col">
                                <div className="col-info">
                                    <div className="social-links">
                                        <h4>Sociala media: </h4>
                                        <a href="https://www.instagram.com/kalmarkommun/" target="_blank" rel="noopener noreferrer">
                                            <img src={instagramIcon} alt="Instagram Icon"/>
                                        </a>
                                        <a href="https://www.facebook.com/kalmarkommun/" target="_blank" rel="noopener noreferrer">
                                            <img src={facebookIcon} alt="Facebook Icon"/>
                                        </a>
                                        <a href="https://se.linkedin.com/company/kalmar-municipality" target="_blank" rel="noopener noreferrer">
                                            <img src={linkedinIcon} alt="LinkedIn Icon"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
