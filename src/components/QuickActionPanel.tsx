import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  urgency: 'high' | 'medium' | 'low';
  action: () => void;
}

interface QuickActionPanelProps {
  onNavigateToClients: () => void;
  onNavigateToReports: () => void;
}

export default function QuickActionPanel({ onNavigateToClients, onNavigateToReports }: QuickActionPanelProps) {
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Revisar Clientes em Risco',
      description: '3 clientes precisam de atenção imediata',
      icon: AlertTriangle,
      urgency: 'high',
      action: onNavigateToClients
    },
    {
      id: '2',
      title: 'Agendar Follow-ups',
      description: '5 clientes sem contato há 7+ dias',
      icon: Calendar,
      urgency: 'medium',
      action: onNavigateToClients
    },
    {
      id: '3',
      title: 'Analisar Performance',
      description: 'Relatório mensal disponível',
      icon: TrendingUp,
      urgency: 'low',
      action: onNavigateToReports
    },
    {
      id: '4',
      title: 'Oportunidades de Upsell',
      description: '8 clientes elegíveis para upgrade',
      icon: Target,
      urgency: 'medium',
      action: onNavigateToClients
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Baixa';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <div 
              key={action.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <action.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getUrgencyColor(action.urgency) as any} className="text-xs">
                  {getUrgencyText(action.urgency)}
                </Badge>
                <Button size="sm" variant="ghost" onClick={action.action}>
                  <BarChart3 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}