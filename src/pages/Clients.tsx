import { useState } from 'react';
import { Search, Filter, Plus, Eye, Star, FileText, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClients } from '@/data/mockData';
import { Client, ServiceType } from '@/types/restaurant';
import { formatClientName, getServiceTypeLabel, formatCurrency, hasAchieved10kThisWeek } from '@/utils/clientUtils';
import { generateClientsPDF } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import ClientRegistrationForm from '@/components/ClientRegistrationForm';
import { Link } from 'react-router-dom';
import { MonthlyReportForm } from '@/components/MonthlyReportForm';
import { GeographicAnalysis } from '@/components/GeographicAnalysis';

const serviceTypes: (ServiceType | 'all')[] = [
  'all',
  'gestao-loja',
  'mentoria'
];

const getServiceTypeDisplayLabel = (serviceType: ServiceType | 'all'): string => {
  if (serviceType === 'all') return 'Todos os Serviços';
  return getServiceTypeLabel(serviceType);
};

const revenueRanges = [
  'Até R$ 10K/mês',
  'R$ 10K - R$ 30K/mês',
  'R$ 30K - R$ 50K/mês',
  'Acima R$ 50K/mês'
];

const performanceRanges = [
  'Top Performers (Rating >4.5)',
  'Médio Desempenho (3.5-4.5)',
  'Baixo Desempenho (<3.5)'
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showGeographicAnalysis, setShowGeographicAnalysis] = useState(false);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const filteredClients = clients.filter(client => {
    const clientName = formatClientName(client);
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesServiceType = selectedServiceType === 'all' || client.serviceType === selectedServiceType;
    
    return matchesSearch && matchesServiceType;
  });

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'delinquent': return 'bg-destructive text-destructive-foreground';
    }
  };

  const getStatusLabel = (status: Client['status']) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'delinquent': return 'Inadimplente';
    }
  };

  const handleSaveClient = (client: Client) => {
    setClients([...clients, client]);
    setShowRegistrationForm(false);
  };

  const handleCancelRegistration = () => {
    setShowRegistrationForm(false);
  };

  const handleExportPDF = async () => {
    if (filteredClients.length === 0) {
      toast({
        title: "Nenhum cliente encontrado",
        description: "Não há clientes para exportar com os filtros aplicados.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      await generateClientsPDF(filteredClients, searchTerm, selectedServiceType);
      toast({
        title: "Relatório exportado com sucesso!",
        description: `${filteredClients.length} clientes exportados para PDF.`
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar relatório",
        description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (showRegistrationForm) {
    return (
      <ClientRegistrationForm
        onSave={handleSaveClient}
        onCancel={handleCancelRegistration}
      />
    );
  }

  if (showGeographicAnalysis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowGeographicAnalysis(false)}
          >
            ← Voltar para Clientes
          </Button>
        </div>
        <GeographicAnalysis />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meus Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie e monitore seus clientes de consultoria
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExportPDF}
            disabled={isExporting || filteredClients.length === 0}
          >
            <FileText className="w-4 h-4 mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowGeographicAnalysis(true)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Análise Geográfica
          </Button>
          <Button 
            className="gap-2"
            onClick={() => setShowRegistrationForm(true)}
          >
            <Plus className="w-4 h-4" />
            Cadastrar Cliente
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do restaurante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedServiceType} onValueChange={(value) => setSelectedServiceType(value as ServiceType | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tipo de Serviço" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map((serviceType) => (
              <SelectItem key={serviceType} value={serviceType}>
                {getServiceTypeDisplayLabel(serviceType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredClients.length} de {clients.length} clientes
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-elevated transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{formatClientName(client)}</h3>
                    <Badge variant="outline" className="text-xs">
                      {getServiceTypeLabel(client.serviceType)}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      📍 {client.city}, {client.state}
                    </div>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {getStatusLabel(client.status)}
                  </Badge>
                </div>

                {/* Weekly Performance */}
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <span className={hasAchieved10kThisWeek(client) ? "text-success" : "text-muted-foreground"}>
                      {hasAchieved10kThisWeek(client) ? "🎯" : "⚡"} Faturou 10K+ esta semana: {hasAchieved10kThisWeek(client) ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">LTV Total</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(client.ltvData.totalValueGenerated)}
                    </p>
                    <p className={`text-xs ${client.ltvData.revenueExpansionRate > 0 ? 'text-success' : 'text-destructive'}`}>
                      {client.ltvData.revenueExpansionRate > 0 ? '↗️' : '↘️'} {Math.abs(client.ltvData.revenueExpansionRate)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor Pago</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(client.ltvData.totalValuePaid)}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-muted-foreground">Inadimplência</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(client.delinquencyData.currentDebt)}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      client.delinquencyData.riskLevel === 'low' ? 'bg-success/10 text-success' :
                      client.delinquencyData.riskLevel === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      Risco: {client.delinquencyData.riskLevel === 'low' ? 'Baixo' : 
                             client.delinquencyData.riskLevel === 'medium' ? 'Médio' : 'Alto'}
                    </span>
                  </div>
                </div>

                {/* Last Contact */}
                <div className="text-xs text-muted-foreground">
                  Último contato: {client.lastContact}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/cliente/${client.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateClientsPDF([client], '', selectedServiceType)}
                    title="Exportar cliente individual"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}