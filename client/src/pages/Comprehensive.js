import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { defaults } from "chart.js/auto";
import "../css/Comprehensive.css";
import PORT from '../config.js';


defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Comprehensive = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");


  useEffect(() => {
    const fetchTotalFoodWaste = async () => {
      try {
        let url = `http://localhost:${PORT}/kitchens/totalWaste`;
        if (selectedYear !== "") {
          url += `?year=${selectedYear}`;
        }
        const response = await fetch(url);
        const jsonData = await response.json();
        console.log("Fetched total food waste data:", jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching total food waste data:", error);
        setData([]);
      }
    };

    fetchTotalFoodWaste();
  }, [selectedYear]);

  const uniqueYears = [...new Set(data.map(item => item.year))];
  const allYears = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const aggregatedData = uniqueYears.map(year => {
    const yearData = data.filter(item => item.year === year);
    const kitchenWaste = {};
    yearData.forEach(item => {
      if (kitchenWaste[item.kitchen]) {
        kitchenWaste[item.kitchen] += item.totalFoodWaste;
      } else {
        kitchenWaste[item.kitchen] = item.totalFoodWaste;
      }
    });
    return {
      year: year,
      kitchenWaste: kitchenWaste
    };
  });

  const isDataAvailable = selectedYear === "" || aggregatedData.some(entry => entry.year.toString() === selectedYear);

  return (
    <>
      <div className="comprehensive-container">
        <div className="select-container">
          <label htmlFor="year">Välje ett år:</label>
          <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Alla år</option>
            {allYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="chart-container">
          {isDataAvailable ? (
            aggregatedData
              .filter(entry => selectedYear === "" || entry.year.toString() === selectedYear)
              .map(entry => (
                <div key={entry.year} className="chart-item">
                  <Bar
                    data={{
                      labels: Object.keys(entry.kitchenWaste),
                      datasets: [
                        {
                          label: `Totalt matsvinn för året ${entry.year}`,
                          data: Object.values(entry.kitchenWaste),
                          backgroundColor: "rgba(43, 63, 229, 0.8)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      indexAxis: "x",
                    }}
                  />
                </div>
              ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

    </>
  );
};

export default Comprehensive;
