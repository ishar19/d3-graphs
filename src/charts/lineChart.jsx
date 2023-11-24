/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const LineChart = () => {
  const generateData = () => {
    const numberOfDataPoints = 100;
    return d3.range(numberOfDataPoints).map((i) => ({
      date: new Date(2023, 0, i + 1),
      value: Math.random() * 100,
    }));
  };

  const [data, setData] = useState(generateData());
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(10).tickSize(8).tickPadding(8))
        .selectAll("text")
        .attr("fill", "#ffffff"); // Adjust x-axis label color to white

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5).tickSize(8).tickPadding(8))
        .selectAll("text")
        .attr("fill", "#ffffff"); // Adjust y-axis label color to white

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2") // Change line color
      .attr("stroke-width", 2)
      .attr("d", line);

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 3)
      .style("fill", "#69b3a2") // Change dot color
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(".tooltip");
        tooltip
          .transition()
          .duration(100)
          .style("opacity", 1)
          .style("z-index", 10);
        tooltip
          .html(
            `Date: ${d.date.toDateString()}<br/>Value: ${d.value.toFixed(2)}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        const tooltip = d3.select(".tooltip");
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data]);

  return (
    <div
      style={{ position: "relative" }}
      className="bg-gray-900 text-white border border-gray-300"
    >
      <svg ref={svgRef} width={800} height={500}>
        {/* Axes will be drawn within this SVG */}
      </svg>
      <div
        className="tooltip"
        style={{
          opacity: 0,
          position: "absolute",
          zIndex: 10,
          color: "#ffffff",
        }} // Tooltip text color
      />
    </div>
  );
};

export default LineChart;
