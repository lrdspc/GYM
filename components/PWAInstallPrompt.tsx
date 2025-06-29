'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install prompt only if user hasn't installed the app
      // and hasn't dismissed the prompt recently
      const hasPromptBeenShown = localStorage.getItem('pwaPromptDismissed');
      const lastPromptTime = localStorage.getItem('pwaPromptLastShown');
      const currentTime = Date.now();
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

      if (!hasPromptBeenShown || (lastPromptTime && currentTime - parseInt(lastPromptTime) > oneWeekInMs)) {
        setShowInstallPrompt(true);
        localStorage.setItem('pwaPromptLastShown', currentTime.toString());
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);
    setShowInstallPrompt(false);

    if (outcome === 'dismissed') {
      localStorage.setItem('pwaPromptDismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg rounded-t-lg z-50 border-t border-gray-200 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-500 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Instale o FitTrainer Pro</h3>
            <p className="text-sm text-gray-600">Instale nosso app para acesso offline e melhor experiência</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            Depois
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}