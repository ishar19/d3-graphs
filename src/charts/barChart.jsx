import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const BarChart = () => {
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
        (d) => d["BusinessTravel"]
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

    const margin = { top: 20, right: 30, bottom: 70, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(processedData.map((d) => d.label))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.value)])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll(".bar")
      .data(processedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10]) // Different color for each category
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 0.9)
          .html(` ${d.label} : ${d.value}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height + margin.top})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(yAxis);
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
        width={"50vw"}
        height={400}
      ></svg>
      <div ref={tooltipRef} className="text-white" />
    </>
  );
};

export default BarChart;
