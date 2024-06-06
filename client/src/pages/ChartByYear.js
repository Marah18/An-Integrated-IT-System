import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { defaults } from "chart.js/auto";
import "../css/Chart.css";
import PORT from '../config.js';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const ChartByYear = ({ kitchen, year }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTotalFoodWaste = async () => {
      try {
        const response = await fetch(`http://localhost:${PORT}/kitchens/total?kitchen=${kitchen}&year=${year}`);
        const jsonData = await response.json();
        console.log("Fetched total food waste data:", jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching total food waste data:", error);
        setData([]);
      }
    };

    fetchTotalFoodWaste();
  }, [kitchen, year]);

  const uniqueYears = [...new Set(data.map(item => item.year))];

  return (
    <>
      {data.length > 0 && uniqueYears.includes(parseInt(year)) ? (
        <div className="App">
          {uniqueYears.map(yearData => {
            if (parseInt(yearData) !== parseInt(year)) return null;
            const aggregatedData = data
              .filter(item => item.year === parseInt(year))
              .map(week => ({
                week: `Vecka: ${week.week}`,
                totalFoodWaste: week.totalFoodWaste
              }));
            const barChartTitle = `Totalt matsvinn för år  ${year}`;
            const doughnutChartTitle = `Totalt fördelning ${year}`;
            const lineChartTitle = `Totalt matsvinnstrend för år ${year}`;
            return (
              <div key={year} className="ts">
                <div className="test">
                  <h3 className="chart-title">{barChartTitle}</h3>
                  <div className="chart-container">
                    <div className="chart-item">
                      <Bar
                        data={{
                          labels: aggregatedData.map(item => item.week),
                          datasets: [
                            {
                              label: "Total matsvinn",
                              data: aggregatedData.map(item => item.totalFoodWaste),
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
                  </div>
                </div>
                <div className="test">
                  <h3 className="chart-title">{doughnutChartTitle}</h3>
                  <div className="chart-container">
                    <div className="chart-item">
                      <Doughnut
                        data={{
                          labels: aggregatedData.map(item => item.week),
                          datasets: [
                            {
                              label: "Total matsvinn",
                              data: aggregatedData.map(item => item.totalFoodWaste),
                              backgroundColor: generateUniqueColors(aggregatedData.length),
                              borderWidth: 1,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="test">
                  <h3 className="chart-title">{lineChartTitle}</h3>
                  <div className="chart-container">
                    <div className="chart-item">
                      <Line
                        data={{
                          labels: aggregatedData.map(item => item.week),
                          datasets: [
                            {
                              label: "Total matsvinn",
                              data: aggregatedData.map(item => item.totalFoodWaste),
                              borderColor: "rgba(75, 192, 192, 1)",
                              borderWidth: 1,
                              fill: false,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Ingen data tillgänglig för den valda året.</p>
      )}
    </>
  );
};

// Function to generate unique colors
function generateUniqueColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
    colors.push(color);
  }
  return colors;
}

export default ChartByYear;
