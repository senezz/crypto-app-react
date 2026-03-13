import { createContext, useState, useEffect, useContext } from "react";
import { fakeFetchCrypto, fetchPortfolio } from "../api";
import { percentDifference } from "../utils";
import { updatePortfolio, getPortfolio } from "../firebase";
import * as Auth from "../auth";

const CryptoContext = createContext({
  portfolio: [],
  crypto: [],
  loading: false,
  user: false,
});

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [user, setUser] = useState(false);

  function mapPortfolio(portfolio, result) {
    updatePortfolio(user.uid, portfolio);
    if (portfolio) {
      return portfolio.map((asset) => {
        const coin = result.find((c) => c.id === asset.id);
        return {
          ...asset,
          grow: asset.price < coin.price,
          growPercent: percentDifference(asset.price, coin.price),
          totalAmount: asset.amount * coin.price,
          totalProfit: asset.amount * coin.price - asset.amount * asset.price,
          name: coin.name,
        };
      });
    } else {
      return [];
    }
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
        setLoading(false);
      } else if (user === null) {
        setLoading(false);
      }
    }
    preUserUpdate();
  }, [user]);

  function addAsset(newAsset) {
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

  function sellAsset(assetId, sellAmount) {
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

  return (
    <CryptoContext.Provider
      value={{
        loading,
        crypto,
        portfolio,
        addAsset,
        sellAsset,
        user,
        setUser,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
