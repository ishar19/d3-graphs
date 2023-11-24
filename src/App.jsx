import "./App.css";
import BarChart from "./charts/barChart";
import AreaChart from "./charts/areaChart";
import PieChart from "./charts/pieChart";
import ScatterPlot from "./charts/scatterPlot";
import ChordDiagram from "./charts/chordDiagram";
import TreeMap from "./charts/treeMap";
import BarChartRace from "./charts/barChartRace";
import SunburstChart from "./charts/sunBurst";
import Histogram from "./charts/histogram";
import JobPieChart from "./charts/jobRole";
function App() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-100 text-center">
        D3 and react Charts
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6 mx-auto max-w-7xl">
        <div className="bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Travel Frequency Bar Chart
          </h2>
          <div className="p-4">
            <BarChart />
          </div>
          <div className="p-4 font-semibold text-white">
            This is a bar chart that shows the number of people who travels
            frquently, rarely and never.
          </div>
        </div>
        <div className="bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Martial Status Pie Chart
          </h2>
          <div className="p-4">
            <PieChart />
          </div>
        </div>
        <div className="bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Income Scatter Plot
          </h2>
          <div className="p-4">
            <ScatterPlot />
          </div>
          <div className="p-4 font-semibold text-white">
            This is a scatter plot depicting the relationship between age and
            income of employees correlating it with the gender and department
            they work in.
          </div>
        </div>
        <div className="bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Job Level Histogram
          </h2>
          <div className="p-4">
            <Histogram />
          </div>
          <div className="p-4 font-semibold text-white">
            This is a chart depicting the relationship between job level and
            gender of employees.Moreover it also shows the relationship between
            job level and marital status of employees with overtime.
          </div>
        </div>
        <div className="bg-gray-800 rounded-md shadow-md flex justify-center flex-col items-center">
          <h2 className="text-xl font-semibold p-4 text-gray-100">
            Job Role Pie Chart
          </h2>
          <div className="p-4">
            <JobPieChart />
          </div>
          <div className="p-4 font-semibold text-white">
            This is a pie chart depicting the number of job roles of employees
            and correlating it different criterias.
          </div>
        </div>
        <div className="bg-gray-800 rounded-md shadow-md">
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
        </div>
      </div>
    </div>
  );
}

export default App;
