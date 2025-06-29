'use client';

import { useState, useEffect } from 'react';
import { usePWA } from './usePWA';

interface SyncItem {
  id: string;
  action: string;
  data: any;
  timestamp: number;
  retries: number;
}

export function useOfflineSync() {
  const { isOnline } = usePWA();
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load queue from IndexedDB on mount
  useEffect(() => {
    const loadQueue = async () => {
      if (typeof window !== 'undefined') {
        try {
          const storedQueue = localStorage.getItem('offlineSyncQueue');
          if (storedQueue) {
            setSyncQueue(JSON.parse(storedQueue));
          }
          
          const lastSync = localStorage.getItem('lastSyncTime');
          if (lastSync) {
            setLastSyncTime(parseInt(lastSync, 10));
          }
        } catch (error) {
          console.error('Failed to load sync queue:', error);
        }
      }
    };

    loadQueue();
  }, []);

  // Save queue to IndexedDB when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && syncQueue.length > 0) {
      localStorage.setItem('offlineSyncQueue', JSON.stringify(syncQueue));
    }
  }, [syncQueue]);

  // Attempt to sync when online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0 && !isSyncing) {
      syncData();
    }
  }, [isOnline, syncQueue]);

  // Add item to sync queue
  const addToSyncQueue = (action: string, data: any) => {
    const newItem: SyncItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    setSyncQueue((prevQueue) => [...prevQueue, newItem]);
    return newItem.id;
  };

  // Remove item from sync queue
  const removeFromSyncQueue = (id: string) => {
    setSyncQueue((prevQueue) => prevQueue.filter((item) => item.id !== id));
  };

  // Sync data with server
  const syncData = async () => {
    if (!isOnline || syncQueue.length === 0 || isSyncing) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Process each item in the queue
      const newQueue = [...syncQueue];
      const successfulSyncs: string[] = [];

      for (const item of newQueue) {
        try {
          // Simulate API call - replace with actual API calls
          await processSyncItem(item);
          successfulSyncs.push(item.id);
        } catch (error) {
          // Increment retry count
          item.retries += 1;
          
          // If too many retries, mark for removal
          if (item.retries >= 5) {
            successfulSyncs.push(item.id);
            console.error(`Sync item ${item.id} failed after 5 retries, removing from queue`);
          }
        }
      }

      // Remove successful syncs from queue
      setSyncQueue((prevQueue) => 
        prevQueue.filter((item) => !successfulSyncs.includes(item.id))
      );

      // Update last sync time
      const now = Date.now();
      setLastSyncTime(now);
      localStorage.setItem('lastSyncTime', now.toString());
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncError('Failed to sync data with server');
    } finally {
      setIsSyncing(false);
    }
  };

  // Process a single sync item (replace with actual API calls)
  const processSyncItem = async (item: SyncItem) => {
    // This is a placeholder - replace with actual API calls
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          console.log(`Synced item ${item.id} (${item.action})`);
          resolve();
        } else {
          console.error(`Failed to sync item ${item.id} (${item.action})`);
          reject(new Error('Simulated sync failure'));
        }
      }, 500);
    });
  };

  // Force sync even if not automatically triggered
  const forceSyncData = () => {
    if (isOnline && !isSyncing) {
      syncData();
    }
  };

  return {
    addToSyncQueue,
    removeFromSyncQueue,
    syncData: forceSyncData,
    isSyncing,
    syncQueue,
    lastSyncTime,
    syncError,
    queueLength: syncQueue.length,
  };
}