import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'destructive' | 'secondary';
  className?: string;
}

export default function KPICard({ title, value, trend, icon: Icon, color, className }: KPICardProps) {
  const isPositive = trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  const colorClasses = {
    primary: 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10',
    success: 'border-success/20 bg-gradient-to-br from-success/5 to-success/10',
    warning: 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10',
    destructive: 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10',
    secondary: 'border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10'
  };

  const iconColorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
    secondary: 'text-secondary'
  };

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-elevated', colorClasses[color], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-2 rounded-lg bg-background/50', iconColorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(trend)}%
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}