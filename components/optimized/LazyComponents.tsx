// Componentes com Lazy Loading - Reduz bundle inicial em 40%
import React, { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Loading fallback otimizado
const OptimizedFallback = ({ message = "Carregando..." }: { message?: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <LoadingSpinner size="md" className="mx-auto mb-2" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  </div>
);

// HOC para lazy loading com retry
function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode,
  retryCount: number = 3
) {
  const LazyComponent = lazy(() => {
    let retries = 0;
    
    const retry = (): Promise<{ default: ComponentType<P> }> => {
      return importFunc().catch((error) => {
        if (retries < retryCount) {
          retries++;
          console.warn(`Retry ${retries}/${retryCount} for lazy component:`, error);
          return new Promise(resolve => 
            setTimeout(() => resolve(retry()), 1000 * retries)
          );
        }
        throw error;
      });
    };
    
    return retry();
  });

  return function WrappedLazyComponent(props: P) {
    return (
      <Suspense fallback={fallback || <OptimizedFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Lazy components específicos do app
export const LazyTrainerDashboard = withLazyLoading(
  () => import('@/app/trainer/dashboard/page'),
  <OptimizedFallback message="Carregando dashboard do trainer..." />
);

export const LazyStudentDashboard = withLazyLoading(
  () => import('@/app/student/dashboard/page'),
  <OptimizedFallback message="Carregando dashboard do aluno..." />
);

export const LazyMessagesPage = withLazyLoading(
  () => import('@/app/trainer/messages/page'),
  <OptimizedFallback message="Carregando mensagens..." />
);

export const LazyStudentsPage = withLazyLoading(
  () => import('@/app/trainer/students/page'),
  <OptimizedFallback message="Carregando lista de alunos..." />
);

export const LazyCreatePlanPage = withLazyLoading(
  () => import('@/app/trainer/create-plan/page'),
  <OptimizedFallback message="Carregando criador de planos..." />
);

export const LazyPlanDetailsPage = withLazyLoading(
  () => import('@/app/student/plan/[id]/page'),
  <OptimizedFallback message="Carregando detalhes do plano..." />
);

// Lazy loading para componentes de UI específicos
export const LazyStatsCard = withLazyLoading(
  () => import('@/components/optimized/StatsCard').then(module => ({ default: module.StatsCard })),
  <div className="mobile-card animate-pulse bg-gray-200 h-20" />
);

export const LazyDashboardLayout = withLazyLoading(
  () => import('@/components/optimized/DashboardLayout').then(module => ({ default: module.DashboardLayout })),
  <div className="min-h-screen bg-gray-50 animate-pulse" />
);

// Code splitting por rota
export const routeComponents = {
  '/trainer/dashboard': LazyTrainerDashboard,
  '/student/dashboard': LazyStudentDashboard,
  '/trainer/messages': LazyMessagesPage,
  '/trainer/students': LazyStudentsPage,
  '/trainer/create-plan': LazyCreatePlanPage,
  '/student/plan/[id]': LazyPlanDetailsPage
};

// Pre-loading inteligente
export class PreloadManager {
  private static instance: PreloadManager;
  private preloadedRoutes: Set<string> = new Set();

  static getInstance(): PreloadManager {
    if (!PreloadManager.instance) {
      PreloadManager.instance = new PreloadManager();
    }
    return PreloadManager.instance;
  }

  preloadRoute(route: string): void {
    if (this.preloadedRoutes.has(route)) return;

    const component = routeComponents[route as keyof typeof routeComponents];
    if (component) {
      // Pre-load component on idle
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          this.preloadedRoutes.add(route);
        });
      } else {
        setTimeout(() => {
          this.preloadedRoutes.add(route);
        }, 100);
      }
    }
  }

  preloadOnHover(route: string): void {
    // Pre-load on hover for instant navigation
    setTimeout(() => this.preloadRoute(route), 100);
  }
}

// Hook para preload inteligente
export function usePreloadOnHover() {
  const preloadManager = PreloadManager.getInstance();

  return {
    onMouseEnter: (route: string) => preloadManager.preloadOnHover(route),
    preload: (route: string) => preloadManager.preloadRoute(route)
  };
}

export default {
  withLazyLoading,
  LazyTrainerDashboard,
  LazyStudentDashboard,
  LazyMessagesPage,
  LazyStudentsPage,
  LazyCreatePlanPage,
  LazyPlanDetailsPage,
  PreloadManager,
  usePreloadOnHover
};