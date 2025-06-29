'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UsePWAReturn {
  isOnline: boolean;
  isPWAInstalled: boolean;
  isInstallPromptAvailable: boolean;
  installPWA: () => Promise<void>;
  isStandalone: boolean;
  isUpdateAvailable: boolean;
  applyUpdate: () => void;
}

export function usePWA(): UsePWAReturn {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isPWAInstalled, setIsPWAInstalled] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    // Check if app is installed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      setIsPWAInstalled(true);
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
    });

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setIsUpdateAvailable(true);
              }
            });
          }
        });
      });

      // Listen for controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
      window.removeEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      });
      window.removeEventListener('appinstalled', () => {
        setIsPWAInstalled(true);
        setDeferredPrompt(null);
      });
    };
  }, []);

  const installPWA = async (): Promise<void> => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      setIsPWAInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  const applyUpdate = (): void => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    isOnline,
    isPWAInstalled,
    isInstallPromptAvailable: !!deferredPrompt,
    installPWA,
    isStandalone,
    isUpdateAvailable,
    applyUpdate,
  };
}