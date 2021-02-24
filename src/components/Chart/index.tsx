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

const formatTooltip = (value: number): string =>
  Currency(value, { symbol: "$", precision: 0 }).format();

const data = balanceSum(rawData as IData[]);

const Chart: React.FC = () => {
  return (
    <ResponsiveContainer height={600} width="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 50,
          bottom: 5,
        }}
      >
        <XAxis dataKey="createdAt" tickFormatter={formatDate} />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={formatTooltip} labelFormatter={formatDate} />
        <Legend />
        <Line
          name="Portfolio amount"
          type="monotone"
          dataKey="total"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
