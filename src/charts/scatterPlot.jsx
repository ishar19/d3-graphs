import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const ScatterPlot = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const xLabelRef = useRef();
  const yLabelRef = useRef();
  const [selectedGender, setSelectedGender] = useState("Both");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv("../../data.csv");
      setData(csvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("*").remove();

    if (data.length === 0) return;

    let filteredData = data;

    if (selectedGender !== "Both") {
      filteredData = filteredData.filter((d) => d.Gender === selectedGender);
    }

    if (selectedDepartment !== "All") {
      filteredData = filteredData.filter(
        (d) => d.Department === selectedDepartment
      );
    }

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => +d.Age))
      .nice()
      .range([margin.left, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => +d.MonthlyIncome)])
      .nice()
      .range([height, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    const colorScale = d3
      .scaleOrdinal()
      .domain([
        "Male",
        "Female",
        "Research & Development",
        "Sales",
        "Human Resources",
      ])
      .range(["blue", "red", "green", "orange", "purple"]);

    svg
      .selectAll(".dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(+d.Age))
      .attr("cy", (d) => y(+d.MonthlyIncome))
      .attr("r", 5)
      .style("fill", (d) => colorScale(d.Gender + d.Department))
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 0.9)
          .html(
            `Age: ${d.Age}<br>Income: ${d.MonthlyIncome}<br>Gender: ${d.Gender}<br>Department: ${d.Department}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Labels below the graph
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Age")
      .attr("ref", xLabelRef);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Monthly Income")
      .attr("ref", yLabelRef);
  }, [data, selectedGender, selectedDepartment]);

  return (
    <>
      {/* Dropdowns for filters */}
      <div>
        <label className="text-semibold text-white">Select Gender: </label>
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
      <div>
        <label className="text-semibold text-white">Select Department: </label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="bg-gray-800 text-white border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="All">All</option>
          <option value="Research & Development">Research & Development</option>
          <option value="Sales">Sales</option>
          <option value="Human Resources">Human Resources</option>
        </select>
      </div>
      <svg
        ref={svgRef}
        className="bg-gray-900 text-white border border-gray-300"
        width={600}
        height={400}
      ></svg>
      <div ref={tooltipRef} className="text-white" />
    </>
  );
};

export default ScatterPlot;
