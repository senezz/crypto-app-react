# 📈 Crypto Portfolio App

A React-based cryptocurrency portfolio tracker that lets you monitor your assets in real time, track profit/loss, and receive daily Telegram notifications about your portfolio performance.

🔗 **Live Demo:** https://crypto-react-app-1a792.web.app _(if deployed)_  
🤖 **Telegram Bot:** [@CryptoPortfolioNotificationsBot](https://t.me/CryptoPortfolioNotificationsBot) — see [tg-crypto-bot](https://github.com/senezz/tg-crypto-bot)

---

## ✨ Features

- **Real-time crypto prices** — powered by the [CoinStats API](https://openapiv1.coinstats.app)
- **Portfolio management** — add and sell assets, track total value and profit
- **P&L tracking** — see grow/loss per asset with percentage change
- **Coin info** — search any coin via the header search bar (or press `/`)
- **Google authentication** — sign in with your Google account via Firebase Auth
- **Telegram integration** — link your Telegram account to receive daily portfolio notifications
- **Cloud sync** — portfolio data is stored in Firebase Firestore and synced across sessions
- **Responsive layout** — sidebar for asset overview, main area for the full portfolio table and chart

---

## 🖥️ Tech Stack

| Layer       | Technology                       |
| ----------- | -------------------------------- |
| Framework   | React 18 + TypeScript            |
| Build tool  | Vite                             |
| UI library  | Ant Design (antd)                |
| Charts      | Chart.js + react-chartjs-2       |
| Auth        | Firebase Authentication (Google) |
| Database    | Firebase Firestore               |
| Hosting     | Firebase Hosting                 |
| Testing     | Jest + ts-jest                   |
| Crypto data | CoinStats API                    |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Firebase project
- A CoinStats API key

### Installation

```bash
git clone https://github.com/senezz/crypto-app-react.git
cd crypto-app-react
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
VITE_COINSTATS_KEY=your_coinstats_api_key
```

Firebase config is already initialized in `src/firebase.ts`. If you're using your own Firebase project, update the `firebaseConfig` object there.

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test
```

---

## 📁 Project Structure

```
src/
├── api.ts                  # CoinStats API fetch + mock portfolio
├── auth.ts                 # Firebase Auth (Google + Telegram verification)
├── firebase.ts             # Firestore operations (portfolio, Telegram linking)
├── data.ts                 # Static seed data
├── utils.ts                # Helper functions (percentDifference, capitalize)
├── types/
│   └── types.ts            # Shared TypeScript types
├── context/
│   └── crypto-context.tsx  # Global state (portfolio, crypto prices, user)
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── AppHeader.tsx   # Search bar, Add Asset button, user profile, Telegram button
│   │   ├── AppContent.tsx  # Portfolio chart + assets table
│   │   └── AppSider.tsx    # Per-asset cards with Sell / Sell All actions
│   ├── AddAssetForm.tsx
│   ├── SellAssetForm.tsx
│   ├── SellAllAssetsModal.tsx
│   ├── AssetsTable.tsx
│   ├── PortfolioChart.tsx
│   ├── CoinInfo.tsx
│   ├── CoinInfoModal.tsx
│   ├── LoginPage.tsx
│   ├── UserProfile.tsx
│   ├── TelegramLoginButton.tsx   # Telegram account linking UI
│   └── TelegramCodeModal.tsx     # Code verification modal
└── tests/
    └── utils.test.ts
```

---

## 🤖 Telegram Bot Integration

This app integrates with a companion Telegram bot to deliver **daily portfolio notifications**.

👉 Bot repository: [github.com/senezz/tg-crypto-bot](https://github.com/senezz/tg-crypto-bot)

### How it works

1. Click the **"Link Telegram"** button in the app header.
2. A new tab opens with [@CryptoPortfolioNotificationsBot](https://t.me/CryptoPortfolioNotificationsBot).
3. Send `/start` to the bot — it will reply with a **6-digit verification code**.
4. Paste the code into the modal in the app and click **Submit**.
5. Your Telegram account is now linked to your portfolio.

Once linked, the bot sends you a **daily message** with your portfolio's change in USD and percentage for the past 24 hours — for example:

```
Your portfolio has grown: 42.30 USD (3.15%)
```

Your Telegram `chatId` and `username` are stored in Firestore under your portfolio document and used by the bot's scheduled Firebase Cloud Function (`dailyNotification`) which runs every 24 hours.

---

## 🔒 Authentication

- **Google Sign-In** — handled via Firebase Auth with `browserLocalPersistence` so your session survives page reloads.
- **Telegram linking** — not a login method; it links an existing Google-authenticated account to a Telegram chat for notifications.

---

## 🛠️ Firebase Setup

The app uses the following Firebase services:

- **Authentication** — Google provider
- **Firestore** — collections:
  - `portfolios/{uid}` — stores assets array and `telegramLink` (username + chatId)
  - `tg-codes/{chatId}` — temporary verification codes generated by the Telegram bot

Firestore rules and indexes are defined in `firestore.rules` and `firestore.indexes.json`.

---

## 📜 Available Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
| `npm test`        | Run Jest tests           |

---

## 🔗 Related

- [tg-crypto-bot](https://github.com/senezz/tg-crypto-bot) — Telegram bot (Firebase Cloud Functions) that handles verification codes and daily portfolio notifications
