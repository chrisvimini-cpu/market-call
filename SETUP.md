# Market Call - Setup Instructions

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in your browser**:
   - The dev server will provide a local URL (typically `http://localhost:5173`)
   - For best mobile experience, open on your phone or use browser dev tools mobile view

## Testing on Mobile Device

To test on your actual phone while developing:

1. Find your local IP address:
   ```bash
   # On Mac:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Vite's dev server is accessible on your local network by default

3. Open `http://YOUR_IP:5173` on your phone (make sure phone is on same WiFi)

## Font Files

The app uses CoinDesk's Family font. Place the font files in `public/fonts/`:
- `Family-Regular.woff2`
- `Family-Bold.woff2`

If fonts are not available, the app will use Helvetica Neue as a fallback.

## Demo Mode

The app is currently in **demo mode**, which means:
- It uses historical price data from the last 24 hours
- Results are shown immediately after submitting picks
- Perfect for testing and demonstrations

This lets you play through a complete game cycle instantly.

## First Play Experience

When you first run the game:

1. **Loading screen** - Fetches top 50 tokens from CoinGecko API
2. **Token selection** - 5 tokens are selected (2 from top 10, 2 from 11-30, 1 from 31-50)
3. **Card stack** - Swipe or tap Bull/Bear for each token
4. **Confirmation** - Review your picks before locking in
5. **Results** - See how you did and your streak status (in demo mode, shown immediately)

## Data & Caching

- Game state is saved in localStorage
- Token pool is cached for 24 hours
- Price data is cached for 5 minutes
- Stats and streak are persisted across sessions

## Troubleshooting

**API rate limiting**: The free CoinGecko API has limits. If you see errors:
- Wait a few minutes
- The app caches aggressively to minimize API calls
- Each sparkline requires a separate API call (with 300ms delay between calls)

**Fonts not loading**: Check that font files are in `public/fonts/` and named correctly

**Cards not animating**: Make sure you're using a modern browser with CSS animation support

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder ready for deployment.

## Next Steps

To deploy this to production:

1. Add a backend for price snapshotting (store prices at midnight UTC)
2. Update `DEMO_MODE` to `false` in `src/lib/constants.js`
3. Implement the 9 AM UTC pick window cutoff
4. Add user accounts (optional)
5. Set up hosting (Vercel, Netlify, etc.)
