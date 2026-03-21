import { useEffect } from 'react';
import styles from './HamburgerMenu.module.css';

const GAMES = [
  {
    id: 'satoshi',
    title: 'Satoshi',
    description: 'Daily Crypto Puzzle',
    backgroundSvg: '/S.svg',
    url: 'https://satoshi-nine.vercel.app',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="32" y="42" textAnchor="middle" fill="#353536" fontSize="32" fontWeight="700" fontFamily="Family, Arial, sans-serif">S</text>
      </svg>
    )
  },
  {
    id: 'market-call',
    title: 'Market Call',
    description: 'Daily Prediction Game',
    backgroundSvg: '/MC.svg',
    url: 'https://market-call.vercel.app',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 12L44 32L20 32Z" fill="#F1C40F"/>
        <path d="M32 52L20 32L44 32Z" fill="#EA3943"/>
      </svg>
    )
  },
  {
    id: 'onchain',
    title: 'Onchain',
    description: 'Daily Mini Crossword',
    backgroundSvg: '/O.svg',
    url: 'https://onchain-crossword.vercel.app',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="18" width="12" height="12" fill="none" stroke="#F1C40F" strokeWidth="2"/>
        <rect x="34" y="18" width="12" height="12" fill="none" stroke="#F1C40F" strokeWidth="2"/>
        <rect x="18" y="34" width="12" height="12" fill="none" stroke="#F1C40F" strokeWidth="2"/>
        <rect x="34" y="34" width="12" height="12" fill="none" stroke="#F1C40F" strokeWidth="2"/>
      </svg>
    )
  }
];

const HamburgerMenu = ({ isOpen, onClose }) => {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleGameClick = (url) => {
    window.location.href = url;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={styles.menu}
        role="dialog"
        aria-modal="true"
        aria-label="Game launcher menu"
      >
        <div className={styles.menuContent}>
          {/* Close Button */}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* CoinDesk Games Logo */}
          <div className={styles.logoContainer}>
            <img
              src="/coindesk-games-logo.svg"
              alt="CoinDesk Games"
              className={styles.logo}
            />
          </div>

          {/* Game Cards */}
          <div className={styles.gameCards}>
            {GAMES.map((game) => (
              <div key={game.id} className={styles.gameCard}>
                {/* Colored accent section with icon */}
                <div
                  className={styles.cardAccent}
                  style={{
                    backgroundImage: `url('${game.backgroundSvg}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className={styles.cardIcon}>
                    {game.icon}
                  </div>
                </div>

                {/* Info section */}
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{game.title}</h3>
                  <p className={styles.cardDescription}>{game.description}</p>
                  <button
                    className={styles.playButton}
                    onClick={() => handleGameClick(game.url)}
                    aria-label={`Play ${game.title}`}
                  >
                    PLAY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
