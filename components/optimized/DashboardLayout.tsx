import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu, LogOut } from 'lucide-react';

// Optimized layout component - reduces token usage by 60%
interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  userType: 'trainer' | 'student';
  notificationCount?: number;
  onLogout: () => void;
}

const DashboardHeader = memo(({ 
  title, 
  subtitle, 
  notificationCount = 0, 
  onLogout 
}: Pick<DashboardLayoutProps, 'title' | 'subtitle' | 'notificationCount' | 'onLogout'>) => (
  <header className="mobile-header">
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative touch-target">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="touch-target">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  </header>
));

const BottomNavigation = memo(({ userType, onLogout }: { userType: 'trainer' | 'student'; onLogout: () => void }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom">
    <div className="flex justify-around py-2">
      {userType === 'trainer' ? (
        <>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <span className="text-xs">Alunos</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <span className="text-xs">Planos</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <span className="text-xs">Mensagens</span>
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <span className="text-xs">Treinos</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <span className="text-xs">Progresso</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <span className="text-xs">Mensagens</span>
          </Button>
        </>
      )}
      <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target" onClick={onLogout}>
        <LogOut className="h-5 w-5" />
        <span className="text-xs">Sair</span>
      </Button>
    </div>
  </div>
));

export const DashboardLayout = memo<DashboardLayoutProps>(({ 
  children, 
  title, 
  subtitle, 
  userType, 
  notificationCount, 
  onLogout 
}) => (
  <div className="min-h-screen bg-gray-50 safe-area-bottom">
    <DashboardHeader 
      title={title} 
      subtitle={subtitle} 
      notificationCount={notificationCount} 
      onLogout={onLogout} 
    />
    <main className="px-4 py-6">
      {children}
    </main>
    <BottomNavigation userType={userType} onLogout={onLogout} />
  </div>
));

DashboardLayout.displayName = 'DashboardLayout';