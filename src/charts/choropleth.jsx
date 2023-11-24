import { useRef, useEffect } from "react";
import * as d3 from "d3";
// import usStates from "./us-states.json"; // GeoJSON data for US states
// Mock GeoJSON data for US states
const usStates = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "AL",
      properties: { name: "Alabama" },
      geometry: {
        type: "Polygon",
        coordinates: [
          // Coordinates for Alabama
          [
            [-87.359296, 35.00118],
            [-85.606675, 34.984749],
          ],
        ],
      },
      value: Math.floor(Math.random() * 100), // Random data for Alabama
    },
    {
      type: "Feature",
      id: "AK",
      properties: { name: "Alaska" },
      geometry: {
        type: "Polygon",
        coordinates: [
          // Coordinates for Alaska
          [
            [-131.602021, 55.117982],
            [-131.569159, 55.28229],
          ],
        ],
      },
      value: Math.floor(Math.random() * 100), // Random data for Alaska
    },
    // Add more states with random data
  ],
};

const ChoroplethMap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 800;
    const height = 500;

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues) // Choose your color scale
      .domain([0, 100]); // Update the domain based on your data range

    // Example random data for the states
    const stateData = new Map();
    usStates.features.forEach((state) => {
      stateData.set(state.id, Math.floor(Math.random() * 100)); // Random data for each state
    });

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll("path")
      .data(usStates.features)
      .enter()
      .append("path")
      .attr("d", d3.geoPath())
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("fill", (d) => colorScale(stateData.get(d.id)))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`State: ${d.properties.name}<br/>Value: ${stateData.get(d.id)}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Labels for states
    svg
      .selectAll("text")
      .data(usStates.features)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${d3.geoPath().centroid(d)})`)
      .attr("dy", "0.35em")
      .text((d) => d.properties.name)
      .attr("font-size", "8px")
      .attr("text-anchor", "middle")
      .attr("fill", "black");

    svg.attr("viewBox", `0 0 ${width} ${height}`);
  }, []);

  return <svg ref={svgRef} />;
};

export default ChoroplethMap;
