# Market Call - CoinDesk Crypto Prediction Game

A mobile-first daily prediction game where players predict whether 5 crypto tokens will go UP or DOWN in the next 24 hours.

## 🎮 The Game

- Every day at midnight UTC, 5 tokens are selected from the top 50 by market cap
- Players pick Bull (🟢) or Bear (🔴) for each token
- Picks must be made before 9 AM UTC
- Results resolve 24 hours later
- Get all 5 correct to extend your streak!

## 🔥 The Streak

- 5/5 correct = Perfect day, streak continues
- Anything less than 5/5 = Streak resets to 0
- Miss a day = Streak broken
- A 10-day streak means 50 consecutive correct calls!

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
market-call/
├── src/
│   ├── components/       # React components
│   │   ├── App.jsx       # Main app container
│   │   ├── CardStack.jsx # Card stack game interface
│   │   ├── TokenCard.jsx # Individual token card with Bull/Bear buttons
│   │   └── ...
│   ├── lib/              # Core game logic and utilities
│   │   ├── api.js        # CoinGecko API integration
│   │   ├── gameLogic.js  # Score calculation, streak logic
│   │   ├── storage.js    # localStorage helpers
│   │   └── tokens.js     # Token selection algorithm
│   └── styles/           # CSS modules and global styles
└── public/
    └── fonts/            # Family font files (to be added)
```

## 🎨 Design System

### Colors
- **CoinDesk Yellow**: `#F8BF1E` - Streak counter, active states, primary buttons
- **Bull Green**: `#16C784` - Bull picks and positive price changes
- **Bear Red**: `#EA3943` - Bear picks and negative price changes

### Typography
- **Family Bold**: Token names, prices, buttons, headers
- **Family Regular**: Labels, body text, disclaimers

## 🔌 API Integration

Uses the free CoinGecko API for:
- Top 50 tokens by market cap (excluding stablecoins)
- Current prices and 24h price changes
- 7-day sparklines
- Historical prices (for demo mode)

**Note**: The free tier has rate limits (~10-30 calls/min). The app implements aggressive caching to stay within limits.

## 🎯 Demo Mode vs. Production

**Current (Demo Mode)**:
- Uses historical data from the last 24 hours
- Results are immediately available
- Perfect for testing and demonstrations

**Production Mode** (requires backend):
- Cron job snapshots prices at midnight UTC
- Results resolve 24 hours later
- Picks lock at 9 AM UTC

To switch to production mode, update `DEMO_MODE` in `src/lib/constants.js` and implement the backend price snapshotting.

## 📱 PWA Support

The app is structured as a Progressive Web App:
- Can be installed on mobile home screens
- Offline caching of app shell (service worker ready)
- Optimized for mobile-first experience

## ⚖️ Legal & Compliance

**This is NOT a prediction market.** Key distinctions:

- ✅ No real money or anything of monetary value at stake
- ✅ No counterparty - player predicts against reality, not another user
- ✅ No financial instrument created
- ✅ Not investment advice
- ✅ Same legal category as ESPN Streak or Yahoo Finance's "Bull or Bear"

## 🛠️ Tech Stack

- **React 18** with hooks
- **Vite** for build tooling
- **CSS Modules** for styling
- **CoinGecko API** for price data
- **localStorage** for game state persistence

## 📝 Font Setup

Place the Family font files in `public/fonts/`:
- `Family-Regular.woff2`
- `Family-Bold.woff2`

If the Family font is not available, the app will gracefully fall back to Helvetica Neue and Arial.

## 🎯 Future Enhancements

- Backend API for real-time price snapshotting
- User accounts and global leaderboards
- Social sharing with auto-generated images
- Push notifications for pick reminders
- More token pools (DeFi, NFTs, etc.)

## 📄 License

Built for CoinDesk Games
