import { useEffect, useState } from 'react';

export function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="offline-banner" role="status">
      オフラインです。外部リンクや共有APIは使えない可能性がありますが、緊急行動カードと手動コピー用テキストは確認できます。
    </div>
  );
}
