import { useRef, useEffect } from "react";
import * as d3 from "d3";

const generateTreemapData = (numChildren) => {
  const data = {
    name: "root",
    children: [],
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < numChildren; i++) {
    const name = alphabet[i];
    data.children.push({ name, value: Math.random() * 100 });
  }

  return data;
};

const TreeMap = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 800;
    const height = 600;

    const numChildren = 15; // Increase the number of children
    const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

    const treemapLayout = d3.treemap().size([width, height]).padding(1);

    const root = d3
      .hierarchy(generateTreemapData(numChildren))
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    treemapLayout(root);

    const leaf = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    leaf
      .append("rect")
      .attr("fill", (d) => colorScale(d.data.name))
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Name: ${d.data.name}<br/>Value: ${d.data.value.toFixed(2)}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(500).style("opacity", 0);
      });

    leaf
      .append("text")
      .attr("x", (d) => (d.x1 + d.x0) / 2)
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "12px")
      .style("fill", "#fff")
      .text((d) => d.data.name)
      .attr("opacity", function (d) {
        const textLength = this.getComputedTextLength();
        return textLength <= d.x1 - d.x0 && textLength <= d.y1 - d.y0 ? 1 : 0;
      })
      .each(function (d) {
        const text = d3.select(this);
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        const textLength = text.node().getComputedTextLength();
        if (textLength <= width && textLength <= height) {
          const xCenter = (d.x0 + d.x1) / 2;
          const yCenter = (d.y0 + d.y1) / 2;
          text.attr("x", xCenter).attr("y", yCenter);
        } else {
          text.attr("opacity", 0); // Hide if text doesn't fit
        }
      });

    // Legend
  }, []);

  return (
    <div style={{}}>
      <svg ref={svgRef} width={800} height={600} />
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{ opacity: 0, position: "absolute" }}
      />
    </div>
  );
};

export default TreeMap;
