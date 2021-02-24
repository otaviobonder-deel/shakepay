import dayjs from "dayjs";
import Currency from "currency.js";
import rates from "../assets/rates.json";
import ethRates from "../assets/eth_rates.json";
import btcRates from "../assets/btc_rates.json";

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

interface IBalance {
  createdAt: string;
  total: number;
  totalCad: number;
  totalBtc: number;
  totalEth: number;
}

const balanceSum = (data: IData[]): IBalance[] => {
  data.reverse();
  const balance = [
    {
      createdAt: dayjs(data[0].createdAt).subtract(1, "d").toISOString(),
      total: 0,
      totalCad: 0,
      totalBtc: 0,
      totalEth: 0,
    },
  ];
  data.forEach((operation) => {
    const lastValue = balance[balance.length - 1];
    const ethRate = ethRates.find((day) =>
      dayjs(day.createdAt).isSame(operation.createdAt, "d")
    )?.midMarketRate;
    const btcRate = btcRates.find((day) =>
      dayjs(day.createdAt).isSame(operation.createdAt, "d")
    )?.midMarketRate;
    if (operation.type === "peer" || operation.type === "external account") {
      // client is depositing CAD
      if (
        operation.currency === "CAD" &&
        operation.direction &&
        operation.direction === "credit"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad + operation.amount,
          totalBtc: lastValue.totalBtc,
          totalEth: lastValue.totalEth,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }

      // client is withdrawing CAD
      if (
        operation.currency === "CAD" &&
        operation.direction &&
        operation.direction === "debit"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad - operation.amount,
          totalBtc: lastValue.totalBtc,
          totalEth: lastValue.totalEth,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }

      // client is depositing BTC
      if (
        operation.currency === "BTC" &&
        operation.direction &&
        operation.direction === "credit"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad,
          totalBtc: lastValue.totalBtc + operation.amount,
          totalEth: lastValue.totalEth,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }

      // client is withdrawing BTC
      if (
        operation.currency === "BTC" &&
        operation.direction &&
        operation.direction === "debit"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad,
          totalBtc: lastValue.totalBtc - operation.amount,
          totalEth: lastValue.totalEth,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }

      // client is depositing ETH
      if (
        operation.currency === "ETH" &&
        operation.direction &&
        operation.direction === "credit"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad,
          totalBtc: lastValue.totalBtc,
          totalEth: lastValue.totalEth + operation.amount,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }

      // client is withdrawing ETH
      if (
        operation.currency === "ETH" &&
        operation.direction &&
        operation.direction === "debit"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad,
          totalBtc: lastValue.totalBtc,
          totalEth: lastValue.totalEth - operation.amount,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }
    }

    if (operation.type === "conversion") {
      // converting from CAD to BTC
      if (
        operation.to?.amount &&
        operation.from?.currency === "CAD" &&
        operation.to?.currency === "BTC"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad - operation.amount,
          totalBtc: lastValue.totalBtc + operation.to.amount,
          totalEth: lastValue.totalEth,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }

      // converting from BTC to CAD
      if (
        operation.to?.amount &&
        operation.from?.currency === "BTC" &&
        operation.to?.currency === "CAD"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad + operation.to.amount,
          totalBtc: lastValue.totalBtc - operation.amount,
          totalEth: lastValue.totalEth,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }

      // converting from ETH to CAD
      if (
        operation.to?.amount &&
        operation.from?.currency === "ETH" &&
        operation.to?.currency === "CAD"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad + operation.to.amount,
          totalBtc: lastValue.totalBtc,
          totalEth: lastValue.totalEth - operation.amount,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }

      // converting from CAD to ETH
      if (
        operation.to?.amount &&
        operation.from?.currency === "CAD" &&
        operation.to?.currency === "ETH"
      ) {
        const obj = {
          createdAt: operation.createdAt,
          totalCad: lastValue.totalCad - operation.amount,
          totalBtc: lastValue.totalBtc,
          totalEth: lastValue.totalEth + operation.to.amount,
        };
        balance.push({
          ...obj,
          total: Currency(obj.totalCad)
            .add(Currency(obj.totalEth).multiply(ethRate || 1))
            .add(Currency(obj.totalBtc).multiply(btcRate || 1)).value,
        });
      }
    }
  });

  return balance;
};

export default balanceSum;
