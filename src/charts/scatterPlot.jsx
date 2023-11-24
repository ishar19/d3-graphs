import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Skeleton } from "@nextui-org/react";
const ScatterPlot = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedGender, setSelectedGender] = useState("Both");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [data, setData] = useState([]);
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        "https://raw.githubusercontent.com/ishar19/d3-graphs/master/data.csv"
      );
      setData(csvData);
      setLoading(false);
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

    const updateChart = () => {
      setLoading(false);
      const width = svgRef.current.clientWidth - margin.left - margin.right;
      const height = window.innerHeight * 0.5 - margin.top - margin.bottom;

      svg.attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

      const x = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, (d) => +d.Age))
        .nice()
        .range([margin.left, width + margin.left]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => +d.MonthlyIncome)])
        .nice()
        .range([height + margin.top, margin.top]); // Adjusted y-axis range

      svg
        .append("g")
        .attr("transform", `translate(0, ${height + margin.top})`)
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

      const dotSize = Math.min(8, width * 0.02); // Adjust dot size based on width

      svg
        .selectAll(".dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => x(+d.Age))
        .attr("cy", (d) => y(+d.MonthlyIncome))
        .attr("r", dotSize)
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

      svg
        .append("text")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "white")
        .text("Age");

      svg
        .append("text")
        .attr(
          "transform",
          `translate(${margin.left - 40}, ${
            height / 2 + margin.top
          }) rotate(-90)`
        )
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "white")
        .text("Monthly Income");
    };

    const handleResize = () => {
      svg.selectAll("*").remove();
      updateChart();
    };

    window.addEventListener("resize", handleResize);

    updateChart();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, selectedGender, selectedDepartment, margin]);

  return (
    <>
      {loading ? (
        <Skeleton className="relative bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center p-8 h-[40vh]"></Skeleton>
      ) : (
        <div className="relative bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center p-8">
          <div className="p-4 font-semibold text-white text-lg">
            Age vs Income Scatter Plot
          </div>
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

          <label className="text-semibold text-white">
            Select Department:{" "}
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-gray-800 text-white border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="All">All</option>
            <option value="Research & Development">
              Research & Development
            </option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
          </select>

          <svg
            ref={svgRef}
            className="bg-gray-900 text-white border border-gray-300"
            width="100%"
            height="auto"
          ></svg>
          <div ref={tooltipRef} className="text-white" />
          <div className="p-4 font-semibold text-white">
            This is a scatter plot depicting the relationship between age and
            income of employees filtering on gender and department.
          </div>
        </div>
      )}
    </>
  );
};

export default ScatterPlot;
