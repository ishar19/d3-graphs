import { useRef, useEffect } from "react";
import * as d3 from "d3";

const SunburstChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Mock data for the sunburst chart
    const data = {
      name: "Root",
      children: [
        {
          name: "Category 1",
          children: [
            { name: "Subcategory A", value: 10 },
            { name: "Subcategory B", value: 20 },
          ],
        },
        {
          name: "Category 2",
          children: [
            { name: "Subcategory C", value: 15 },
            { name: "Subcategory D", value: 25 },
          ],
        },
        // Add more categories and subcategories as needed
      ],
    };

    const partition = (data) => {
      const root = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

      return d3.partition().size([2 * Math.PI, radius])(root);
    };

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(0.01)
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1 - 1);

    const root = partition(data);

    svg
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", (d) => color((d.children ? d : d.parent).data.name))
      .attr("d", arc)
      .append("title")
      .text(
        (d) =>
          `${d
            .ancestors()
            .map((d) => d.data.name)
            .reverse()
            .join("/")}\n${d.value}`
      );

    svg
      .selectAll("text")
      .data(root.descendants().filter((d) => d.depth))
      .join("text")
      .attr("transform", (d) => {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`;
      })
      .attr("dy", "0.35em")
      .text((d) => d.data.name)
      .attr("font-size", "10px")
      .attr("text-anchor", (d) =>
        d.x0 < Math.PI === !d.children ? "start" : "end"
      )
      .attr("fill", "white");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "black")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px");

    svg
      .selectAll("path")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${d.data.name}<br/>Value: ${d.value}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, []);

  return <svg ref={svgRef} />;
};

export default SunburstChart;
