import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Package, 
  Star, 
  UserCheck, 
  AlertTriangle, 
  Trophy, 
  Briefcase, 
  Heart,
  CreditCard,
  Calculator,
  UserX,
  Target,
  Repeat,
  LifeBuoy,
  ThumbsUp,
  Percent,
  Calendar,
  Receipt,
  UserPlus
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import DraggableKPICard from '@/components/DraggableKPICard';
import KPIInsightModal from '@/components/KPIInsightModal';
import ClientPainPoints from '@/components/ClientPainPoints';
import DashboardTooltip from '@/components/DashboardTooltip';
import DashboardSettings from '@/components/DashboardSettings';
import QuickActionPanel from '@/components/QuickActionPanel';
import { consultingKPIs, monthlyRevenueData, sectorPerformanceData } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { generateDashboardPDF } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

const clientDistributionData = [
  { name: 'Top 25%', value: 40, color: '#22c55e' },
  { name: 'Medium 50%', value: 45, color: '#3b82f6' },
  { name: 'Bottom 25%', value: 15, color: '#ef4444' }
];

const kpiData = [
  {
    id: '1',
    title: 'Receita Total Portfolio',
    value: `R$ ${consultingKPIs.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
    trend: consultingKPIs.totalRevenueGrowth,
    icon: DollarSign
  },
  {
    id: '2',
    title: 'Ticket Médio Portfolio',
    value: `R$ ${consultingKPIs.averageLTV.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
    trend: consultingKPIs.averageLTVGrowth,
    icon: ShoppingCart
  },
  {
    id: '3',
    title: 'Taxa Crescimento Portfolio',
    value: `${consultingKPIs.revenueExpansionRate}%`,
    trend: consultingKPIs.revenueExpansionRateChange,
    icon: TrendingUp
  },
  {
    id: '4',
    title: 'Taxa Retenção Clientes',
    value: `${consultingKPIs.clientRetentionRate}%`,
    trend: consultingKPIs.clientRetentionRateChange,
    icon: Users
  },
  {
    id: '5',
    title: 'Clientes Gestão Loja',
    value: consultingKPIs.gestaoLojaClients.toLocaleString('pt-BR'),
    trend: consultingKPIs.gestaoLojaClientsChange,
    icon: Package
  },
  {
    id: '6',
    title: 'Taxa de Inadimplência',
    value: `${consultingKPIs.delinquencyRate}% ⚠️`,
    trend: consultingKPIs.delinquencyRateChange,
    icon: Star
  },
  {
    id: '7',
    title: 'MRR',
    value: `R$ ${consultingKPIs.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
    trend: consultingKPIs.mrrGrowth,
    icon: Repeat
  },
  {
    id: '8',
    title: 'Clientes +10K Semana',
    value: consultingKPIs.clientsOver10kThisWeek.toString(),
    trend: consultingKPIs.clientsOver10kThisWeekChange,
    icon: ThumbsUp
  }
];

export default function Dashboard() {
  const [items, setItems] = useState(kpiData);
  const [selectedKPI, setSelectedKPI] = useState<{title: string; value: string; trend: number} | null>(null);
  const [visibleKPIs, setVisibleKPIs] = useState<string[]>(kpiData.map(item => item.id));
  const navigate = useNavigate();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const formatCurrency = (value: number) => 
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleKPIClick = (item: any) => {
    setSelectedKPI({
      title: item.title,
      value: item.value,
      trend: item.trend
    });
  };

  const handleKPIVisibilityChange = (kpiId: string, visible: boolean) => {
    setVisibleKPIs(prev => 
      visible 
        ? [...prev, kpiId]
        : prev.filter(id => id !== kpiId)
    );
  };

  const handleExportDashboard = async () => {
    try {
      await generateDashboardPDF();
      toast({
        title: "Sucesso",
        description: "Relatório do dashboard exportado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao exportar o relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const filteredItems = items.filter(item => visibleKPIs.includes(item.id));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <DashboardTooltip content="Esta é sua visão geral com os principais indicadores de performance do seu portfólio de restaurantes. Você pode arrastar os cartões para reorganizar e clicar neles para ver insights detalhados.">
            <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
          </DashboardTooltip>
          <p className="text-muted-foreground">
            Visão geral do desempenho do seu portfólio de restaurantes
          </p>
        </div>
        <DashboardSettings 
          visibleKPIs={visibleKPIs}
          onKPIVisibilityChange={handleKPIVisibilityChange}
          onExportDashboard={handleExportDashboard}
        />
      </div>

      {/* KPI Grid com Drag and Drop */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={filteredItems.map(item => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <DashboardTooltip 
                key={item.id}
                content={`Clique para ver insights detalhados sobre ${item.title}. Arraste para reordenar os cartões.`}
              >
                <DraggableKPICard
                  id={item.id}
                  title={item.title}
                  value={item.value}
                  trend={item.trend}
                  icon={item.icon}
                  color="primary"
                  onClick={() => handleKPIClick(item)}
                />
              </DashboardTooltip>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Quick Actions Panel */}
      <QuickActionPanel 
        onNavigateToClients={() => navigate('/clients')}
        onNavigateToReports={() => navigate('/reports')}
      />

      {/* Dores dos Clientes */}
      <DashboardTooltip content="Esta seção mostra os principais pontos de dor dos seus clientes baseado em dados reais de feedback e performance.">
        <ClientPainPoints />
      </DashboardTooltip>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <DashboardTooltip content="Gráfico mostra a evolução da receita mensal. Tendência crescente indica boa performance do portfólio.">
              <CardTitle>Tendência de Receita Mensal</CardTitle>
            </DashboardTooltip>
            <CardDescription>Evolução da receita nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Client Performance Distribution */}
        <Card>
          <CardHeader>
            <DashboardTooltip content="Distribuição dos clientes em categorias de performance: Top 25% (melhor desempenho), Médio 50% e Bottom 25% (necessita atenção).">
              <CardTitle>Distribuição de Performance</CardTitle>
            </DashboardTooltip>
            <CardDescription>Classificação dos clientes por desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={clientDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {clientDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Performance */}
        <Card>
          <CardHeader>
            <DashboardTooltip content="Análise de receita por tipo de restaurante. Identifica quais setores geram mais receita e oportunidades de crescimento.">
              <CardTitle>Performance por Setor</CardTitle>
            </DashboardTooltip>
            <CardDescription>Receita por categoria de restaurante</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sectorPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Alert Panel */}
        <Card>
          <CardHeader>
            <DashboardTooltip content="Alertas automáticos baseados em indicadores de risco como ratings baixos, falta de contato e performance abaixo da média.">
              <CardTitle>Alertas de Risco</CardTitle>
            </DashboardTooltip>
            <CardDescription>Clientes que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                <div>
                  <p className="font-medium text-destructive">Padaria do Bairro</p>
                  <p className="text-sm text-muted-foreground">Rating baixo (3.8) + crescimento negativo</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-warning/20 bg-warning/5 rounded-lg">
                <div>
                  <p className="font-medium text-warning">Sabor Caseiro</p>
                  <p className="text-sm text-muted-foreground">Sem contato há 5 dias</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-warning/20 bg-warning/5 rounded-lg">
                <div>
                  <p className="font-medium text-warning">Cliente em Potencial</p>
                  <p className="text-sm text-muted-foreground">Taxa de conversão abaixo da média</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Insights */}
      <KPIInsightModal
        isOpen={!!selectedKPI}
        onClose={() => setSelectedKPI(null)}
        kpiData={selectedKPI}
      />
    </div>
  );
}