import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const JobPieChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const legendRef = useRef();
  const [selectedOverTime, setSelectedOverTime] = useState("All");
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("All");
  const [selectedGender, setSelectedGender] = useState("Both");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await d3.csv("../../data.csv");
      setData(fetchedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const legend = d3.select(legendRef.current);

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

    const jobRoles = d3.rollup(
      filteredData,
      (v) => v.length,
      (d) => d.JobRole
    );

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d[1]);

    const dataForPie = pie(Array.from(jobRoles));

    const width = Math.min(window.innerWidth, 400);
    const height = width;

    const radius = Math.min(width, height) / 2;

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%");

    svg
      .selectAll("path")
      .data(dataForPie)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data[0]))
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 0.9)
          .html(`Job Role: ${d.data[0]}, People: ${d.data[1]}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    const legendData = dataForPie.map((d) => ({
      jobRole: d.data[0],
      people: d.data[1],
    }));

    legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .html(
        (d) =>
          `<span style="display:inline-block; width:10px; height:10px; background-color:${color(
            d.jobRole
          )}; margin-right:5px;"></span>${d.jobRole}: ${d.people}`
      )
      .style("color", "white")
      .style("font-size", "12px");
  }, [data, selectedOverTime, selectedMaritalStatus, selectedGender]);

  return (
    <div className="bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center p-6">
      <h2 className="text-xl font-semibold p-4 text-gray-100">
        Job Role Pie Chart
      </h2>
      <div className="flex flex-row flex-wrap justify-center items-center mb-4">
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
      <svg
        ref={svgRef}
        width={400}
        height={400}
        className="bg-gray-900 text-white border border-gray-300"
      ></svg>
      <div ref={tooltipRef} className="text-white"></div>
      <div ref={legendRef} className="text-white"></div>
      <div className="p-4 font-semibold text-white">
        This is a pie chart depicting the number of job roles of employees and
        correlating it different criterias.
      </div>
    </div>
  );
};

export default JobPieChart;
