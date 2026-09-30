import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

function readOnlineStatus(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

/**
 * A lightweight, global connection signal. It does not block navigation or
 * impose any request policy; it simply tells people why online AI actions are
 * unavailable before they submit a photo or recommendation request.
 */
export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(readOnlineStatus);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed inset-x-3 top-[3.75rem] z-[70] mx-auto flex max-w-xl items-center justify-center gap-2 rounded-xl border border-amber-300/35 bg-[#20160a]/95 px-3 py-2 text-center text-xs font-medium text-amber-100 shadow-xl backdrop-blur-lg sm:top-[4.5rem] md:top-[5.5rem]"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
      <span>You’re offline. Reconnect to run AI analysis; your selected photo stays on this device.</span>
    </div>
  );
}

export default NetworkStatus;
