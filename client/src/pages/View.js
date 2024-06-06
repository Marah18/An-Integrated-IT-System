// View.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/View.css"; 
import PORT from '../config.js';

export default function View() {
    const [data, setData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
    }, []);

 
    function handleLogout() {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch(`http://localhost:${PORT}/kitchens`)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err));
    };

    const getColor = (index) => {
        const colors = [
            "#FF6B6B", // Red
            "#FFD166", // Yellow
            "#06D6A0", // Green
            "#118AB2", // Blue
          
            "#8338EC", // Purple
            "#FF4500", // Orange
            "#20B2AA", // Turquoise
            "#FF7F50", // Coral
            "#6495ED"  // Cornflower Blue
          ];
     
        return colors[index % colors.length]; 
    };

    return (
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />
            <div className="card-cont">
                <div className="card-container">
                {data.map((item, index) => (
                    <Link to={`/details/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ backgroundColor: getColor(index) }}>
                            <h3>{item.year} - Vecka {item.week}</h3>
                            <p><strong>Dag:</strong> {item.day}</p>
                            <p><strong>Maträtt:</strong> {item.dish}</p>
                        </div>
                    </Link>
                    
                ))}
                
                </div>
                <div>
                    <Link to="/mangment"  style={{ textDecoration: 'none' }}>
                            <button type="submit">Tillbaka</button>
                    </Link>
                </div>
            </div>
                <Footer />
            </>
    );
}
