import { createContext, useState, useEffect, useContext } from "react";
import { fakeFetchCrypto, fetchPortfolio } from "../api";
import { percentDifference } from "../utils";
import {
  updatePortfolio,
  getPortfolio,
  addTransaction,
  getTransactions,
} from "../firebase";
import * as Auth from "../auth";
import {
  Asset,
  CryptoContextType,
  Coin,
  CryptoContextProps,
  Portfolio,
  Crypto,
  Transaction,
  // CryptoContextSimpleType,
} from "../types/types";
import type { User } from "firebase/auth";

const CryptoContext = createContext<CryptoContextType>({
  portfolio: [],
  crypto: [],
  transactions: [],
  loading: false,
  user: false,
  addAsset: () => {},
  sellAsset: () => {},
  setUser: () => {},
});

export function CryptoContextProvider({ children }: CryptoContextProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [crypto, setCrypto] = useState<Crypto>([]);
  const [portfolio, setPortfolio] = useState<Portfolio>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null | false>(false);

  function mapPortfolio(portfolio: Portfolio, result: Crypto): Portfolio {
    if (user && typeof user !== "boolean") {
      updatePortfolio(user.uid, portfolio);
    }
    if (portfolio) {
      return portfolio.map((asset) => {
        const coin = result.find((c) => c.id === asset.id);
        if (coin) {
          return {
            ...asset,
            grow: asset.price < coin.price,
            growPercent: percentDifference(asset.price, coin.price),
            totalAmount: asset.amount * coin.price,
            totalProfit: asset.amount * coin.price - asset.amount * asset.price,
            name: coin.name,
          };
        } else {
          {
            return asset;
          }
        }
      });
    }
    return [];
  }

  useEffect(() => {
    async function preLoad() {
      setLoading(true);
      const newUser = await Auth.checkLoginState();
      setUser(newUser);
    }
    preLoad();
  }, []);

  useEffect(() => {
    async function preUserUpdate() {
      if (user) {
        const { result } = await fakeFetchCrypto();
        const portfolio = await getPortfolio(user.uid);
        setPortfolio(mapPortfolio(portfolio, result));
        setCrypto(result);
        setTransactions(await getTransactions(user.uid));
        setLoading(false);
      } else if (user === null) {
        setLoading(false);
      }
    }
    preUserUpdate();
  }, [user]);

  function recordTransaction(transaction: Omit<Transaction, "id">) {
    if (!user || typeof user === "boolean") return;
    addTransaction(user.uid, transaction);
    setTransactions((prev) => [transaction, ...prev]);
  }

  function addAsset(newAsset: Asset) {
    const coin = crypto.find((c) => c.id === newAsset.id);
    recordTransaction({
      coinId: newAsset.id,
      coinName: coin?.name ?? newAsset.id,
      coinIcon: coin?.icon,
      type: "buy",
      amount: newAsset.amount,
      price: newAsset.price,
      total: newAsset.amount * newAsset.price,
      date: (newAsset.date ?? new Date()).toISOString(),
    });

    setPortfolio((prev) => {
      const existedAssetIndex = prev.findIndex((a) => a.id === newAsset.id);
      if (existedAssetIndex === -1) {
        return mapPortfolio([...prev, newAsset], crypto);
      }
      const totalPricePrev =
        prev[existedAssetIndex].amount * prev[existedAssetIndex].price;
      const totalPriceNew = newAsset.amount * newAsset.price;
      const sumOfTotals = totalPricePrev + totalPriceNew;
      const newPrice =
        sumOfTotals / (prev[existedAssetIndex].amount + newAsset.amount);

      const updated = prev.map((a) =>
        a.id === newAsset.id
          ? { ...a, price: newPrice, amount: a.amount + newAsset.amount }
          : a,
      );

      return mapPortfolio(updated, crypto);
    });
  }

  function sellAsset(assetId: string, sellAmount: number, sellDate?: Date) {
    const coin = crypto.find((c) => c.id === assetId);
    const asset = portfolio.find((a) => a.id === assetId);
    const price = coin?.price ?? asset?.price ?? 0;
    recordTransaction({
      coinId: assetId,
      coinName: coin?.name ?? asset?.name ?? assetId,
      coinIcon: coin?.icon,
      type: "sell",
      amount: sellAmount,
      price,
      total: sellAmount * price,
      date: (sellDate ?? new Date()).toISOString(),
    });

    setPortfolio((prev) =>
      mapPortfolio(
        prev
          .map((a) =>
            a.id === assetId ? { ...a, amount: a.amount - sellAmount } : a,
          )
          .filter((a) => a.amount > 0),
        crypto,
      ),
    );
  }

  const contextValue: CryptoContextType = {
    loading,
    crypto,
    portfolio: portfolio as Portfolio,
    transactions,
    user,
    setUser,
    addAsset,
    sellAsset,
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {children}
    </CryptoContext.Provider>
  );
}

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
