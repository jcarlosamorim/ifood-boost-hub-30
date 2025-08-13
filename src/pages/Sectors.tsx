import { 
  TrendingUp,
  Users,
  Target,
  UserPlus,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Award,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Zap,
  UserCheck,
  Calculator,
  Repeat
} from 'lucide-react';
import KPICard from '@/components/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const sectorKPIs = {
  marketing: {
    leads: { value: 1247, trend: 18.5 },
    conversion: { value: 12.8, trend: 2.3 },
    cac: { value: 185, trend: -5.2 },
    roi: { value: 320, trend: 22.1 },
    impressions: { value: 485000, trend: 15.7 },
    ctr: { value: 2.4, trend: 0.8 }
  },
  comercial: {
    vendas: { value: 89, trend: 15.2 },
    ticketMedio: { value: 2850, trend: 8.7 },
    taxaFechamento: { value: 23.5, trend: 4.2 },
    pipeline: { value: 450000, trend: 12.8 },
    nps: { value: 78, trend: 5 },
    tempoVenda: { value: 18, trend: -12.5 }
  },
  uso: {
    mau: { value: 15480, trend: 22.3 },
    retencao: { value: 87.5, trend: 3.2 },
    engajamento: { value: 68.2, trend: 8.5 },
    sessoesMedia: { value: 4.2, trend: 12.1 },
    tempoSessao: { value: 23, trend: 15.8 },
    churn: { value: 2.8, trend: -8.5 }
  },
  expansao: {
    taxaIndicacoes: { value: 34.5, trend: 15.8 },
    numeroIndicacoes: { value: 127, trend: 28.5 },
    clientesRecompra: { value: 89, trend: 12.3 },
    indicacoesQualificadas: { value: 67.8, trend: 18.2 },
    fechamentoIndicacoes: { value: 42.5, trend: 22.1 },
    revenueIndicacoes: { value: 850000, trend: 35.7 },
    revenueExpansionRate: { value: 118.5, trend: 25.4 },
    upsellRate: { value: 23.8, trend: 14.6 }
  },
  onboarding: {
    tempoOnboarding: { value: 7, trend: -25.5 },
    taxaSucesso: { value: 94.2, trend: 8.2 },
    satisfacao: { value: 88.5, trend: 12.1 },
    suporteTickets: { value: 45, trend: -15.8 },
    treinamentosConcluidos: { value: 156, trend: 32.5 },
    tempoResposta: { value: 2.5, trend: -35.2 }
  }
};

export default function Sectors() {
  const formatCurrency = (value: number) => 
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  const formatPercent = (value: number) => `${value}%`;

  const getTrendColor = (trend: number): 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' => {
    if (trend > 5) return 'success';
    if (trend < -5) return 'destructive';
    return 'warning';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Setores da Empresa</h1>
        <p className="text-muted-foreground">
          KPIs e métricas por área da empresa
        </p>
      </div>

      <Tabs defaultValue="marketing" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="comercial">Comercial</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="uso">Uso</TabsTrigger>
          <TabsTrigger value="expansao">Expansão</TabsTrigger>
        </TabsList>

        {/* Marketing */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard
              title="Leads Gerados"
              value={sectorKPIs.marketing.leads.value.toLocaleString('pt-BR')}
              trend={sectorKPIs.marketing.leads.trend}
              icon={Users}
              color={getTrendColor(sectorKPIs.marketing.leads.trend)}
            />
            
            <KPICard
              title="Prospect -> MQL"
              value={formatPercent(sectorKPIs.marketing.conversion.value)}
              trend={sectorKPIs.marketing.conversion.trend}
              icon={Target}
              color={getTrendColor(sectorKPIs.marketing.conversion.trend)}
            />
            
            <KPICard
              title="CAC - Custo de Aquisição"
              value={formatCurrency(sectorKPIs.marketing.cac.value)}
              trend={sectorKPIs.marketing.cac.trend}
              icon={DollarSign}
              color={getTrendColor(sectorKPIs.marketing.cac.trend)}
            />
            
            <KPICard
              title="ROI Marketing"
              value={`${sectorKPIs.marketing.roi.value}%`}
              trend={sectorKPIs.marketing.roi.trend}
              icon={TrendingUp}
              color={getTrendColor(sectorKPIs.marketing.roi.trend)}
            />
            
            <KPICard
              title="Impressões"
              value={(sectorKPIs.marketing.impressions.value / 1000).toFixed(0) + 'k'}
              trend={sectorKPIs.marketing.impressions.trend}
              icon={BarChart3}
              color={getTrendColor(sectorKPIs.marketing.impressions.trend)}
            />
            
            <KPICard
              title="CTR"
              value={formatPercent(sectorKPIs.marketing.ctr.value)}
              trend={sectorKPIs.marketing.ctr.trend}
              icon={MessageSquare}
              color={getTrendColor(sectorKPIs.marketing.ctr.trend)}
            />
          </div>

          {/* Gráficos de Marketing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Canais de Venda</CardTitle>
                <CardDescription>Performance por canal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Google Ads</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Facebook Ads</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                      <span className="text-sm font-medium">52%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email Marketing</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                      </div>
                      <span className="text-sm font-medium">34%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Orgânico</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funil de Conversão</CardTitle>
                <CardDescription>Taxa de conversão por etapa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-2xl font-bold">2,840</p>
                      <p className="text-sm text-muted-foreground">Visitantes</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500/10 p-4 rounded-lg">
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-muted-foreground">Leads (43.9%)</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-500/10 p-4 rounded-lg">
                      <p className="text-2xl font-bold">159</p>
                      <p className="text-sm text-muted-foreground">MQL (12.8%)</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-500/10 p-4 rounded-lg">
                      <p className="text-2xl font-bold">89</p>
                      <p className="text-sm text-muted-foreground">Vendas (56.0%)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comercial */}
        <TabsContent value="comercial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard
              title="Vendas Fechadas"
              value={sectorKPIs.comercial.vendas.value.toString()}
              trend={sectorKPIs.comercial.vendas.trend}
              icon={Award}
              color={getTrendColor(sectorKPIs.comercial.vendas.trend)}
            />
            
            <KPICard
              title="Ticket Médio"
              value={formatCurrency(sectorKPIs.comercial.ticketMedio.value)}
              trend={sectorKPIs.comercial.ticketMedio.trend}
              icon={DollarSign}
              color={getTrendColor(sectorKPIs.comercial.ticketMedio.trend)}
            />
            
            <KPICard
              title="Taxa de Fechamento"
              value={formatPercent(sectorKPIs.comercial.taxaFechamento.value)}
              trend={sectorKPIs.comercial.taxaFechamento.trend}
              icon={Target}
              color={getTrendColor(sectorKPIs.comercial.taxaFechamento.trend)}
            />
            
            <KPICard
              title="Pipeline"
              value={formatCurrency(sectorKPIs.comercial.pipeline.value)}
              trend={sectorKPIs.comercial.pipeline.trend}
              icon={BarChart3}
              color={getTrendColor(sectorKPIs.comercial.pipeline.trend)}
            />
            
            <KPICard
              title="NPS Vendas"
              value={sectorKPIs.comercial.nps.value.toString()}
              trend={sectorKPIs.comercial.nps.trend}
              icon={MessageSquare}
              color={getTrendColor(sectorKPIs.comercial.nps.trend)}
            />
            
            <KPICard
              title="Tempo Médio de Venda (dias)"
              value={sectorKPIs.comercial.tempoVenda.value.toString()}
              trend={sectorKPIs.comercial.tempoVenda.trend}
              icon={Clock}
              color={getTrendColor(sectorKPIs.comercial.tempoVenda.trend)}
            />
          </div>
        </TabsContent>

        {/* Financeiro */}
        <TabsContent value="financeiro" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard
              title="Faturamento Bruto"
              value="R$ 2.850.000"
              trend={18.5}
              icon={DollarSign}
              color={getTrendColor(18.5)}
            />
            
            <KPICard
              title="Faturamento Líquido"
              value="R$ 2.280.000"
              trend={15.2}
              icon={Calculator}
              color={getTrendColor(15.2)}
            />
            
            <KPICard
              title="Taxa de Inadimplência"
              value="2.8%"
              trend={-12.5}
              icon={AlertCircle}
              color={getTrendColor(-12.5)}
            />
            
            <KPICard
              title="Margem de Lucro"
              value="32.5%"
              trend={8.7}
              icon={TrendingUp}
              color={getTrendColor(8.7)}
            />
            
            <KPICard
              title="Custo Operacional"
              value="R$ 1.920.000"
              trend={-5.2}
              icon={BarChart3}
              color={getTrendColor(-5.2)}
            />
            
            <KPICard
              title="EBITDA"
              value="R$ 928.000"
              trend={22.1}
              icon={Award}
              color={getTrendColor(22.1)}
            />
          </div>
        </TabsContent>

        {/* Onboarding */}
        <TabsContent value="onboarding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard
              title="Tempo Onboarding (dias)"
              value={sectorKPIs.onboarding.tempoOnboarding.value.toString()}
              trend={sectorKPIs.onboarding.tempoOnboarding.trend}
              icon={Clock}
              color={getTrendColor(sectorKPIs.onboarding.tempoOnboarding.trend)}
            />
            
            <KPICard
              title="Taxa de Sucesso"
              value={formatPercent(sectorKPIs.onboarding.taxaSucesso.value)}
              trend={sectorKPIs.onboarding.taxaSucesso.trend}
              icon={CheckCircle}
              color={getTrendColor(sectorKPIs.onboarding.taxaSucesso.trend)}
            />
            
            <KPICard
              title="Satisfação Onboarding"
              value={formatPercent(sectorKPIs.onboarding.satisfacao.value)}
              trend={sectorKPIs.onboarding.satisfacao.trend}
              icon={MessageSquare}
              color={getTrendColor(sectorKPIs.onboarding.satisfacao.trend)}
            />
            
            <KPICard
              title="Tickets de Suporte"
              value={sectorKPIs.onboarding.suporteTickets.value.toString()}
              trend={sectorKPIs.onboarding.suporteTickets.trend}
              icon={AlertCircle}
              color={getTrendColor(sectorKPIs.onboarding.suporteTickets.trend)}
            />
            
            <KPICard
              title="Treinamentos Concluídos"
              value={sectorKPIs.onboarding.treinamentosConcluidos.value.toString()}
              trend={sectorKPIs.onboarding.treinamentosConcluidos.trend}
              icon={Award}
              color={getTrendColor(sectorKPIs.onboarding.treinamentosConcluidos.trend)}
            />
            
            <KPICard
              title="Tempo Resposta (horas)"
              value={sectorKPIs.onboarding.tempoResposta.value.toString()}
              trend={sectorKPIs.onboarding.tempoResposta.trend}
              icon={UserPlus}
              color={getTrendColor(sectorKPIs.onboarding.tempoResposta.trend)}
            />
          </div>
        </TabsContent>

        {/* Uso */}
        <TabsContent value="uso" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard
              title="MAU - Usuários Ativos"
              value={(sectorKPIs.uso.mau.value / 1000).toFixed(1) + 'k'}
              trend={sectorKPIs.uso.mau.trend}
              icon={Users}
              color={getTrendColor(sectorKPIs.uso.mau.trend)}
            />
            
            <KPICard
              title="Taxa de Retenção"
              value={formatPercent(sectorKPIs.uso.retencao.value)}
              trend={sectorKPIs.uso.retencao.trend}
              icon={UserCheck}
              color={getTrendColor(sectorKPIs.uso.retencao.trend)}
            />
            
            <KPICard
              title="Engajamento"
              value={formatPercent(sectorKPIs.uso.engajamento.value)}
              trend={sectorKPIs.uso.engajamento.trend}
              icon={Zap}
              color={getTrendColor(sectorKPIs.uso.engajamento.trend)}
            />
            
            <KPICard
              title="Sessões por Usuário"
              value={sectorKPIs.uso.sessoesMedia.value.toFixed(1)}
              trend={sectorKPIs.uso.sessoesMedia.trend}
              icon={BarChart3}
              color={getTrendColor(sectorKPIs.uso.sessoesMedia.trend)}
            />
            
            <KPICard
              title="Tempo de Sessão (min)"
              value={sectorKPIs.uso.tempoSessao.value.toString()}
              trend={sectorKPIs.uso.tempoSessao.trend}
              icon={Clock}
              color={getTrendColor(sectorKPIs.uso.tempoSessao.trend)}
            />
            
            <KPICard
              title="Taxa de Churn"
              value={formatPercent(sectorKPIs.uso.churn.value)}
              trend={sectorKPIs.uso.churn.trend}
              icon={AlertCircle}
              color={getTrendColor(sectorKPIs.uso.churn.trend)}
            />
          </div>
        </TabsContent>

        {/* Expansão */}
        <TabsContent value="expansao" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard
              title="Taxa de Indicações"
              value={formatPercent(sectorKPIs.expansao.taxaIndicacoes.value)}
              trend={sectorKPIs.expansao.taxaIndicacoes.trend}
              icon={UserPlus}
              color={getTrendColor(sectorKPIs.expansao.taxaIndicacoes.trend)}
            />
            
            <KPICard
              title="Número de Indicações"
              value={sectorKPIs.expansao.numeroIndicacoes.value.toString()}
              trend={sectorKPIs.expansao.numeroIndicacoes.trend}
              icon={Users}
              color={getTrendColor(sectorKPIs.expansao.numeroIndicacoes.trend)}
            />
            
            <KPICard
              title="Clientes Recompra"
              value={sectorKPIs.expansao.clientesRecompra.value.toString()}
              trend={sectorKPIs.expansao.clientesRecompra.trend}
              icon={Repeat}
              color={getTrendColor(sectorKPIs.expansao.clientesRecompra.trend)}
            />
            
            <KPICard
              title="Indicações Qualificadas"
              value={formatPercent(sectorKPIs.expansao.indicacoesQualificadas.value)}
              trend={sectorKPIs.expansao.indicacoesQualificadas.trend}
              icon={Target}
              color={getTrendColor(sectorKPIs.expansao.indicacoesQualificadas.trend)}
            />
            
            <KPICard
              title="Fechamento Indicações"
              value={formatPercent(sectorKPIs.expansao.fechamentoIndicacoes.value)}
              trend={sectorKPIs.expansao.fechamentoIndicacoes.trend}
              icon={Award}
              color={getTrendColor(sectorKPIs.expansao.fechamentoIndicacoes.trend)}
            />
            
            <KPICard
              title="Revenue Indicações"
              value={formatCurrency(sectorKPIs.expansao.revenueIndicacoes.value)}
              trend={sectorKPIs.expansao.revenueIndicacoes.trend}
              icon={DollarSign}
              color={getTrendColor(sectorKPIs.expansao.revenueIndicacoes.trend)}
            />
            
            <KPICard
              title="Revenue Expansion Rate"
              value={`${sectorKPIs.expansao.revenueExpansionRate.value}%`}
              trend={sectorKPIs.expansao.revenueExpansionRate.trend}
              icon={TrendingUp}
              color={getTrendColor(sectorKPIs.expansao.revenueExpansionRate.trend)}
            />
            
            <KPICard
              title="Taxa de Upsell"
              value={formatPercent(sectorKPIs.expansao.upsellRate.value)}
              trend={sectorKPIs.expansao.upsellRate.trend}
              icon={BarChart3}
              color={getTrendColor(sectorKPIs.expansao.upsellRate.trend)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}