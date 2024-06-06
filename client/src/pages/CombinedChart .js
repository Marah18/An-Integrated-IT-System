import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserAuth } from "../middleware/UserAuth";
import ChartByWeek from "./ChartByWeek";
import ChartByYear from "./ChartByYear";
import PORT from '../config.js';

const CombinedChart = () => {
  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchen, setSelectedKitchen] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const { isLoggedIn, handleLogout } = UserAuth();
  const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:${PORT}/users/kitchens`);
        const data = await response.json();

        // Extract unique kitchen names using Set
        const uniqueKitchenNames = new Set(data.map(item => item.kitchen));

        // Convert Set back to an array
        const uniqueKitchens = Array.from(uniqueKitchenNames).map((kitchen, index) => ({ id: index, kitchen }));

        setKitchens(uniqueKitchens);
      } catch (error) {
        console.error("Error fetching kitchens:", error);
      }
    };
    fetchData();
  }, []);


  const handleKitchenChange = (event) => {
    const value = event.target.value;
    setSelectedKitchen(value);
    if (value === "all") {
      navigate('/comprehensive');
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="dropdown-container">
        <label htmlFor="kitchen-select">Välj Kök:</label>
        <select id="kitchen-select" onChange={handleKitchenChange} value={selectedKitchen}>
          <option value="">Välj ett kök</option>
          <option value="all">Alla Kök</option>
          {kitchens.map((item, index) => (
            <option key={index} value={item.kitchen}>{item.kitchen}</option>
          ))}
        </select>

        {selectedKitchen !== "all" && selectedKitchen && (
          <>
            <label htmlFor="year-select">Välj ett år:</label>
            <select id="year-select" onChange={handleYearChange} value={selectedYear}>
              <option value="">Välj ett år</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <label htmlFor="week-select">Välj en vecka:</label>
            <select id="week-select" onChange={handleWeekChange} value={selectedWeek}>
              <option value="">Välj en vecka</option>
              {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
                <option key={week} value={week}>Vecka {week}</option>
              ))}
            </select>
          </>
        )}
      </div>
      <div className="chart-container">
        {(selectedKitchen !== "all" && selectedKitchen && selectedYear && selectedWeek) && (
          <>
            <ChartByWeek kitchen={selectedKitchen} year={selectedYear} week={selectedWeek} />
            <ChartByYear kitchen={selectedKitchen} year={selectedYear} />
          </>
        )}
      </div>
      <Footer />
    </>

  );

};

export default CombinedChart;
