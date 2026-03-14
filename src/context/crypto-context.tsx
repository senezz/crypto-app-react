import { createContext, useState, useEffect, useContext } from "react";
import { fakeFetchCrypto, fetchPortfolio } from "../api";
import { percentDifference } from "../utils";
import { updatePortfolio, getPortfolio } from "../firebase";
import {
  Asset,
  CryptoContextType,
  Coin,
  CryptoContextProps,
  Portfolio,
  Crypto,
  CryptoContextSimpleType,
} from "../types/types";

const CryptoContext = createContext<CryptoContextType>({
  portfolio: [],
  crypto: [],
  loading: false,
  addAsset: () => {},
  sellAsset: () => {},
});

export function CryptoContextProvider({ children }: CryptoContextProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [crypto, setCrypto] = useState<Crypto>([]);
  const [portfolio, setPortfolio] = useState<Portfolio>([]);

  function mapPortfolio(portfolio: Portfolio, result: Crypto): Portfolio {
    updatePortfolio("test", portfolio);
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
        return portfolio;
      }
    }) as Portfolio;
  }

  useEffect(() => {
    async function preLoad() {
      setLoading(true);
      // await createPortfolio("test");
      // const allUsers = await getAllUsers()
      // console.log({allUsers})
      const { result } = await fakeFetchCrypto();
      // console.log({ result })
      const portfolio = await getPortfolio("test");

      // await updatePortfolio("test");
      // await deleteFirstUser()
      // await deleteFirstUser()
      console.log({ portfolio });
      setPortfolio(mapPortfolio(portfolio, result));
      setCrypto(result);
      setTimeout(() => console.log(portfolio), 2000);
      setLoading(false);
    }
    preLoad();
  }, []);

  function addAsset(newAsset: Asset) {
    setPortfolio((prev) => {
      console.log({ prev, newAsset });
      const existedAssetIndex = prev.findIndex((a) => a.id === newAsset.id);
      if (existedAssetIndex === -1) {
        prev.push(newAsset);
      } else {
        const totalPricePrev =
          prev[existedAssetIndex].amount * prev[existedAssetIndex].price;
        const totalPriceNew = newAsset.amount * newAsset.price;
        const sumOfTotals = totalPricePrev + totalPriceNew;
        const newPrice =
          sumOfTotals / (prev[existedAssetIndex].amount + newAsset.amount);
        prev[existedAssetIndex].price = newPrice;
        prev[existedAssetIndex].amount += newAsset.amount;
      }
      return mapPortfolio(prev, crypto);
    });
  }

  function sellAsset(assetId: string, sellAmount: number) {
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
