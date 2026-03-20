import { generateShareText } from '../lib/gameLogic.js';

export function copyShareText(picks, outcomes, score, streakCount) {
  const shareText = generateShareText(picks, outcomes, score, streakCount);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(shareText)
      .then(() => ({ success: true, message: 'Copied to clipboard!' }))
      .catch(() => ({ success: false, message: 'Failed to copy' }));
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = shareText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve({ success: true, message: 'Copied to clipboard!' });
    } catch (err) {
      document.body.removeChild(textArea);
      return Promise.resolve({ success: false, message: 'Failed to copy' });
    }
  }
}
