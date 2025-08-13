import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface DashboardTooltipProps {
  children: ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export default function DashboardTooltip({ children, content, side = 'top' }: DashboardTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="group relative inline-flex items-center gap-1">
            {children}
            <Info className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-help" />
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}