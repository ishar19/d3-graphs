/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const ScatterPlot = () => {
  // Generate a dataset for the scatter plot
  const generateData = () => {
    const numberOfPoints = 300;
    return d3.range(numberOfPoints).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      category: Math.random() > 0.5 ? "Category A" : "Category B",
    }));
  };

  const [data, setData] = useState(generateData());

  const svgRef = useRef();
  const tooltipRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x)])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(["Category A", "Category B"])
      .range(["#FFC107", "#03DAC6"]); // Adjust colors for dark mode

    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 5)
      .attr("fill", (d) => color(d.category))
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `Category: ${d.category}<br/>X: ${d.x.toFixed(2)}, Y: ${d.y.toFixed(
              2
            )}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(500).style("opacity", 0);
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
      .attr("fill", "#ffffff"); // Adjust axis text color for dark mode

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("fill", "#ffffff"); // Adjust axis text color for dark mode

    // Legend
    const legend = d3.select(legendRef.current);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(color.domain())
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .attr("transform", "translate(500,20)")
      .style("display", "flex")
      .style("align-items", "center");

    legendItems
      .append("div")
      .attr("class", "legend-color")
      .style("background-color", (d) => color(d))
      .style("width", "10px")
      .style("height", "10px")
      .style("margin-right", "5px");

    legendItems
      .append("div")
      .attr("class", "legend-text")
      .text((d) => d)
      .style("color", "#ffffff");
  }, [data]);

  return (
    <div style={{}}>
      <svg
        ref={svgRef}
        width={800}
        height={500}
        className="bg-gray-900 text-white border border-gray-300"
      />
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{ opacity: 0, position: "absolute", color: "#ffffff" }} // Adjust tooltip text color for dark mode
      />
      <div
        ref={legendRef}
        className="legend"
        style={{
          display: "flex",
          flexDirection: "column",
          color: "#ffffff",
          marginTop: "20px",
          marginRight: "20px",
        }}
      />
    </div>
  );
};

export default ScatterPlot;
