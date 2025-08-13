import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb, Target } from 'lucide-react';

interface KPIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiData: {
    title: string;
    value: string;
    trend: number;
  } | null;
}

export default function KPIInsightModal({ isOpen, onClose, kpiData }: KPIInsightModalProps) {
  if (!kpiData) return null;

  const generateInsights = (title: string, trend: number) => {
    const insights = {
      'Receita Total Portfolio': {
        positive: {
          analysis: 'A receita total do portfólio está em crescimento sólido, indicando uma estratégia bem-sucedida de expansão e retenção de clientes.',
          recommendations: ['Manter estratégias atuais', 'Identificar oportunidades de upselling', 'Expandir para novos mercados'],
          risks: ['Possível saturação do mercado', 'Dependência de poucos clientes grandes']
        },
        negative: {
          analysis: 'A receita total está em declínio, o que pode indicar perda de clientes, redução do ticket médio ou problemas operacionais.',
          recommendations: ['Analisar causas da queda', 'Implementar programa de retenção', 'Revisar estratégia de precificação'],
          risks: ['Perda acelerada de market share', 'Problemas de fluxo de caixa', 'Necessidade de reestruturação']
        }
      },
      'Ticket Médio Portfolio': {
        positive: {
          analysis: 'O ticket médio crescente indica que os clientes estão gastando mais por transação, sugerindo maior valor percebido.',
          recommendations: ['Intensificar estratégias de upselling', 'Lançar produtos premium', 'Focar em experiência do cliente'],
          risks: ['Possível resistência a preços mais altos', 'Redução do volume de transações']
        },
        negative: {
          analysis: 'A redução do ticket médio pode indicar pressão competitiva, mudança no comportamento do consumidor ou problemas de qualidade.',
          recommendations: ['Analisar concorrência', 'Revisar estratégia de bundling', 'Melhorar proposta de valor'],
          risks: ['Pressão nas margens', 'Perda de rentabilidade', 'Necessidade de redução de custos']
        }
      },
      'Taxa Retenção Clientes': {
        positive: {
          analysis: 'Alta retenção de clientes demonstra satisfação e lealdade, reduzindo custos de aquisição e aumentando o LTV.',
          recommendations: ['Programas de fidelidade', 'Pesquisas de satisfação regulares', 'Comunicação proativa'],
          risks: ['Complacência', 'Redução de inovação', 'Entrada de novos concorrentes']
        },
        negative: {
          analysis: 'Baixa retenção indica problemas na experiência do cliente, competitividade ou entrega de valor.',
          recommendations: ['Programa urgente de retenção', 'Análise de causas de churn', 'Melhoria na experiência'],
          risks: ['Aumento do CAC', 'Redução da rentabilidade', 'Impacto negativo na reputação']
        }
      },
      'MRR': {
        positive: {
          analysis: 'O crescimento do MRR indica uma base sólida de receita recorrente, fundamental para previsibilidade financeira.',
          recommendations: ['Expandir base de assinantes', 'Implementar tiers de preço', 'Reduzir churn'],
          risks: ['Dependência de poucos clientes', 'Saturação do mercado', 'Pressão competitiva']
        },
        negative: {
          analysis: 'Queda no MRR pode indicar churn elevado, downgrade de planos ou problemas na aquisição de novos clientes.',
          recommendations: ['Analisar causas do churn', 'Programa de win-back', 'Revisar proposta de valor'],
          risks: ['Instabilidade financeira', 'Dificuldade em investimentos', 'Redução de valuation']
        }
      },
      'NPS': {
        positive: {
          analysis: 'NPS elevado indica alta satisfação e probabilidade de recomendação, gerando crescimento orgânico.',
          recommendations: ['Programa de embaixadores', 'Case studies com promotores', 'Amplificar feedback positivo'],
          risks: ['Expectativas crescentes', 'Necessidade de manter padrão', 'Complacência']
        },
        negative: {
          analysis: 'NPS baixo indica insatisfação dos clientes e risco de churn, além de potencial dano à reputação.',
          recommendations: ['Pesquisa detalhada de satisfação', 'Plano de melhoria urgente', 'Comunicação direta com detratores'],
          risks: ['Dano à reputação', 'Redução de indicações', 'Aumento do churn']
        }
      }
    };

    const kpiInsight = insights[title as keyof typeof insights];
    if (!kpiInsight) {
      return {
        analysis: 'Este KPI é fundamental para o negócio e deve ser monitorado constantemente.',
        recommendations: ['Acompanhar tendências', 'Comparar com benchmarks', 'Definir metas claras'],
        risks: ['Falta de ação baseada em dados', 'Perda de oportunidades']
      };
    }

    return trend >= 0 ? kpiInsight.positive : kpiInsight.negative;
  };

  const insight = generateInsights(kpiData.title, kpiData.trend);
  const isPositive = kpiData.trend >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Insights para {kpiData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Atual */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Status Atual</h3>
                  <p className="text-2xl font-bold">{kpiData.value}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <Badge variant={isPositive ? "default" : "destructive"}>
                    {kpiData.trend > 0 ? '+' : ''}{kpiData.trend}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Análise */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Análise</h3>
                  <p className="text-muted-foreground">{insight.analysis}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Recomendações</h3>
                  <ul className="space-y-1">
                    {insight.recommendations.map((rec, index) => (
                      <li key={index} className="text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Riscos */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Riscos</h3>
                  <ul className="space-y-1">
                    {insight.risks.map((risk, index) => (
                      <li key={index} className="text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}