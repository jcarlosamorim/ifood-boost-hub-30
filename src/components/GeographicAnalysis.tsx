import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { mockClients } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const GeographicAnalysis = () => {
  // Agrupar dados por estado
  const stateData = mockClients.reduce((acc, client) => {
    const state = client.state;
    if (!acc[state]) {
      acc[state] = {
        totalRevenue: 0,
        averageGrowth: 0,
        clients: 0,
        activeClients: 0,
        delinquentClients: 0,
        inactiveClients: 0
      };
    }
    
    acc[state].totalRevenue += client.ltvData.totalValueGenerated;
    acc[state].averageGrowth += client.ltvData.revenueExpansionRate;
    acc[state].clients += 1;
    
    if (client.status === 'active') acc[state].activeClients += 1;
    else if (client.status === 'delinquent') acc[state].delinquentClients += 1;
    else if (client.status === 'inactive') acc[state].inactiveClients += 1;
    
    return acc;
  }, {} as Record<string, any>);

  // Calcular média de crescimento por estado
  Object.keys(stateData).forEach(state => {
    stateData[state].averageGrowth = stateData[state].averageGrowth / stateData[state].clients;
  });

  // Preparar dados para o gráfico de barras
  const stateChartData = Object.entries(stateData).map(([state, data]) => ({
    state,
    revenue: data.totalRevenue,
    growth: data.averageGrowth,
    clients: data.clients
  }));

  // Agrupar dados por região
  const regionData = mockClients.reduce((acc, client) => {
    const region = client.region;
    if (!acc[region]) {
      acc[region] = { count: 0, revenue: 0 };
    }
    acc[region].count += 1;
    acc[region].revenue += client.ltvData.totalValueGenerated;
    return acc;
  }, {} as Record<string, any>);

  // Preparar dados para o gráfico de pizza
  const regionChartData = Object.entries(regionData).map(([region, data]) => ({
    name: region,
    value: data.count,
    revenue: data.revenue
  }));

  const formatCurrency = (value: number) => 
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'delinquent': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise Geográfica</h1>
          <p className="text-muted-foreground">Distribuição e performance dos clientes por região</p>
        </div>
      </div>

      {/* Cards de Resumo por Região */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(regionData).map(([region, data]) => (
          <Card key={region}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{region}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clientes:</span>
                  <span className="font-semibold">{data.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LTV Total:</span>
                  <span className="font-semibold">{formatCurrency(data.revenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Barras - LTV por Estado */}
      <Card>
        <CardHeader>
          <CardTitle>LTV Total por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stateChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'LTV Total' : 'Clientes'
                ]}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Distribuição por Região */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Clientes por Região</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={regionChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regionChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Estados que Precisam de Atenção */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Estados que Precisam de Atenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stateData)
              .filter(([_, data]) => data.averageGrowth < 5 || data.delinquentClients > 0)
              .map(([state, data]) => (
                <div key={state} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{state}</h3>
                    <p className="text-sm text-muted-foreground">
                      {data.clients} clientes • Crescimento médio: {data.averageGrowth.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {data.delinquentClients > 0 && (
                      <Badge variant="destructive">
                        {data.delinquentClients} inadimplentes
                      </Badge>
                    )}
                    {data.averageGrowth < 5 && (
                      <Badge variant="secondary">
                        Baixo crescimento
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento por Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(stateData).map(([state, data]) => (
          <Card key={state}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {state}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total de Clientes</p>
                    <p className="font-semibold text-2xl">{data.clients}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">LTV Total</p>
                    <p className="font-semibold text-2xl">{formatCurrency(data.totalRevenue)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-success/10 rounded">
                    <p className="font-semibold text-success">{data.activeClients}</p>
                    <p className="text-muted-foreground">Ativos</p>
                  </div>
                  <div className="text-center p-2 bg-destructive/10 rounded">
                    <p className="font-semibold text-destructive">{data.delinquentClients}</p>
                    <p className="text-muted-foreground">Inadimplentes</p>
                  </div>
                  <div className="text-center p-2 bg-muted/10 rounded">
                    <p className="font-semibold text-muted-foreground">{data.inactiveClients}</p>
                    <p className="text-muted-foreground">Inativos</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Crescimento Médio</span>
                  <div className="flex items-center gap-1">
                    {data.averageGrowth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`font-semibold ${
                      data.averageGrowth > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {data.averageGrowth.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Lista de clientes no estado */}
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Clientes neste estado:</h4>
                  <div className="space-y-1">
                    {mockClients
                      .filter(client => client.state === state)
                      .map(client => (
                        <div key={client.id} className="flex items-center justify-between text-sm">
                          <span>Cliente nº {client.clientNumber} - {client.firstName} {client.lastName}</span>
                          <Badge className={getStatusColor(client.status)} variant="outline">
                            {client.status === 'active' ? 'Ativo' : 
                             client.status === 'inactive' ? 'Inativo' : 'Inadimplente'}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};