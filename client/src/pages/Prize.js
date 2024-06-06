
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay, getDate, getISOWeek, startOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserAuth } from "../middleware/UserAuth";
import PORT from '../config.js';
import '../css/calender.css';


const locales = { 'sv-SE': enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

function Prize() {

    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
    const [data, setData] = useState(null);

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

    const [selectedKitchen, setKitchenName] = useState('');
    const [message, setMessage] = useState('');
    const { isLoggedIn, userKitchen: kitchen, userEmail, handleLogout } = UserAuth();
    const [kitchenNames, setKitchenNames] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:${PORT}/users/kitchens`)
            .then(response => {
                const fetchedKitchenNames = response.data.map(kitchen => kitchen.kitchen);
                // Filter out duplicate entries
                const uniqueKitchenNames = Array.from(new Set(fetchedKitchenNames));
                setKitchenNames(uniqueKitchenNames);
            })
            .catch(error => {
                console.error('Error fetching kitchen names:', error);
            });
    }, []);


    useEffect(() => {
        if (selectedDate) {
            const day = selectedDate.toLocaleDateString('sv-SE', { weekday: 'long' });
            const week = getISOWeek(selectedDate);
            const year = selectedDate.getFullYear();

            setDay(day);
            setWeek(week);
            setYear(year);
        }
    }, [selectedDate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (kitchen !== selectedKitchen) {
            setMessage("You are not authorized to add data for this kitchen.");
            return;
        }
        fetch(`http://localhost:${PORT}/kitchens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                year,
                week,
                day,
                amountServFood: amountServFood || 0,
                storageWaste: storageWaste || 0,
                preparationWaste: preparationWaste || 0,
                cookingWaste: cookingWaste || 0,
                servingWaste: servingWaste || 0,
                plateWaste: plateWaste || 0,
                eaters: eaters || 0,
                dish: dish || '',
                unavoidableFoodWaste: unavoidableFoodWaste || 0,
                savedFood: savedFood || 0,
                kitchen: selectedKitchen,
                email: userEmail
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Data inserted successfully:', data);
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
            })
            .catch(err => console.error('Error:', err));
    };

    const handleEditItem = (index) => {
        if (kitchen !== selectedKitchen) {
            setMessage("You are not authorized to edit data for this kitchen.");
            return;
        }
        const editedItem = data.data[index];
        console.log(data.data[index])
        console.log('old data:', JSON.stringify(data));
        const { id, ...editedFields } = editedItem;

        fetch(`http://localhost:${PORT}/kitchenUpdate/${editedItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedFields)
        })
            .then(response => response.json())
            .then(updatedItem => {
                console.log('Data updated successfully:', updatedItem);

                const updatedData = [...data.data];
                updatedData[index] = updatedItem;
                setData({ data: updatedData });
                console.log('New edited item:', JSON.stringify(updatedData));
            })
            .catch(err => console.error('Error:', err));
    };



    const handleDayClick = async (date) => {
        if (!selectedKitchen) {
            window.scrollTo(0, 0);

            setMessage("Please select a kitchen before selecting a day.");

            return;
        }
        if (selectedKitchen) {
            setMessage("");
        }

        setSelectedDate(date);
        console.log(date)
        const selectedDate = date;

        const day = date.toLocaleDateString('sv-SE', { weekday: 'long' });
        // const month = selectedDate.getMonth() + 1;
        const week = getISOWeek(selectedDate);
        const year = selectedDate.getFullYear();


        const formattedDate = `${day} ${week} ${year}`;

        try {
            const response = await axios.post(`http://localhost:${PORT}/prize`, {
                selectedDate: formattedDate,
                kitchen: selectedKitchen
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {

                console.log('Received data:', response.data);
                setData(response.data);
                console.log('Data sent successfully');
            } else {
                console.error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }



    const handleInputChange = (e, property, index) => {
        const newData = [...data.data]; // copy of the data array
        newData[index][property] = e.target.value || ''; // Update the value of the specified property for the item at the given index
        setData({ data: newData });
        console.log(newData)
    };


    const isSpecialDate = (date) => {
        const dayOfMonth = getDate(date);
        return dayOfMonth === 18 || dayOfMonth === 20;
    };

    const customDayPropGetter = (date) => {
        if (selectedDate && date.getTime() === selectedDate.getTime()) {
            return {
                className: 'special-date',
                style: {
                    backgroundColor: 'orange',
                    color: 'white',
                },
            };
        } else if (isSpecialDate(date)) {
            return {
                className: 'special-date',
                style: {
                    backgroundColor: 'green',
                    color: 'white',
                },
            };
        }
        return {};
    };




    const handleSelectEvent = (event, e) => {
        selectedDate.toDateString();

    };

    return (
        <>

            <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <div className="cal-cont">

                <select className="select-cont"
                    value={selectedKitchen}
                    onChange={e => setKitchenName(e.target.value)}
                >
                    <option value="">Select Kitchen</option>
                    {kitchenNames.map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                    ))}

                </select>
                {message && (
                    <div className="error-container">
                        <div>{message}</div>
                        <button onClick={() => setMessage('')}>Close</button>
                    </div>
                )}

                <div >

                    <div>
                        <Calendar
                            className="custom-calendar"
                            localizer={localizer}
                            events={[]}
                            views={['month']}
                            onSelectSlot={(slotInfo) => handleDayClick(slotInfo.start)}
                            selectable
                            style={{ height: 500, margin: '50px' }}
                            dayPropGetter={customDayPropGetter} // custom day rendering
                            onSelectEvent={handleSelectEvent}
                        />
                    </div>

                    {/* Display fetched data if available */}
                    {data === null || !Array.isArray(data.data) || data.data.length === 0 ? (
                        <div className="page-container">
                            <div className="form-add-container">
                                <form onSubmit={handleSubmit}>

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
                                    <button type="submit">Add</button>
                                    {/* {addedMessage && <p>{addedMessage}</p>} */}

                                </form>
                            </div>
                            {/* )} */}
                        </div>
                    ) : (
                        <div className="details-cont">
                            <h2>Detaljerad information om matsvinn</h2>
                            {data.data.map((item, index) => (
                                <div key={index} className="black-border">
                                    <div key={index} className="black-border">
                                        <p><strong>År:</strong> {item.year}</p>
                                        <p><strong>Vecka:</strong> {item.week}</p>
                                        <p><strong>Dag:</strong> {item.day}</p>

                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Mängd serverad mat (kg):</strong></p>
                                            </div>
                                            <div className="input-field">

                                                <input
                                                    type="text"
                                                    value={item.amountServFood || ''}
                                                    onChange={(e) => handleInputChange(e, 'amountServFood', index)}
                                                />
                                            </div>
                                        </div>

                                        <p><strong>Mängd serverad mat minus sparad mat (kg): </strong> {item.minusMat}</p>

                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Lagringssvinn:</strong></p>
                                            </div>
                                            <div className="input-field">
                                                <input
                                                    type="text"
                                                    value={item.storageWaste || ''}
                                                    onChange={(e) => handleInputChange(e, 'storageWaste', index)}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Beredningssvinn:</strong></p>
                                            </div>
                                            <div className="input-field">
                                                <input
                                                    type="text"
                                                    value={item.preparationWaste || ''}
                                                    onChange={(e) => handleInputChange(e, 'preparationWaste', index)}
                                                />
                                            </div>
                                        </div>


                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Tillagningssvinn:</strong></p>
                                            </div>
                                            <div className="input-field">
                                                <input
                                                    type="text"
                                                    value={item.cookingWaste || ''}
                                                    onChange={(e) => handleInputChange(e, 'cookingWaste', index)}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Serveringssvinn (kg):</strong></p>
                                            </div>
                                            <div className="input-field">
                                                <input
                                                    type="text"
                                                    value={item.servingWaste || ''}
                                                    onChange={(e) => handleInputChange(e, 'servingWaste', index)}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Tallrikssvinn (kg):</strong></p>
                                            </div>
                                            <div className="input-field">

                                                <input
                                                    type="text"
                                                    value={item.plateWaste || ''}
                                                    onChange={(e) => handleInputChange(e, 'plateWaste', index)}
                                                />
                                            </div>
                                        </div>


                                        <p><strong>Totalt uppmätt matsvinn (kg):</strong> {item.totalFoodWaste}</p>
                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Antal ätande:</strong></p>
                                            </div>
                                            <div className="input-field">

                                                <input
                                                    type="text"
                                                    value={item.eaters || ''}
                                                    onChange={(e) => handleInputChange(e, 'eaters', index)}
                                                />
                                            </div>
                                        </div>

                                        <p><strong>Totalt uppmätt matsvinn per ätande i gram:</strong> {item.totper}</p>
                                        <p><strong>Totalt uppmätt matsvinn per ätande i procent:</strong> {item.procent}</p>
                                        <p><strong>Uppäten mängd mat per ätande i gram:</strong> {item.Eatenfood}</p>
                                        {/* <p><strong>Sparad mat (kg):</strong> {item.savedFood}</p> */}
                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Sparad mat (kg):</strong></p>
                                            </div>
                                            <div className="input-field">
                                                <input
                                                    type="text"
                                                    value={item.savedFood || ''}
                                                    onChange={(e) => handleInputChange(e, 'savedFood', index)}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Maträtt/er:</strong></p>
                                            </div>
                                            <div className="input-field">
                                                <input
                                                    type="text"
                                                    value={item.dish || ''}
                                                    onChange={(e) => handleInputChange(e, 'dish', index)}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-row">
                                            <div className="input-label">
                                                <p><strong>Oundvikligt matavfall (kg):</strong></p>
                                            </div>

                                            <div className="input-field">
                                                <input
                                                    type="text"
                                                    value={item.unavoidableFoodWaste || ''}
                                                    onChange={(e) => handleInputChange(e, 'unavoidableFoodWaste', index)}
                                                />
                                            </div>
                                        </div>

                                        <button className="edit-value-btn" onClick={() => handleEditItem(index)}>Edit</button>

                                    </div>

                                </div>

                            ))}
                        </div>
                    )}
                </div>

            </div>


            <Footer />
        </>
    );

}
export default Prize;


