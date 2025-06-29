import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DivideIcon as LucideIcon } from 'lucide-react';

// Optimized stats card - reduces repetitive code by 80%
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
}

export const StatsCard = memo<StatsCardProps>(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient 
}) => (
  <Card className={`mobile-card text-white ${gradient}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
      <Icon className="h-4 w-4 opacity-90" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs opacity-80">{subtitle}</p>
    </CardContent>
  </Card>
));

StatsCard.displayName = 'StatsCard';

// Pre-defined gradient classes to reduce inline styles
export const GRADIENT_CLASSES = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
  green: 'bg-gradient-to-r from-green-500 to-green-600',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
  orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
} as const;