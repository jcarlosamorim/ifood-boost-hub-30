import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingDown, Users, MessageSquare, Clock } from 'lucide-react';

const painPointsData = [
  {
    pain: "Dificuldade em atrair novos clientes",
    percentage: 73,
    urgency: "alta",
    impact: "Alto",
    description: "Maioria dos restaurantes relatam dificuldades em marketing digital e captação de clientes"
  },
  {
    pain: "Gestão de custos e margem de lucro",
    percentage: 68,
    urgency: "alta", 
    impact: "Muito Alto",
    description: "Problemas com controle de custos de ingredientes e otimização de margem"
  },
  {
    pain: "Qualidade e consistência dos pratos",
    percentage: 52,
    urgency: "média",
    impact: "Alto",
    description: "Manter padrão de qualidade entre diferentes turnos e funcionários"
  },
  {
    pain: "Gestão de estoque e desperdício",
    percentage: 47,
    urgency: "média",
    impact: "Médio",
    description: "Dificuldades em previsão de demanda e controle de estoque"
  },
  {
    pain: "Experiência do cliente e atendimento",
    percentage: 41,
    urgency: "alta",
    impact: "Alto", 
    description: "Melhorar tempo de atendimento e satisfação do cliente"
  }
];

export default function ClientPainPoints() {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'alta': return 'destructive';
      case 'média': return 'outline';
      case 'baixa': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Top 5 Dores dos Clientes
        </CardTitle>
        <CardDescription>
          Análise baseada em 127 formulários de diagnóstico coletados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {painPointsData.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{index + 1}. {item.pain}</span>
                    <Badge variant={getUrgencyColor(item.urgency)} className="text-xs">
                      {item.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">
                      <Users className="h-3 w-3 inline mr-1" />
                      {item.percentage}% dos clientes
                    </span>
                    <span className="text-muted-foreground">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      Impacto: {item.impact}
                    </span>
                  </div>
                </div>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Última atualização</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Dados coletados entre Jan-Dez 2024 • Próxima coleta: Jan 2025
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}