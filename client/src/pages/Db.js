import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../css/Db.css';
import PORT from '../config.js';

const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index);
const weekdays = ["Måndag", "Tisdag", "Onsdag", "Tisdag", "Fredag", "Lördag", "Söndag"];
const weekNumbers = Array.from({ length: 52 }, (_, index) => index + 1);




export default function Db() {
    const [data, setData] = useState([]);
    const [year, setYear] = useState('');
    const [day, setDay] = useState('');
    const [week, setWeek] = useState('');
    const [amountServFood, setAmountServFood] = useState('');
    const [storageWaste, setStorageWaste] = useState('');
    const [preparationWaste, setPreparationWaste] = useState('');
    const [cookingWaste, setCookingWaste] = useState('');
    const [servingWaste, setservingWaste] = useState('');
    const [plateWaste, setPlateWaste] = useState('');
    const [eaters, setEaters] = useState('');
    const [dish, setDish] = useState('');
    const [unavoidableFoodWaste, setUnavoidableFoodWaste] = useState('');
    const [savedFood, setSavedFood] = useState('');
    const [email, setEmail] = useState('');
    const [kitchen, setKitchen] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchData();
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);




    function handleLogout() {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        navigate('/')
    }

    const fetchData = () => {

        fetch(`http://localhost:${PORT}/kitchens`)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err));
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        const loggedInUserEmail = localStorage.getItem('email');
        const kitchenName = localStorage.getItem('kitchen');

        fetch(`http://localhost:${PORT}/kitchens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                year,
                week,
                day,
                amountServFood,
                storageWaste,
                preparationWaste,
                cookingWaste,
                servingWaste,
                plateWaste,
                eaters,
                dish,
                unavoidableFoodWaste,
                savedFood,
                email: loggedInUserEmail,
                kitchen: kitchenName
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Data inserted successfully:', data);
                fetchData();
                setYear('');
                setWeek('');
                setDay('');
                setAmountServFood('');
                setStorageWaste('');
                setPreparationWaste('');
                setCookingWaste('');
                setservingWaste('');
                setPlateWaste('');
                setEaters('');
                setDish('');
                setUnavoidableFoodWaste('');
                setSavedFood('');
                setEmail('');
                setKitchen('');
                window.location.href = '/View';
            })
            .catch(err => console.error('Error:', err));
    };

    return (
        <>
            <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <div page-container>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <select value={year} onChange={e => setYear(e.target.value)}>
                            <option value="">välj år</option>
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        <select value={week} onChange={e => setWeek(e.target.value)}>
                            <option value="">välj vecka</option>
                            {weekNumbers.map(weekNumber => (
                                <option key={weekNumber} value={weekNumber}>
                                    {weekNumber}
                                </option>
                            ))}
                        </select>

                        <select value={day} onChange={e => setDay(e.target.value)}>
                            <option value="">välj dag</option>
                            {weekdays.map(day => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={amountServFood}
                            onChange={e => setAmountServFood(e.target.value)}
                            placeholder="Mängd serverad mat (kg): "
                        />
                        <input
                            type="text"
                            value={storageWaste}
                            onChange={e => setStorageWaste(e.target.value)}
                            placeholder="Lagringssvinn: "
                        />

                        <input
                            type="text"
                            value={preparationWaste}
                            onChange={e => setPreparationWaste(e.target.value)}
                            placeholder="Beredningssvinn: "
                        />
                        <input
                            type="text"
                            value={cookingWaste}
                            onChange={e => setCookingWaste(e.target.value)}
                            placeholder="Tillagningssvinn:"
                        />

                        <input
                            type="text"
                            value={servingWaste}
                            onChange={e => setservingWaste(e.target.value)}
                            placeholder="Serveringssvinn (kg):         "
                        />
                        <input
                            type="text"
                            value={plateWaste}
                            onChange={e => setPlateWaste(e.target.value)}
                            placeholder="Tallrikssvinn (kg):"
                        />
                        <input
                            type="text"
                            value={eaters}
                            onChange={e => setEaters(e.target.value)}
                            placeholder="Antal ätande:"
                        />

                        <input
                            type="text"
                            value={savedFood}
                            onChange={e => setSavedFood(e.target.value)}
                            placeholder="Sparad mat (kg):"
                        />
                        <input
                            type="text"
                            value={dish}
                            onChange={e => setDish(e.target.value)}
                            placeholder="Maträtt/er:"
                        />
                        <input
                            type="text"
                            value={unavoidableFoodWaste}
                            onChange={e => setUnavoidableFoodWaste(e.target.value)}
                            placeholder="Oundvikligt matavfall (kg):"
                        />
                        <button type="submit">Lägg till</button>
                        <Link to="/mangment" style={{ textDecoration: 'none' }}>
                            <button type="submit">Tillbacka</button>
                        </Link>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
