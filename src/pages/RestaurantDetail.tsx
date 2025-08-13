import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MessageCircle, 
  Calendar, 
  MapPin,
  TrendingUp,
  User,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockClients } from '@/data/mockData';
import { formatClientName, formatCurrency } from '@/utils/clientUtils';

// Mock data para o gráfico de LTV histórico
const mockLTVHistory = [
  { month: 'Jan', ltv: 15000, growth: 8 },
  { month: 'Fev', ltv: 18500, growth: 12 },
  { month: 'Mar', ltv: 22000, growth: 15 },
  { month: 'Abr', ltv: 25800, growth: 18 },
  { month: 'Mai', ltv: 28500, growth: 12 },
  { month: 'Jun', ltv: 32000, growth: 10 }
];

const mockPaymentHistory = [
  { date: '2024-01-15', amount: 500, status: 'paid', description: 'Parcela 1/4' },
  { date: '2024-02-15', amount: 500, status: 'paid', description: 'Parcela 2/4' },
  { date: '2024-03-15', amount: 500, status: 'pending', description: 'Parcela 3/4' },
  { date: '2024-04-15', amount: 500, status: 'pending', description: 'Parcela 4/4' }
];

export default function RestaurantDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const client = mockClients.find(c => c.id === id);

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'delinquent': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'delinquent': return 'Inadimplente';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.firstName} {client.lastName}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="text-sm">{client.serviceType === 'gestao-loja' ? 'Gestão de Loja' : 'Mentoria'}</Badge>
              <Badge className={getStatusColor(client.status)}>
                {getStatusLabel(client.status)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contatar
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Reunião
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold">R$ {client.ltvData.totalValueGenerated.toLocaleString('pt-BR')}</div>
              <div className="text-sm text-muted-foreground">LTV Total</div>
              <div className="text-sm text-success">↗️ {client.ltvData.revenueExpansionRate}%</div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{client.clientNumber}</div>
              <div className="text-sm text-muted-foreground">Número do Cliente</div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold">R$ {client.ltvData.totalValuePaid.toLocaleString('pt-BR')}</div>
              <div className="text-sm text-muted-foreground">Total Pago</div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{client.ltvData.activeTime}</div>
              <div className="text-sm text-muted-foreground">Dias Ativo</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'payments', label: 'Pagamentos' },
          { id: 'performance', label: 'Performance' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.id)}
            className="rounded-b-none"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Evolução do LTV</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockLTVHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), 'LTV']} />
                  <Line type="monotone" dataKey="ltv" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Cliente
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">📍 {client.city}, {client.state} - {client.region}</p>
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Contato</h4>
                  <p className="text-muted-foreground">Último contato: {client.lastContact}</p>
                </div>
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Status</h4>
                  <p><strong>Status:</strong> {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Inadimplente'}</p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Dados de Pagamento</h4>
                    <p><strong>Categoria:</strong> {client.paymentPlan.category}</p>
                    <p><strong>Valor Total:</strong> R$ {client.paymentPlan.totalValue.toLocaleString('pt-BR')}</p>
                    <p><strong>Parcelas:</strong> {client.paymentPlan.installments.length}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Dados de Inadimplência</h4>
                    <p><strong>Dívida Atual:</strong> R$ {client.delinquencyData.currentDebt.toLocaleString('pt-BR')}</p>
                    <p><strong>Taxa de Inadimplência:</strong> {client.delinquencyData.delinquencyRate}%</p>
                    <p><strong>Nível de Risco:</strong> {client.delinquencyData.riskLevel === 'low' ? 'Baixo' : client.delinquencyData.riskLevel === 'medium' ? 'Médio' : 'Alto'}</p>
                    <p><strong>Dias em Atraso:</strong> {client.delinquencyData.daysOverdue}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Métricas LTV</h4>
                    <p><strong>Tempo Ativo:</strong> {client.ltvData.activeTime} dias</p>
                    <p><strong>Taxa de Expansão:</strong> {client.ltvData.revenueExpansionRate}%</p>
                    <p><strong>Valor Médio Mensal:</strong> R$ {client.ltvData.averageMonthlyValue.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Histórico de Pagamentos
            </h3>
            <div className="space-y-4">
              {mockPaymentHistory.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">{payment.description}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                    {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Risco
            </h3>
            <div className="space-y-4">
              {client.delinquencyData.riskScore > 50 && (
                <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
                  <h4 className="font-semibold text-destructive">Alto Risco de Inadimplência</h4>
                  <p className="text-sm">Score de risco: {client.delinquencyData.riskScore}/100</p>
                </div>
              )}
              
              {client.delinquencyData.daysOverdue > 0 && (
                <div className="p-4 border border-warning rounded-lg bg-warning/5">
                  <h4 className="font-semibold text-warning">Pagamento em Atraso</h4>
                  <p className="text-sm">{client.delinquencyData.daysOverdue} dias de atraso</p>
                </div>
              )}
              
              {client.ltvData.revenueExpansionRate < 0 && (
                <div className="p-4 border border-warning rounded-lg bg-warning/5">
                  <h4 className="font-semibold text-warning">Receita em Declínio</h4>
                  <p className="text-sm">Taxa de expansão: {client.ltvData.revenueExpansionRate}%</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Métricas de Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Taxa de Expansão de Receita</p>
                  <p className="text-sm text-muted-foreground">Crescimento do faturamento</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${client.ltvData.revenueExpansionRate > 0 ? 'text-success' : 'text-destructive'}`}>
                    {client.ltvData.revenueExpansionRate}%
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Tempo de Vida do Cliente</p>
                  <p className="text-sm text-muted-foreground">Dias como cliente ativo</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{client.ltvData.activeTime}</p>
                  <p className="text-sm text-muted-foreground">dias</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Valor Médio Mensal</p>
                  <p className="text-sm text-muted-foreground">Receita média por mês</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatCurrency(client.ltvData.averageMonthlyValue)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Receita Semanal</h3>
            <div className="space-y-4">
              {client.weeklyRevenue.length > 0 ? (
                client.weeklyRevenue.map((week, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Semana {week.weekStart}</p>
                      <p className="text-sm text-muted-foreground">
                        {week.achieved10k ? '🎯 Meta de 10K atingida' : '⚡ Meta de 10K não atingida'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(week.revenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum dado de receita semanal disponível
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}