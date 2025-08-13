import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import KPICard from './KPICard';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DraggableKPICardProps {
  id: string;
  title: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  onClick?: () => void;
}

export default function DraggableKPICard({
  id,
  title,
  value,
  trend,
  icon,
  color,
  onClick,
}: DraggableKPICardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determinar cor baseada na tendência
  const getTrendColor = () => {
    if (trend > 0) return 'success';
    if (trend < 0) return 'destructive';
    return 'warning';
  };

  const cardColor = getTrendColor();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div onClick={onClick} className="cursor-pointer">
        <KPICard
          title={title}
          value={value}
          trend={trend}
          icon={icon}
          color={cardColor}
        />
      </div>
    </div>
  );
}