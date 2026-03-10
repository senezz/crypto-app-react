import { createContext, useState, useEffect, useContext } from "react";
import { fakeFetchCrypto, fetchPortfolio } from "../api";
import { percentDifference } from "../utils";
import { updatePortfolio, getPortfolio } from "../firebase";
import * as Auth from "../auth";
import { getAuth } from "firebase/auth";

const CryptoContext = createContext({
  portfolio: [],
  crypto: [],
  loading: false,
  login: false,
});

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [login, setLogin] = useState(false);

  function mapPortfolio(portfolio, result) {
    updatePortfolio("test", portfolio);
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
  }

  useEffect(() => {
    async function preLoad() {
      setLoading(true);
      await new Promise((resolve) => setTimeout(() => resolve(true), 2000));
      Auth.checkLoginState();
      await new Promise((resolve) => setTimeout(() => resolve(true), 2000));
      setLogin(getAuth().currentUser);
      console.log(getAuth());
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
      // setTimeout(() => console.log(portfolio), 2000);
      setLoading(false);
    }
    preLoad();
  }, []);

  function addAsset(newAsset) {
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
        login,
        setLogin,
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
