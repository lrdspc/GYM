'use client';

import { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';
import { useOfflineSync } from '../hooks/useOfflineSync';

interface BackgroundSyncStatusProps {
  showDetails?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number; // in milliseconds
}

/**
 * Component that shows the status of background sync operations
 * 
 * This is useful for PWAs that need to sync data in the background,
 * especially when the user goes offline and back online.
 */
export default function BackgroundSyncStatus({
  showDetails = false,
  autoHide = true,
  autoHideDelay = 5000,
}: BackgroundSyncStatusProps) {
  const { isOnline, periodicSyncSupported } = usePWA();
  const { 
    pendingActions, 
    syncStatus, 
    lastSyncTime, 
    syncError 
  } = useOfflineSync();
  
  const [visible, setVisible] = useState(false);

  // Show the component when sync status changes
  useEffect(() => {
    if (syncStatus === 'syncing' || syncStatus === 'error' || pendingActions.length > 0) {
      setVisible(true);
      
      // Auto-hide after successful sync if autoHide is true
      if (autoHide && syncStatus === 'success') {
        const timer = setTimeout(() => {
          setVisible(false);
        }, autoHideDelay);
        
        return () => clearTimeout(timer);
      }
    } else if (syncStatus === 'idle' && pendingActions.length === 0) {
      // Hide when there's nothing to sync
      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, autoHideDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [syncStatus, pendingActions.length, autoHide, autoHideDelay]);

  // Don't render anything if not visible
  if (!visible) return null;

  // Determine icon and color based on sync status
  let icon = null;
  let statusColor = 'bg-gray-500';
  let statusText = 'Aguardando sincronização';
  
  if (syncStatus === 'syncing') {
    statusColor = 'bg-blue-500';
    statusText = 'Sincronizando dados...';
    icon = (
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
  } else if (syncStatus === 'success') {
    statusColor = 'bg-green-500';
    statusText = 'Dados sincronizados';
    icon = (
      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  } else if (syncStatus === 'error') {
    statusColor = 'bg-red-500';
    statusText = 'Erro na sincronização';
    icon = (
      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  } else if (!isOnline && pendingActions.length > 0) {
    statusColor = 'bg-yellow-500';
    statusText = `${pendingActions.length} ações pendentes`;
    icon = (
      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  return (
    <div className="fixed bottom-16 right-4 z-40 flex items-center">
      <div className={`${statusColor} text-white rounded-full shadow-lg p-2 flex items-center space-x-2`}>
        <div className="flex-shrink-0">
          {icon}
        </div>
        
        <span className="text-sm font-medium pr-2">{statusText}</span>
        
        {/* Close button */}
        <button 
          onClick={() => setVisible(false)}
          className="ml-2 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Fechar"
        >
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Details panel */}
      {showDetails && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-sm">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detalhes da sincronização</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="font-medium text-gray-900 dark:text-white">{syncStatus}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Ações pendentes:</span>
              <span className="font-medium text-gray-900 dark:text-white">{pendingActions.length}</span>
            </div>
            
            {lastSyncTime && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Última sincronização:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(lastSyncTime).toLocaleTimeString()}
                </span>
              </div>
            )}
            
            {syncError && (
              <div className="mt-2 text-red-500 text-xs">
                Erro: {syncError}
              </div>
            )}
            
            {periodicSyncSupported && (
              <div className="mt-2 text-green-500 text-xs">
                Sincronização periódica ativada
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}