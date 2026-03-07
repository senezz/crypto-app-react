import { createContext, useState, useEffect, useContext } from "react";
import { fakeFetchCrypto, fetchPortfolio } from '../api';
import { percentDifference } from '../utils'
import { app, createUser, getAllUsers, updateFirstUser, deleteFirstUser, } from "../firebase";



const CryptoContext = createContext({
  portfolio: [],
  crypto: [], 
  loading: false,
})

export function CryptoContextProvider({children}) {
    const [loading, setLoading] = useState(false)
    const [crypto, setCrypto] = useState([])
    const [portfolio, setPortfolio] = useState([])

    function mapPortfolio(portfolio, result) {
      return portfolio.map((asset) => {
        const coin = result.find((c) => c.id === asset.id)
        return {
          grow: asset.price < coin.price,
          growPercent: percentDifference(asset.price, coin.price),
          totalAmount: asset.amount * coin.price,
          totalProfit: asset.amount * coin.price - asset.amount * asset.price,
          name: coin.name,
          ...asset,
        }
    })
}

    useEffect(() => {
        async function preLoad() {
            setLoading(true)
            // await createUser()
            // const allUsers = await getAllUsers()
            // console.log({allUsers})
            const { result } = await fakeFetchCrypto()
            // console.log({ result })
            const portfolio = await fetchPortfolio()

            // await updateFirstUser()
            // await deleteFirstUser()
            // await deleteFirstUser()
            console.log({portfolio})
            setPortfolio(mapPortfolio(portfolio, result))
            setCrypto(result)
            setTimeout(() => console.log(portfolio), 2000)
            setLoading(false)
        }
        preLoad()
    }, [])


    function addAsset(newAsset) {
        setPortfolio((prev) => { 
          console.log({prev, newAsset}) 
          const existedAssetIndex = prev.findIndex((a) => a.id === newAsset.id) 
          if (existedAssetIndex === -1) {
            prev.push(newAsset)

          } else {
            const totalPricePrev = prev[existedAssetIndex].amount * prev[existedAssetIndex].price
            const totalPriceNew = newAsset.amount * newAsset.price
            const sumOfTotals = totalPricePrev + totalPriceNew
            const newPrice = sumOfTotals / (prev[existedAssetIndex].amount + newAsset.amount)
            prev[existedAssetIndex].price = newPrice
            prev[existedAssetIndex].amount += newAsset.amount
          }
         return mapPortfolio(prev, crypto)
        }
      )
    }

    function sellAsset(assetId, sellAmount) {
      setPortfolio((prev) =>
        mapPortfolio( 
          prev.map((a) => a.id === assetId ? ({...a, amount: a.amount - sellAmount}) : a)
          .filter((a) => a.amount > 0),
          crypto
        )  
    )
  }

    return <CryptoContext.Provider value={{loading, crypto, portfolio, addAsset, sellAsset}}>
        {children}
    </CryptoContext.Provider>
}

export default CryptoContext

export function useCrypto() {
  return useContext(CryptoContext)
}