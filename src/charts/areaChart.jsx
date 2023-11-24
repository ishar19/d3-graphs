import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const AreaChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("All");
  const [selectedOverTime, setSelectedOverTime] = useState("All");
  const [selectedJobLevel, setSelectedJobLevel] = useState("All");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await d3.csv("../../data.csv");
      setData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("*").remove();

    if (data.length === 0) return;

    let filteredData = data;

    if (selectedMaritalStatus !== "All") {
      filteredData = data.filter(
        (d) => d.MaritalStatus === selectedMaritalStatus
      );
    }

    if (selectedOverTime !== "All") {
      filteredData = data.filter((d) => d.OverTime === selectedOverTime);
    }

    if (selectedJobLevel !== "All") {
      filteredData = data.filter((d) => d.JobLevel === selectedJobLevel);
    }

    const color = d3
      .scaleOrdinal()
      .domain(["Male", "Female"])
      .range(["blue", "red"]);

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([20, 60]).range([0, width]);
    const y = d3.scaleLinear().domain([1, 5]).range([height, 0]);

    const area = d3
      .area()
      .x((d) => x(+d.Age))
      .y0(height)
      .y1((d) => y(+d.JobLevel));

    svg
      .append("path")
      .datum(filteredData)
      .attr("d", area)
      .attr("fill", "lightblue");

    filteredData.forEach((d) => {
      svg
        .append("circle")
        .attr("cx", x(+d.Age))
        .attr("cy", y(+d.JobLevel))
        .attr("r", 5)
        .attr("fill", color(d.Gender))
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 0.9)
            .html(
              `Age: ${d.Age}, JobLevel: ${d.JobLevel}, Gender: ${d.Gender}, Department: ${d.Department}`
            )
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });
    });
  }, [data, selectedMaritalStatus, selectedOverTime, selectedJobLevel]);

  return (
    <>
      <div>
        <label>Select Marital Status: </label>
        <select
          value={selectedMaritalStatus}
          onChange={(e) => setSelectedMaritalStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
        </select>
        <label>Select OverTime: </label>
        <select
          value={selectedOverTime}
          onChange={(e) => setSelectedOverTime(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <label>Select Job Level: </label>
        <select
          value={selectedJobLevel}
          onChange={(e) => setSelectedJobLevel(e.target.value)}
        >
          <option value="All">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <svg ref={svgRef} width={600} height={400}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
};

export default AreaChart;
