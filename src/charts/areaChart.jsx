/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const AreaChart = () => {
  const [data, setData] = useState([
    { date: new Date("2023-01-01"), value: 20, category: "Category A" },
    { date: new Date("2023-02-01"), value: 35, category: "Category A" },
    { date: new Date("2023-03-01"), value: 25, category: "Category A" },
    { date: new Date("2023-04-01"), value: 40, category: "Category A" },
    { date: new Date("2023-05-01"), value: 30, category: "Category A" },
    { date: new Date("2023-01-01"), value: 15, category: "Category B" },
    { date: new Date("2023-02-01"), value: 28, category: "Category B" },
    { date: new Date("2023-03-01"), value: 22, category: "Category B" },
    { date: new Date("2023-04-01"), value: 35, category: "Category B" },
    { date: new Date("2023-05-01"), value: 25, category: "Category B" },
  ]);

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;

    // Clear previous elements
    svg.selectAll("*").remove();

    const categories = [...new Set(data.map((d) => d.category))];
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const area = d3
      .area()
      .x((d) => x(d.date))
      .y0(y(0))
      .y1((d) => y(d.value));

    svg
      .selectAll(".area")
      .data(categories)
      .enter()
      .append("path")
      .attr("class", "area")
      .datum((category) => data.filter((d) => d.category === category))
      .attr("fill", (d) => color(d[0].category))
      .attr("opacity", 0.7)
      .attr("d", area);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .attr("stroke", "#ffffff");
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .attr("stroke", "#ffffff");

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 5)
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(".tooltip");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Category: ${d.category}<br/>Value: ${d.value}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        const tooltip = d3.select(".tooltip");
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100},${margin.top})`);

    legend
      .selectAll(".legend-item")
      .data(categories)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => color(d));

    legend
      .selectAll(".legend-text")
      .data(categories)
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 15)
      .attr("y", (d, i) => i * 20 + 10)
      .text((d) => d)
      .attr("font-size", "12px")
      .attr("fill", "#ffffff");
  }, [data]);

  return (
    <div
      style={{ position: "relative" }}
      className="bg-gray-900 text-white border border-gray-300"
    >
      <svg
        ref={svgRef}
        width={1000}
        height={500}
        // className="bg-gray-900 text-white border border-gray-300"
      >
        {/* Axes will be drawn within this SVG */}
        <div
          className="tooltip"
          style={{ opacity: 0, position: "absolute", zIndex: 10 }}
        />
      </svg>
    </div>
  );
};

export default AreaChart;
