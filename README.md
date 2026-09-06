# Crypto Portfolio App

A crypto portfolio tracker built with React, TypeScript, and Ant Design. Sign in with Google, track your holdings against live prices from CoinStats, and get daily Telegram notifications about your portfolio's performance.

**Live demo:** https://crypto-react-app-1a792.web.app
**Telegram bot:** [@CryptoPortfolioNotificationsBot](https://t.me/CryptoPortfolioNotificationsBot) ([source](https://github.com/senezz/tg-crypto-bot))

## Stack

React 18, TypeScript, Vite, Ant Design, Chart.js, Firebase (Auth + Firestore), CoinStats API.

## Setup

```bash
npm install
```

Create a `.env` file with your CoinStats API key:

```env
VITE_COINSTATS_KEY=your_coinstats_api_key
```

Firebase config lives in `src/firebase.ts` — replace `firebaseConfig` if you're using your own project.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm test         # run tests
npm run lint     # run eslint
```

## Firestore

- `portfolios/{uid}` — a user's assets and Telegram link
- `portfolios/{uid}/transactions` — buy/sell history
- `tg-codes` — Telegram verification codes, written by the bot

Rules are in `firestore.rules`; deploy with `firebase deploy --only firestore:rules`.

## Telegram linking

Linking Telegram is separate from signing in — it connects an already-signed-in account to a Telegram chat for daily notifications, handled by the [tg-crypto-bot](https://github.com/senezz/tg-crypto-bot) Cloud Function.
