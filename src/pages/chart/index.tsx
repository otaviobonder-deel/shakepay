import React from "react";
import Chart from "../../components/Chart";
import "./chart.css";

const ChartPage = () => {
  return (
    <div className="container">
      <div>
        <h1 className="title">Shakepay Portfolio Amount</h1>
      </div>
      <div>
        <Chart />
      </div>
    </div>
  );
};

export default ChartPage;
