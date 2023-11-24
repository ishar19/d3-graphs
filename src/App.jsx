import "./App.css";
import BarChart from "./charts/barChart";
// import AreaChart from "./charts/areaChart";
import PieChart from "./charts/pieChart";
import ScatterPlot from "./charts/scatterPlot";
// import ChordDiagram from "./charts/chordDiagram";
// import TreeMap from "./charts/treeMap";
// import BarChartRace from "./charts/barChartRace";
// import SunburstChart from "./charts/sunBurst";
import Histogram from "./charts/histogram";
import JobPieChart from "./charts/jobRole";
function App() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-100 text-center">
        D3 and react Charts
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6 mx-auto max-w-7xl">
        <div className="p-4">
          <BarChart />
        </div>

        <div className="p-4">
          <PieChart />
        </div>

        <div className="p-4">
          <ScatterPlot />
        </div>

        <div className="p-4">
          <Histogram />
        </div>

        <div className="">
          <div className="p-4">
            <JobPieChart />
          </div>
        </div>
        {/* <div className="bg-gray-800 rounded-md shadow-md">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Bar Chart Race
          </h2>
          <div className="p-4">
            <BarChartRace />
          </div>
        </div>
        <div className="bg-gray-800 rounded-md shadow-md">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Area Chart
          </h2>
          <div className="p-4">
            <AreaChart />
          </div>
        </div>

        <div className="bg-gray-800 rounded-md shadow-md">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Chord Diagram
          </h2>
          <div className="p-4">
            <ChordDiagram />
          </div>
        </div>
        <div className="bg-gray-800 rounded-md shadow-md">
          <h2 className="text-xl font-semibold p-4 text-gray-100">Tree Map</h2>
          <div className="p-4">
            <TreeMap />
          </div>
        </div>

        <div className="bg-gray-800 rounded-md shadow-md">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Sunburst Chart
          </h2>
          <div className="p-4">
            <SunburstChart />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default App;
