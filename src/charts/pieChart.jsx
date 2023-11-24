import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const PieChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedGender, setSelectedGender] = useState("Both");
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await d3.csv("../../data.csv");
      let filteredData = data;

      if (selectedGender !== "Both") {
        filteredData = data.filter((d) => d.Gender === selectedGender);
      }

      const counts = d3.rollup(
        filteredData,
        (v) => v.length,
        (d) => d["MaritalStatus"]
      );

      const newData = Array.from(counts, ([label, value]) => ({
        label,
        value,
      }));

      setProcessedData(newData);
    };

    fetchData();
  }, [selectedGender]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("*").remove();

    if (processedData.length === 0) return;

    const margin = 40;
    const width = 400;
    const height = 400;

    const radius = Math.min(width, height) / 2 - margin;

    const color = d3.scaleOrdinal().range(d3.schemeCategory10);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg
      .selectAll("arc")
      .data(pie(processedData))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 0.9)
          .html(`${d.data.label}: ${d.data.value}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    const legend = svg
      .selectAll(".legend")
      .data(processedData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d, i) => color(i));

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .attr("fill", "white")
      .text((d) => d.label);
  }, [processedData]);

  return (
    <>
      <div>
        <label className="text-semibold text-white ">Select Gender : </label>
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          className="bg-gray-800 text-white border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="Both">Both</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <svg
        ref={svgRef}
        className="bg-gray-900 text-white border border-gray-300"
        width={400}
        height={400}
      ></svg>
      <div ref={tooltipRef} className="text-white" />
    </>
  );
};

export default PieChart;
