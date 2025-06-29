'use client';

import { useOfflineSync } from '../hooks/useOfflineSync';
import { usePWA } from '../hooks/usePWA';
import { useState, useEffect } from 'react';

export default function SyncStatusIndicator() {
  const { isOnline } = usePWA();
  const { isSyncing, queueLength, lastSyncTime, syncData } = useOfflineSync();
  const [showDetails, setShowDetails] = useState(false);
  const [lastSyncFormatted, setLastSyncFormatted] = useState<string>('Nunca');

  useEffect(() => {
    if (lastSyncTime) {
      const date = new Date(lastSyncTime);
      setLastSyncFormatted(
        date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }
  }, [lastSyncTime]);

  if (!isOnline && queueLength === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isSyncing
            ? 'bg-yellow-500'
            : queueLength > 0
            ? 'bg-red-500'
            : 'bg-green-500'
        }`}
      >
        {isSyncing ? (
          <svg
            className="animate-spin h-6 w-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : queueLength > 0 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {showDetails && (
        <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-900">Status de Sincronização</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-medium ${
                  !isOnline
                    ? 'text-red-600'
                    : isSyncing
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {!isOnline
                  ? 'Offline'
                  : isSyncing
                  ? 'Sincronizando...'
                  : 'Sincronizado'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Itens pendentes:</span>
              <span className="font-medium">{queueLength}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Última sincronização:</span>
              <span className="font-medium">{lastSyncFormatted}</span>
            </div>
          </div>

          {isOnline && queueLength > 0 && (
            <button
              onClick={syncData}
              className="mt-3 w-full py-2 px-3 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sincronizar agora
            </button>
          )}
        </div>
      )}
    </div>
  );
}
