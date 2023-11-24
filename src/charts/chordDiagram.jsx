import { useRef, useEffect } from "react";
import * as d3 from "d3";

const createChordDiagramData = (numEntities) => {
  const matrix = [];
  for (let i = 0; i < numEntities; i++) {
    matrix[i] = [];
    for (let j = 0; j < numEntities; j++) {
      matrix[i][j] = Math.floor(Math.random() * 100);
    }
  }
  return matrix;
};

const ChordDiagram = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 800;
    const height = 800;
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    const chords = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(
      createChordDiagramData(6)
    );

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    const ribbon = d3.ribbon().radius(innerRadius);

    const group = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .datum(chords);

    group
      .append("g")
      .selectAll("g")
      .data((chords) => chords.groups)
      .join("path")
      .attr("fill", (d) => color(d.index))
      .attr("stroke", (d) => d3.rgb(color(d.index)).darker())
      .attr("d", arc)
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `
            <div>Group: ${d.index}</div>
            <div>Total Incoming: ${d.value}</div>
            <div>Total Outgoing: ${d.value}</div>
          `
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(500).style("opacity", 0);
      });

    group
      .append("g")
      .attr("fill-opacity", 0.67)
      .selectAll("path")
      .data((chords) => chords)
      .join("path")
      .attr("d", ribbon)
      .attr("fill", (d) => color(d.target.index))
      .attr("stroke", (d) => d3.rgb(color(d.target.index)).darker());
    const legend = svg
      .append("g")
      .selectAll("g")
      .data(chords.groups)
      .join("g")
      .style("color", "#ffffff")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => color(d.index));

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .style("fill", "white") // Setting the text color to white
      .text((d) => `Group ${d.index}`);
  }, []);

  return (
    <div style={{}}>
      <svg
        ref={svgRef}
        width={800}
        height={800}
        className="bg-gray-900 text-white border border-gray-300"
      />
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{ opacity: 0, position: "absolute", color: "white" }}
      />
      <div
        ref={legendRef}
        className="legend text-white"
        style={{
          display: "flex",
          flexDirection: "column",
          color: "#ffffff",
          //   marginTop: "20px",
          //   marginRight: "20px",
        }}
      />
    </div>
  );
};

export default ChordDiagram;
