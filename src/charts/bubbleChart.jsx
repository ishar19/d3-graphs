import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Skeleton, Card } from "@nextui-org/react";

const BubbleChart = () => {
  const [data, setData] = useState();
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data) return;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "#ffffff") // Tooltip text color in dark mode
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px");
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const radius = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.size)])
      .range([5, 25]); // Adjust the range for bubble size

    const simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(5))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => radius(d.size) + 2)
      );

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => radius(d.size))
      .attr("fill", (d, i) => colorScale(i)) // Color based on index
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current);

        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Name: ${d.name}<br/>Value: ${d.value}<br/>Size: ${d.size}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(500).style("opacity", 0);
      });

    simulation.on("tick", () => {
      svg
        .selectAll("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    });

    // Axes
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.size)])
      .nice()
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height + margin.top})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(yAxis);
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 100},${margin.top})`);

    const legendGroups = legend
      .selectAll(".legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 30})`);

    legendGroups
      .append("text")
      .attr("x", 25)
      .attr("y", 10)
      .attr("dy", "0.35em")
      .style("fill", (d, i) => colorScale(i)) // Legend text color
      .text((d) => `${d.name} - ${d.value}`);
    // Added legend labels with values
  }, [data]);
  useEffect(() => {
    const getData = async () => {
      const result = await fetch(
        "https://api.npoint.io/70351f53af3447fffe55/bubbleChart"
      );
      const data = await result.json();
      setData(data);
    };
    const timeOut = setTimeout(() => {
      getData();
    }, 1000);
    return () => clearTimeout(timeOut);
  }, []);
  return (
    <div style={{}}>
      {data ? (
        <svg
          ref={svgRef}
          className="bg-gray-900 text-white border border-gray-300"
        >
          <g
            ref={tooltipRef}
            className="tooltip"
            style={{ opacity: 0, position: "absolute", color: "#ffffff" }}
          />
        </svg>
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

export default BubbleChart;
