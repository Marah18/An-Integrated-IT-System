
import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import pic1 from "../img/picture1.jpeg"
import pic2 from "../img/picture2.jpg"
import pic3 from "../img/picture3.png"
import '../css/About.css';

export default function About() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const images = document.querySelectorAll('.image-container img');
            images.forEach(image => {
                image.style.display = 'none'; // Hide all images
            });
            const nextIndex = (index + 1) % images.length; // Calculate next image index
            images[nextIndex].style.display = 'block'; // Show next image
            setIndex(nextIndex); // Update index state
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(intervalId);
    }, [index]); // Add index as dependency

    return (
        <>
            <Header />
            <div className="about-main">
                <div className="info-sec">
                    <div className="image-container">
                        <img className="cont-img" src={pic1} alt="pic 1" />
                        <img className="cont-img" src={pic2} alt="pic 2" />
                        <img className="cont-img" src={pic3} alt="pic 3" />

                    </div>

                    <div className="about-col">
                        <h1>About us</h1>
                        <p>Welcome to <strong>PlanetGuard: Community Solutions for Sustainable Living,</strong></p>
                        <p>your leading platform for effective food waste management</p>
                        <p>and reduction solutions. At our website, we are committed to</p>
                        <p>empowering schools and communities to tackle the pressing issue</p>
                        <p>of food waste while promoting sustainability and environmental stewardship.</p>
                    </div>

                    <div class="about-col">
                        <h1>Our Mission</h1>
                        <p>At <strong>PlanetGuard: Community Solutions for Sustainable Living,</strong> our mission is simple</p>
                        <p>yet impactful: to revolutionize food waste management practices and facilitate</p>
                        <p>meaningful reductions in food waste across schools and communities. </p>
                        <p>We believe that by providing innovative tools and resources, we can </p>
                        <p>empower schools to track, analyze, and reduce food waste effectively, </p>
                        <p>ultimately creating a more sustainable future for generations to come.</p>
                    </div>

                    <div class="about-col">
                        <h1>What We Offer</h1>
                        <p>Our platform offers a comprehensive suite of features designed to</p>
                        <p>streamline food waste management processes and drive tangible results. </p>
                        <p>Schools can easily enter data about the amount of food wasted, which is </p>
                        <p>then visualized in intuitive charts and graphs, providing valuable</p>
                        <p> insights into consumption patterns and waste trends.Additionally, we organize</p>
                        <p>engaging competitions between schools, rewarding those with the</p>
                        <p>lowest food waste with exciting prizes and incentives, fostering healthy</p>
                        <p>competition and driving collective action towards reducing food waste.</p>
                    </div>

                    <div class="about-col">
                        <h1>Why Choose Us?</h1>
                        <p><strong>Expertise:</strong> With years of experience in food waste management and sustainability</p>

                        <p>initiatives, our team brings unparalleled expertise to the table, ensuring that our</p>
                        <p>platform delivers real and measurable results.</p>
                        <p><strong> Impactful Solutions:</strong>Our innovative approach leverages cutting-edge technology </p>
                        <p>to provide actionable insights and solutions that drive meaningful change in food </p>
                        <p>waste reduction efforts.</p>
                        <p> <strong>Community Engagement:</strong>We are dedicated to fostering a sense of community and </p>
                        <p>collaboration among schools, students, and stakeholders, encouraging collective </p>
                        <p>action towards a common goal of reducing food waste and promoting sustainability.</p>
                    </div>

                    <div class="about-col">
                        <h1>About the Website</h1>
                        <p>Founded with a vision to address the critical issue of food waste in schools and</p>
                        <p>communities, the website is dedicated to providing schools with the tools</p>
                        <p>and resources they need to make a difference. Our platform empowers schools to </p>
                        <p>take proactive measures to monitor, analyze, and reduce food waste, ultimately </p>
                        <p>contributing to a healthier environment and a more sustainable future for all.</p>
                        <p>Thank you for choosing PlanetGuard: Community Solutions for Sustainable Living.</p>
                        <p>Together, we can make a positive impact in the fight against food waste and </p>
                        <p>create a brighter, more sustainable tomorrow for everyone.</p>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}
