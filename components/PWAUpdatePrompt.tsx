'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePWA } from '../hooks/usePWA';

interface UpdatePromptProps {
  autoCheckInterval?: number; // in minutes
  dismissible?: boolean;
  appName?: string;
  showVersion?: boolean;
}

export default function PWAUpdatePrompt({
  autoCheckInterval = 60, // Check every hour by default
  dismissible = true,
  appName = 'FitTrainer Pro',
  showVersion = true,
}: UpdatePromptProps) {
  const { 
    isUpdateAvailable, 
    applyUpdate, 
    appVersion, 
    lastUpdateCheck, 
    checkForUpdates 
  } = usePWA();
  
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [updateCheckStatus, setUpdateCheckStatus] = useState<'idle' | 'checking' | 'complete'>('idle');
  const [dismissCount, setDismissCount] = useState(0);
  const [updateDetails, setUpdateDetails] = useState<{
    version?: string;
    releaseNotes?: string[];
  }>({});

  // Auto-check for updates based on interval
  useEffect(() => {
    if (autoCheckInterval <= 0) return;
    
    const checkInterval = autoCheckInterval * 60 * 1000; // Convert to milliseconds
    
    // Check if we need to run an update check based on last check time
    const shouldCheckNow = () => {
      if (!lastUpdateCheck) return true;
      
      const now = new Date();
      const timeSinceLastCheck = now.getTime() - lastUpdateCheck.getTime();
      return timeSinceLastCheck > checkInterval;
    };
    
    // Initial check if needed
    if (shouldCheckNow()) {
      checkForUpdatesHandler();
    }
    
    // Set up interval for future checks
    const intervalId = setInterval(() => {
      checkForUpdatesHandler();
    }, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [autoCheckInterval, lastUpdateCheck]);

  // Show prompt when update is available
  useEffect(() => {
    if (isUpdateAvailable) {
      // Simulate fetching update details
      // In a real app, you might get this from your service worker or an API
      setUpdateDetails({
        version: appVersion ? `${parseFloat(appVersion) + 0.1}` : '1.1.0',
        releaseNotes: [
          'Melhorias de desempenho',
          'Novos recursos de treino',
          'Correções de bugs'
        ]
      });
      
      setShowUpdatePrompt(true);
    }
  }, [isUpdateAvailable, appVersion]);

  const checkForUpdatesHandler = useCallback(async () => {
    setUpdateCheckStatus('checking');
    await checkForUpdates();
    setUpdateCheckStatus('complete');
    
    // Reset status after a delay
    setTimeout(() => {
      setUpdateCheckStatus('idle');
    }, 3000);
  }, [checkForUpdates]);

  const handleUpdate = () => {
    applyUpdate();
    setShowUpdatePrompt(false);
  };

  const handleDismiss = () => {
    setDismissCount(prev => prev + 1);
    setShowUpdatePrompt(false);
    
    // If user has dismissed multiple times, set a longer timeout before showing again
    if (dismissCount >= 2) {
      // After 3 dismissals, we'll wait longer before showing again
      setTimeout(() => {
        if (isUpdateAvailable) {
          setShowUpdatePrompt(true);
        }
      }, 4 * 60 * 60 * 1000); // 4 hours
    }
  };

  const handleManualCheck = async () => {
    await checkForUpdatesHandler();
    
    // If no update was found, show a message
    if (!isUpdateAvailable && updateCheckStatus === 'complete') {
      // You could show a toast or other notification here
      console.log('No updates available');
    }
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg rounded-t-lg z-50 border-t border-gray-200 animate-slide-up dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 rounded-full p-2 dark:bg-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Nova atualização disponível</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Uma nova versão do {appName} está disponível
                {showVersion && updateDetails.version && ` (v${updateDetails.version})`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                aria-label="Adiar atualização"
              >
                Depois
              </button>
            )}
            <button
              onClick={handleUpdate}
              className="px-4 py-1.5 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-600"
              aria-label="Instalar atualização"
            >
              Atualizar
            </button>
          </div>
        </div>
        
        {/* Release notes section */}
        {updateDetails.releaseNotes && updateDetails.releaseNotes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Novidades nesta versão:</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
              {updateDetails.releaseNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Manual check button */}
        <div className="mt-3 text-xs text-right">
          <button 
            onClick={handleManualCheck}
            disabled={updateCheckStatus === 'checking'}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {updateCheckStatus === 'checking' ? 'Verificando...' : 
             updateCheckStatus === 'complete' ? 'Verificação concluída' : 
             'Verificar novamente'}
          </button>
        </div>
      </div>
    </div>
  );
}