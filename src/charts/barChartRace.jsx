/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const BarChartRace = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 800;
    const height = 500;

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const initialData = [
      { name: "CategoryA", value: 30 },
      { name: "CategoryB", value: 50 },
      { name: "CategoryC", value: 70 },
      // Add more initial data points as needed
    ];

    const duration = 2000;

    initialData.sort((a, b) => b.value - a.value);

    const x = d3
      .scaleBand()
      .domain(initialData.map((d) => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(initialData, (d) => d.value)])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("dy", "1em")
      .attr("dx", "-0.5em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(initialData, (d) => d.name)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => colors(d.name));

    svg
      .selectAll(".label")
      .data(initialData, (d) => d.name)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.value)
      .style("font-size", "12px")
      .style("fill", "white");

    const interval = setInterval(() => {
      const newData = initialData.map((d) => ({
        name: d.name,
        value: Math.random() * 100,
      }));

      newData.sort((a, b) => b.value - a.value);

      svg
        .selectAll("rect")
        .data(newData, (d) => d.name)
        .transition()
        .duration(duration)
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => height - y(d.value));

      svg
        .selectAll(".label")
        .data(newData, (d) => d.name)
        .transition()
        .duration(duration)
        .attr("y", (d) => y(d.value) - 5)
        .text((d) => d.value);

      setData(newData);

      setTimeout(() => {
        initialData.forEach((d, i) => {
          d.value = newData[i].value;
        });

        initialData.sort((a, b) => b.value - a.value);
      }, duration);
    }, duration * 2);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      width={1000}
      height={550}
      className="bg-gray-900 text-white border border-gray-300"
    />
  );
};

export default BarChartRace;
