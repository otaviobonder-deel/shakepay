import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import dayjs from "dayjs";
import Currency from "currency.js";
import balanceSum from "../../utils/balanceSum";
import rawData from "../../assets/transaction_history.json";

interface IData {
  createdAt: string;
  amount: number;
  currency: "CAD" | "BTC" | "ETH";
  type: "external account" | "peer" | "conversion";
  direction: null | "credit" | "debit";
  from?: {
    currency: string;
    amount: number;
  };
  to?: {
    currency?: string;
    amount?: number;
    toAddress?: string;
  };
}

const formatDate = (tickItem: string): string =>
  dayjs(tickItem).format("DD/MM/YYYY");

const formatYAxis = (tickItem: number): string =>
  Currency(tickItem, { symbol: "$", precision: 0 }).format();

const formatTooltip = (value: number, name: string): string => {
  if (name === "BTC amount") {
    return Currency(value, { symbol: "BTC", precision: 8 }).format();
  }
  if (name === "ETH amount") {
    return Currency(value, { symbol: "ETH", precision: 8 }).format();
  }
  return Currency(value, { symbol: "$", precision: 0 }).format();
};

const data = balanceSum(rawData as IData[]);

const Chart: React.FC = () => {
  return (
    <ResponsiveContainer height={600} width="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 80,
          bottom: 5,
        }}
      >
        <XAxis dataKey="createdAt" tickFormatter={formatDate} />
        <YAxis yAxisId="left" tickFormatter={formatYAxis} />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip formatter={formatTooltip} labelFormatter={formatDate} />
        <Legend />
        <Line
          name="Portfolio amount"
          type="monotone"
          dataKey="total"
          dot={false}
          yAxisId="left"
          stroke="green"
        />
        <Line
          name="BTC amount"
          type="monotone"
          dataKey="totalBtc"
          dot={false}
          yAxisId="right"
          stroke="#f7931a"
        />
        <Line
          name="ETH amount"
          type="monotone"
          dataKey="totalEth"
          dot={false}
          yAxisId="right"
          stroke="blue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
