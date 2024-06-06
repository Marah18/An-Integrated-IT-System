import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/Top.css';
import PORT from '../config.js';

// Import images for the top 3 ranks
import gold from '../img/gold-medal.png';
import silver from '../img/silver-medal.png';
import bronze from '../img/bronze.png';

const Top = () => {
    const [data, setData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:${PORT}/kitchens/totalWaste`);
                const aggregatedData = response.data.reduce((acc, item) => {
                    if (acc[item.kitchen]) {
                        acc[item.kitchen] += item.totalFoodWaste;
                    } else {
                        acc[item.kitchen] = item.totalFoodWaste;
                    }
                    return acc;
                }, {});

                const sortedData = Object.keys(aggregatedData)
                    .map(kitchen => ({ kitchen, totalFoodWaste: aggregatedData[kitchen] }))
                    .sort((a, b) => a.totalFoodWaste - b.totalFoodWaste);

                setData(sortedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <>
            <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <div className="top-container">
                <h2>Top Kitchens by Food Waste</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Kitchen</th>
                            <th>Total Food Waste (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.kitchen}>
                                <td>
                                    {index === 0 && <img src={gold} alt="Gold medal" className="medal" />}
                                    {index === 1 && <img src={silver} alt="Silver medal" className="medal" />}
                                    {index === 2 && <img src={bronze} alt="Bronze medal" className="medal" />}
                                    {index > 2 && index + 1}
                                </td>
                                <td>{item.kitchen}</td>
                                <td>{item.totalFoodWaste.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
};

export default Top;
