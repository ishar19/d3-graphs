import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Skeleton } from "@nextui-org/react";
const PieChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedGender, setSelectedGender] = useState("Both");
  const [processedData, setProcessedData] = useState([]);
  const containerWidth = 300; // Adjust this to suit the container's width
  const [loading, setLoading] = useState(true);
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
        (d) => d["MaritalStatus"]
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

    const margin = 40;
    const width = containerWidth - margin * 2;
    const height = containerWidth - margin * 2;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal().range(d3.schemeCategory10);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg
      .append("g")
      .attr(
        "transform",
        `translate(${containerWidth / 2},${containerWidth / 2})`
      ) // Centering the arcs group
      .selectAll("arc")
      .data(pie(processedData))
      .enter()
      .append("g")
      .attr("class", "arc");

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
      .attr("x", containerWidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d, i) => color(i));

    legend
      .append("text")
      .attr("x", containerWidth - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .attr("fill", "white")
      .text((d) => d.label);
  }, [processedData, containerWidth]);

  return (
    <>
      {loading ? (
        <Skeleton className="relative bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center p-8 h-[40vh]"></Skeleton>
      ) : (
        <div className="relative bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center p-8">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Martial Status Pie Chart
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

          <svg
            ref={svgRef}
            className="bg-gray-900 text-white border border-gray-300"
            width={containerWidth}
            height={containerWidth}
            viewBox={`0 0 ${containerWidth} ${containerWidth}`}
          ></svg>
          <div ref={tooltipRef} className="text-white" />
          <div className="p-4 font-semibold text-white">
            This is a pie chart depicting the number of marital status of
            employees and correlating it different gender.
          </div>
        </div>
      )}
    </>
  );
};

export default PieChart;
