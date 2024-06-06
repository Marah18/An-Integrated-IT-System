import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { defaults } from "chart.js/auto";
import "../css/Chart.css";
import PORT from '../config.js';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const ChartByWeek = ({ kitchen, year, week }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataForWeek = async (weekNumber) => {
      try {
        const response = await fetch(`http://localhost:${PORT}/kitchens/${weekNumber}?kitchen=${kitchen}&year=${year}`);
        const jsonData = await response.json();
        console.log(`Fetched data for week ${weekNumber}, year ${year}, and kitchen ${kitchen}:`, jsonData);
        return { week: weekNumber, data: jsonData };
      } catch (error) {
        console.error(`Error fetching data for week ${weekNumber}, year ${year}, and kitchen ${kitchen}:`, error);
        return { week: weekNumber, data: [] };
      } finally {
        setLoading(false);
      }
    };

    const fetchAllWeeksData = async () => {
      setLoading(true);
      const { week: selectedWeek, data: weekData } = await fetchDataForWeek(week);
      if (weekData.length > 0) {
        let filteredData = weekData;
        if (year !== "all") {
          filteredData = filteredData.filter(item => item.year === parseInt(year));
        }
        setData([{ week: selectedWeek, data: filteredData }]);
      } else {
        setData([]);
      }
    };

    fetchAllWeeksData();
  }, [kitchen, year, week]);

  useEffect(() => {
    setLoading(true);
  }, [year, week]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data.length || data.every(({ data }) => data.length === 0)) {
    return <p>Ingen data tillgänglig för den valda veckan.</p>;
  }

  return (
    <div className="App">
      {data.map(({ week, data }) => (
        <div key={week} className="ts">
          {data.reduce((years, item) => {
            const year = item.year;
            if (!years.includes(year)) {
              years.push(year);
            }
            return years;
          }, []).map(year => (
            <div key={year}>
              <h3>Vecka {week} av {year}</h3>
              <div className="chart-container">
                <div className="chart-item">
                  <Bar
                    data={{
                      labels: data.filter(item => item.year === year).map(item => item.day),
                      datasets: [
                        {
                          label: "Total matsvinn",
                          data: data.filter(item => item.year === year).map(item => item.totalFoodWaste),
                          backgroundColor: "rgba(43, 63, 229, 0.8)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      indexAxis: "x",
                      plugins: {
                        title: {
                          display: true,
                          text: `Totalt matsvinn per dag för vecka  ${week}`,
                        },
                      },
                    }}
                  />
                </div>
                <div className="chart-item">
                  <Doughnut
                    data={{
                      labels: data.filter(item => item.year === year).map(item => item.day),
                      datasets: [
                        {
                          label: "Totalt matsvinn",
                          data: data.filter(item => item.year === year).map(item => item.totalFoodWaste),
                          backgroundColor: generateUniqueColors(data.filter(item => item.year === year).length),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: `Total distribution av matavfall för vecka  ${week}`,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// generate unique colors
function generateUniqueColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
    colors.push(color);
  }
  return colors;
}

export default ChartByWeek;
