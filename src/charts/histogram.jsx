import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const Histogram = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedOverTime, setSelectedOverTime] = useState("All");
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("All");
  const [selectedGender, setSelectedGender] = useState("Both");
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

    if (selectedOverTime !== "All") {
      filteredData = filteredData.filter(
        (d) => d.OverTime === selectedOverTime
      );
    }

    if (selectedMaritalStatus !== "All") {
      filteredData = filteredData.filter(
        (d) => d.MaritalStatus === selectedMaritalStatus
      );
    }

    if (selectedGender !== "Both") {
      filteredData = filteredData.filter((d) => d.Gender === selectedGender);
    }

    const jobLevels = d3.group(filteredData, (d) => +d.JobLevel);

    const margin = { top: 20, right: 20, bottom: 50, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(Array.from(jobLevels.keys()).sort((a, b) => a - b))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(Array.from(jobLevels.values()).map((d) => d.length))])
      .range([height, 0]);

    // const color = d3.scaleOrdinal().range(["#4CAF50", "#FF9800"]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const xAxisGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)")
      .attr("fill", "#ffffff");

    xAxisGroup.selectAll("text").attr("fill", "#ffffff"); // Adjust x-axis text color

    const yAxisGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    yAxisGroup.selectAll("text").attr("fill", "#ffffff"); // Adjust y-axis text color

    svg
      .selectAll(".bar")
      .data(Array.from(jobLevels))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d[0]) + margin.left)
      .attr("y", (d) => y(d[1].length) + margin.top)
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[1].length))
      .attr("fill", "#4CAF50"); // Set bar color

    svg
      .selectAll(".bar")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 0.9)
          .html(
            `JobLevel: ${d[0]}, Male: ${
              d[1].filter((e) => e.Gender === "Male").length
            }, Female: ${d[1].filter((e) => e.Gender === "Female").length}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  }, [data, selectedOverTime, selectedMaritalStatus, selectedGender]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
      >
        <label style={{ marginRight: "5px", color: "white" }}>
          Select OverTime:{" "}
        </label>
        <select
          value={selectedOverTime}
          onChange={(e) => setSelectedOverTime(e.target.value)}
          className="filter-select bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 mr-2"
        >
          <option value="All">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <label
          style={{ marginLeft: "10px", marginRight: "5px", color: "white" }}
        >
          Select Marital Status:{" "}
        </label>
        <select
          value={selectedMaritalStatus}
          onChange={(e) => setSelectedMaritalStatus(e.target.value)}
          className="filter-select bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 mr-2"
        >
          <option value="All">All</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
        </select>
        <label
          style={{ marginLeft: "10px", marginRight: "5px", color: "white" }}
        >
          Select Gender:{" "}
        </label>
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          className="filter-select bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1"
        >
          <option value="Both">Both</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <svg ref={svgRef} width={600} height={400}></svg>
      <div ref={tooltipRef} className="text-white">
        Hover on bars for more info
      </div>
    </div>
  );
};

export default Histogram;
