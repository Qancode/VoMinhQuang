import React, { ReactNode, useMemo } from "react";
import { BoxProps } from "";
import { useWalletBalances } from "";
import { usePrices } from "";
import WalletRow from "";
import classes from "";
// incompliance import

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; //add blockchain attribute
}
//   FormattedWalletBalance can extends from WalletBalance
interface FormattedWalletBalance extends WalletBalance {
  // currency: string;
  // amount: number;
  formatted: string;
}

interface Props extends BoxProps {
  children?: ReactNode; //add children attribute
}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // fix here
        return balancePriority > -99 && balance.amount > 0; //keep only valid balances
        // if (balancePriority > -99) {
        //    if (balance.amount <= 0) {
        //      return true;
        //    }
        // }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
