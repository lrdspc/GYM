'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type InstallationMode = 'browser' | 'standalone' | 'twa' | 'minimal-ui' | 'unknown';

interface UsePWAReturn {
  isOnline: boolean;
  isPWAInstalled: boolean;
  isInstallPromptAvailable: boolean;
  installPWA: () => Promise<void>;
  isStandalone: boolean;
  isUpdateAvailable: boolean;
  applyUpdate: () => void;
  appVersion: string;
  lastUpdateCheck: Date | null;
  checkForUpdates: () => Promise<boolean>;
  installationMode: InstallationMode;
  networkType: string;
  isLowEndDevice: boolean;
  isLowEndExperience: boolean;
  periodicSyncSupported: boolean;
  registerPeriodicSync: (tag: string, minInterval: number) => Promise<boolean>;
}

export function usePWA(): UsePWAReturn {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isPWAInstalled, setIsPWAInstalled] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [appVersion, setAppVersion] = useState<string>(process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0');
  const [lastUpdateCheck, setLastUpdateCheck] = useState<Date | null>(null);
  const [installationMode, setInstallationMode] = useState<InstallationMode>('unknown');
  const [networkType, setNetworkType] = useState<string>('unknown');
  const [isLowEndDevice, setIsLowEndDevice] = useState<boolean>(false);
  const [isLowEndExperience, setIsLowEndExperience] = useState<boolean>(false);
  const [periodicSyncSupported, setPeriodicSyncSupported] = useState<boolean>(false);

  // Detect device capabilities
  useEffect(() => {
    // Check for low-end device
    const checkLowEndDevice = () => {
      const memory = (navigator as any).deviceMemory;
      const concurrency = navigator.hardwareConcurrency;
      
      // Device is considered low-end if it has less than 4GB RAM or fewer than 4 cores
      const isLow = (memory !== undefined && memory < 4) || 
                    (concurrency !== undefined && concurrency <= 4);
      
      setIsLowEndDevice(isLow);
      
      // Set low-end experience based on device and network
      const isSlowNetwork = ['slow-2g', '2g', '3g'].includes(networkType);
      setIsLowEndExperience(isLow || isSlowNetwork);
    };
    
    checkLowEndDevice();
    
    // Check for network information
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn) {
        setNetworkType(conn.effectiveType);
        
        conn.addEventListener('change', () => {
          setNetworkType(conn.effectiveType);
          checkLowEndDevice(); // Re-evaluate low-end experience when network changes
        });
      }
    }
    
    // Check for periodic sync support
    const checkPeriodicSyncSupport = async () => {
      if ('serviceWorker' in navigator && 'periodicSync' in (window as any)) {
        try {
          const reg = await navigator.serviceWorker.ready;
          if ('periodicSync' in reg) {
            setPeriodicSyncSupported(true);
          }
        } catch (error) {
          console.error('Periodic Sync not supported', error);
        }
      }
    };
    
    checkPeriodicSyncSupport();
  }, [networkType]);

  // Detect installation mode
  useEffect(() => {
    const detectInstallationMode = (): InstallationMode => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return 'standalone';
      }
      
      if (window.matchMedia('(display-mode: minimal-ui)').matches) {
        return 'minimal-ui';
      }
      
      if ((window.navigator as any).standalone === true) {
        return 'standalone';
      }
      
      // Check for TWA (Trusted Web Activity)
      const isTWA = document.referrer.includes('android-app://');
      if (isTWA) {
        return 'twa';
      }
      
      return 'browser';
    };
    
    setInstallationMode(detectInstallationMode());
    
    // Listen for display mode changes
    const mediaQueryStandalone = window.matchMedia('(display-mode: standalone)');
    const mediaQueryMinimalUI = window.matchMedia('(display-mode: minimal-ui)');
    
    const handleChange = () => {
      setInstallationMode(detectInstallationMode());
    };
    
    mediaQueryStandalone.addEventListener('change', handleChange);
    mediaQueryMinimalUI.addEventListener('change', handleChange);
    
    return () => {
      mediaQueryStandalone.removeEventListener('change', handleChange);
      mediaQueryMinimalUI.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
      
      // Track installation analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'pwa_installed', {
          event_category: 'PWA',
          event_label: 'App was installed',
        });
      }
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);

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
                
                // Track update available analytics
                if (typeof window !== 'undefined' && 'gtag' in window) {
                  (window as any).gtag('event', 'pwa_update_available', {
                    event_category: 'PWA',
                    event_label: 'Update available',
                  });
                }
              }
            });
          }
        });
      });

      // Listen for controller change
      const handleControllerChange = () => {
        // Track update applied analytics
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'pwa_update_applied', {
            event_category: 'PWA',
            event_label: 'Update was applied',
          });
        }
        window.location.reload();
      };
      
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async (): Promise<void> => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      setIsPWAInstalled(true);
      
      // Track successful installation analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'pwa_install_accepted', {
          event_category: 'PWA',
          event_label: 'User accepted installation',
        });
      }
    } else {
      // Track rejected installation analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'pwa_install_rejected', {
          event_category: 'PWA',
          event_label: 'User rejected installation',
        });
      }
    }
    
    setDeferredPrompt(null);
  };

  const applyUpdate = (): void => {
    if (registration && registration.waiting) {
      // Track update initiated analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'pwa_update_initiated', {
          event_category: 'PWA',
          event_label: 'User initiated update',
        });
      }
      
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };
  
  const checkForUpdates = useCallback(async (): Promise<boolean> => {
    if (!registration) return false;
    
    try {
      await registration.update();
      setLastUpdateCheck(new Date());
      
      // Return true if an update was found
      return isUpdateAvailable;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }, [registration, isUpdateAvailable]);
  
  const registerPeriodicSync = async (tag: string, minInterval: number): Promise<boolean> => {
    if (!periodicSyncSupported || !registration) return false;
    
    try {
      const periodicSyncManager = (registration as any).periodicSync;
      
      // Check if permission is already granted
      const status = await periodicSyncManager.getTags();
      if (status.includes(tag)) return true;
      
      // Request permission
      await periodicSyncManager.register(tag, {
        minInterval: minInterval * 60 * 1000, // Convert minutes to milliseconds
      });
      
      return true;
    } catch (error) {
      console.error('Failed to register periodic sync:', error);
      return false;
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
    appVersion,
    lastUpdateCheck,
    checkForUpdates,
    installationMode,
    networkType,
    isLowEndDevice,
    isLowEndExperience,
    periodicSyncSupported,
    registerPeriodicSync,
  };
}