import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Skeleton } from "@nextui-org/react";
const BarChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState("Both");
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await d3.csv(
        "https://raw.githubusercontent.com/ishar19/d3-graphs/master/data.csv"
      );
      setLoading(false);
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
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchData();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [selectedGender]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("*").remove();

    if (processedData.length === 0) return;

    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

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

    svg.attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    );

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    chart
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

    chart.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

    chart.append("g").call(yAxis);
  }, [processedData]);

  return (
    <>
      {loading ? (
        <Skeleton className="relative bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center p-8 h-[40vh]"></Skeleton>
      ) : (
        <div className="relative bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center p-8">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Travel Frequency Bar Chart
          </h2>

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
          <div ref={tooltipRef} className="text-white block" />
          <svg
            ref={svgRef}
            className="bg-gray-900 text-white border border-gray-300"
            width="100%"
            height="auto"
          ></svg>
          <div className="p-4 font-semibold text-white">
            This is a bar chart that shows the number of people who travels
            frequently, rarely, and never.
          </div>
        </div>
      )}
    </>
  );
};

export default BarChart;
