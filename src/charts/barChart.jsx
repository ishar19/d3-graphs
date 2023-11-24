import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Skeleton, Card } from "@nextui-org/react";
const BarChart = () => {
  const [data, setData] = useState(null);

  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;
    const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const categories = [...new Set(data.map((d) => d.category))];
    const color = d3
      .scaleOrdinal()
      .domain(categories)
      .range(d3.schemeCategory10);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    const yAxis = (g) =>
      g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => color(d.category))
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(".tooltip");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Label: ${d.label}<br/>Value: ${d.value}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        const tooltip = d3.select(".tooltip");
        tooltip.transition().duration(500).style("opacity", 0);
      });

    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);

    // Legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(500,20)");

    legend
      .selectAll(".legend-item")
      .data(categories)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => color(d));

    legend
      .selectAll(".legend-text")
      .data(categories)
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 15)
      .attr("y", (d, i) => i * 20 + 10)
      .text((d) => d)
      .attr("font-size", "12px")
      .attr("fill", "#ffffff");
  }, [data]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetch("https://api.npoint.io/385064785872888c6f06");
      const dataJson = await data.json();
      setData(dataJson);
    };
    const timeOut = setTimeout(() => {
      getData();
    }, 1000);
    return () => clearTimeout(timeOut);
  }, []);
  return (
    <div className="relative">
      {data ? (
        <>
          <svg
            ref={svgRef}
            className="bg-gray-900 text-white border border-gray-300"
            width={600}
            height={400}
          >
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
          <div className="tooltip bg-gray-800 text-white text-xs p-2 rounded absolute opacity-0 pointer-events-none" />
        </>
      ) : (
        <Card
          className="w-[800px] space-y-5 p-4 bg-gray-900 h-[600px]"
          radius="lg"
        >
          <Skeleton className="rounded-lg bg-slate-800">
            <div className="h-[500px] rounded-lg bg-blue-300"></div>
          </Skeleton>
        </Card>
      )}
    </div>
  );
};

export default BarChart;
