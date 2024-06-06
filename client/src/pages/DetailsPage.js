
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
import PORT from '../config.js';

export default function DetailsPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:${PORT}/kitchens/${id}`)
            .then(res => res.json())
            .then(data => setItem(data))
            .catch(err => console.log(err));
    }, [id]);

    if (!item) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <div className="details-cont">
                <h2> Detaljerad information om matsvinn</h2>
                <div className="black-border">
                    <p><strong>År:</strong> {item.year}</p>
                    <p><strong>Vecka:</strong> {item.week}</p>
                    <p><strong>Dag:</strong> {item.day}</p>
                    <p><strong>Mängd serverad mat  (kg):</strong> {item.amountServFood}</p>
                    <p><strong>Mängd serverad mat minus sparad mat (kg): </strong> {item.minusMat}</p>

                    <p><strong>Lagringssvinn:</strong> {item.storageWaste}</p>
                    <p><strong>Beredningssvinn:</strong> {item.preparationWaste}</p>
                    <p><strong>Tillagningssvinn:</strong> {item.cookingWaste}</p>
                    <p><strong>Kökssvinn (kg):</strong> {item.kitchenWaste}</p>

                    <p><strong>Serveringssvinn (kg):</strong> {item.servingWaste}</p>
                    <p><strong>Tallrikssvinn (kg):</strong> {item.plateWaste}</p>
                    <p><strong>Totalt uppmätt matsvinn (kg):</strong> {item.totalFoodWaste}</p>
                    <p><strong>Antal ätande:</strong> {item.eaters}</p>

                    <p><strong>Totalt uppmätt matsvinn per ätande i gram:</strong> {item.totper}</p>
                    <p><strong>Totalt uppmätt matsvinn per ätande i procent:</strong> {item.procent}</p>
                    <p><strong>Uppäten mängd mat per ätande i gram:</strong> {item.Eatenfood}</p>

                    <p><strong>Sparad mat (kg):</strong> {item.savedFood}</p>
                    <p><strong>Maträtt/er:</strong> {item.dish}</p>
                    <p><strong>Oundvikligt matavfall (kg):</strong> {item.unavoidableFoodWaste}</p>

                    <Link to="/view" style={{ textDecoration: 'none' }}>
                        <button type="submit">Tillbaka</button>
                    </Link>
                </div>
            </div>
            <Footer />
        </>

    );
}
