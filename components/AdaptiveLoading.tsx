'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePWA } from '../hooks/usePWA';

interface AdaptiveLoadingProps {
  children: ReactNode;
  fallback?: ReactNode;
  lowEndFallback?: ReactNode;
  offlineFallback?: ReactNode;
  loadingThreshold?: number; // in milliseconds
}

/**
 * AdaptiveLoading component that renders different content based on device capabilities and network conditions
 * 
 * This component is useful for implementing adaptive loading patterns in PWAs, where you want to
 * serve different content based on the user's device capabilities and network conditions.
 */
export default function AdaptiveLoading({
  children,
  fallback = <div className="p-4 text-center">Carregando...</div>,
  lowEndFallback = <div className="p-4 text-center">Carregando versão otimizada...</div>,
  offlineFallback = <div className="p-4 text-center">Conteúdo não disponível offline</div>,
  loadingThreshold = 3000, // 3 seconds default
}: AdaptiveLoadingProps) {
  const { isOnline, isLowEndDevice, isLowEndExperience, networkType } = usePWA();
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Simulate content loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, isLowEndExperience ? loadingThreshold * 1.5 : loadingThreshold);

    // Set a timeout for showing fallback content if loading takes too long
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        setTimeoutReached(true);
      }
    }, loadingThreshold * 2);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(fallbackTimer);
    };
  }, [isLoading, isLowEndExperience, loadingThreshold]);

  // If offline and content requires network, show offline fallback
  if (!isOnline) {
    return offlineFallback;
  }

  // If still loading but timeout reached, show appropriate fallback
  if (isLoading && timeoutReached) {
    return isLowEndExperience ? lowEndFallback : fallback;
  }

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-2 text-sm text-gray-600">
          {isLowEndExperience ? 'Otimizando para seu dispositivo...' : 'Carregando...'}
        </p>
        {isLowEndDevice && (
          <p className="mt-1 text-xs text-gray-500">
            Modo de economia de recursos ativado
          </p>
        )}
        {networkType && networkType !== 'unknown' && networkType !== '4g' && (
          <p className="mt-1 text-xs text-gray-500">
            Conexão {networkType} detectada
          </p>
        )}
      </div>
    );
  }

  // If content is loaded, show the actual content
  return <>{children}</>;
}
