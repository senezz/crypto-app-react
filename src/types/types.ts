import { ReactNode } from "react";

export interface Asset {
  amount: number;
  date: Date;
  id: string;
  price: number;
  name?: string;
  grow?: boolean;
  growPercent?: number;
  totalAmount?: number;
  totalProfit?: number;
}

export interface CryptoContextType {
  loading: boolean;
  crypto: Crypto;
  portfolio: Portfolio;
  addAsset: (newAsset: Asset) => void;
  sellAsset: (assetId: string, sellAmount: number) => void;
}

export interface CryptoContextSimpleType {
  loading: boolean;
  crypto: Crypto;
  portfolio: Portfolio;
}

export interface Coin {
  id: string;
  icon: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  priceBtc: number;
  volume: number;
  marketCap: number;
  availableSupply: number;
  totalSupply: number;
  fullyDilutedValuation: number;
  priceChange1h: number;
  priceChange1d: number;
  priceChange1w: number;
  contractAddress: number | null;
}

export interface CryptoContextProps {
  children: ReactNode;
}

export type Portfolio = Asset[];
export type Crypto = Coin[];
