

import React, { useEffect, useRef, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as d3 from 'd3';
import axios from 'axios';
import "../css/Visualization.css";
import PORT from '../config.js';
import { UserAuth } from "../middleware/UserAuth";
import Comprehensive from './Comprehensive';

const Visualization = () => {
  const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index);

  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [weekNumber, setWeekNumber] = useState(1);
  const weekNumbers = Array.from({ length: 52 }, (_, index) => index + 1);
  const [yearNumber, setYear] = useState(2024);
  const { isLoggedIn, handleLogout } = UserAuth();

  const clearVisualization = () => {
    d3.select(svgRef.current).selectAll("*").remove();
  };

  useEffect(() => {
    // dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 50, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    axios.get(`http://localhost:${PORT}/vis?week=${weekNumber}&year=${yearNumber}`)
      .then(response => {
        const { data } = response;
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [weekNumber, yearNumber]);

  useEffect(() => {
    // Clear previous visualization
    clearVisualization();

    if (data.length === 0) return;

    const subgroups = ["preparationWaste", "cookingWaste", "servingWaste", "plateWaste"];

    const groups = Array.from(new Set(data.map(d => d.kitchen)));

    const margin = { top: 30, right: 30, bottom: 50, left: 80 };
    const width = 700 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    // represent kitchens as X axis
    const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2]);
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-20)")
      .style("text-anchor", "end")
      .attr("dy", "-0.2em")
      .attr("dx", "-0.5em")
      .style("overflow", "visible");
    // represent data as Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.sum(subgroups, key => d[key]))])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#d62728", "#1f77b4", "#ffffcc", "#2ca02c"]);
    const stackedData = d3.stack()
      .keys(subgroups)
      .value((d, key) => d[key])
      (data);

    // Show the bars
    svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter().append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter().append("rect")
      .attr("x", d => x(d.data.kitchen))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    svg.selectAll("rect")
      .on("mouseover", (event, d) => {
        const subgroupValue = d[1] - d[0];

        const subgroupName = d3.select(event.target.parentNode).datum().key;
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`${subgroupName}: ${subgroupValue}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })

      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, 0)`);

    subgroups.forEach((subgroup, i) => {
      legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 15)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(subgroup));

      legend.append("text")
        .attr("x", 15)
        .attr("y", i * 20)
        .attr("dy", ".35em")
        .style("font-size", "12px")
        .text(subgroup);
    });

  }, [data]);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="visualization-container">
        <div className="controls-container">
          <div className="select-container">
            <label htmlFor="weekNumber">Välj veckonummer:</label>
            <select id="weekNumber" value={weekNumber} onChange={(e) => setWeekNumber(parseInt(e.target.value))}>
              <option value="">Välj en vecka:</option>
              {weekNumbers.map(weekNumber => (
                <option key={weekNumber} value={weekNumber}>
                  {weekNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="select-container">
            <label htmlFor="year">Välj ett år:</label>
            <select id="year" value={yearNumber} onChange={(e) => setYear(parseInt(e.target.value))}>
              <option value="">Välj ett år</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Render a message if no data is available */}
        {data.length === 0 && (
          <div className="chart-container">
            <p>Ingen data tillgänglig för den valda veckan och året.</p>
          </div>
        )}

        <svg ref={svgRef}></svg>
      </div>

      <Comprehensive year={yearNumber} week={weekNumber} />
      <Footer />


    </>
  );
}

export default Visualization;
