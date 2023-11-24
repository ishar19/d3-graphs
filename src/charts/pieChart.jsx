/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const PieChart = () => {
  const generateData = () => {
    const numberOfCategories = 5;
    return d3.range(numberOfCategories).map((i) => ({
      category: `Category ${i + 1}`,
      value: Math.random() * 100,
    }));
  };

  const [data, setData] = useState(generateData());

  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 50);

    const arcs = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.category))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `Category: ${d.data.category}<br/>Value: ${d.data.value.toFixed(2)}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(500).style("opacity", 0);
      });

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => d.data.category)
      .style("fill", "white")
      .style("font-size", "12px");

    // Legend
    const legend = svg
      .selectAll(".legend")
      .data(pie(data).map((d) => d.data.category))
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(10,${i * 20})`);

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => color(d));

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("fill", "white")
      .text((d) => d);
  }, [data]);

  return (
    <div style={{}}>
      <svg
        ref={svgRef}
        width={500}
        height={500}
        className="bg-gray-900 text-white border border-gray-300"
      />
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{
          opacity: 0,
          position: "absolute",
          backgroundColor: "black",
          color: "white",
          padding: "5px",
        }}
      />
    </div>
  );
};

export default PieChart;
