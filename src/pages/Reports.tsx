import { useState } from 'react';
import { FileText, Download, Calendar, Filter, Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const reportTypes = [
  {
    id: 'portfolio',
    name: 'Relatório de Portfólio',
    description: 'Visão geral completa de todos os restaurantes',
    lastGenerated: 'Há 2 dias',
    format: 'PDF'
  },
  {
    id: 'individual',
    name: 'Relatórios Individuais',
    description: 'Performance específica de cada restaurante',
    lastGenerated: 'Há 1 dia',
    format: 'PDF'
  },
  {
    id: 'sector',
    name: 'Análise Setorial',
    description: 'Benchmark por categoria de restaurante',
    lastGenerated: 'Há 3 dias',
    format: 'Excel'
  },
  {
    id: 'roi',
    name: 'Relatório de ROI',
    description: 'Valor demonstrado para cada cliente',
    lastGenerated: 'Há 5 dias',
    format: 'PDF'
  }
];

const monthlyReports = [
  {
    month: 'Junho 2024',
    portfolioReport: 'portfolio_junho_2024.pdf',
    clientReports: 7,
    status: 'Enviado'
  },
  {
    month: 'Maio 2024',
    portfolioReport: 'portfolio_maio_2024.pdf',
    clientReports: 7,
    status: 'Enviado'
  },
  {
    month: 'Abril 2024',
    portfolioReport: 'portfolio_abril_2024.pdf',
    clientReports: 6,
    status: 'Enviado'
  }
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Relatórios & Analytics</h1>
        <p className="text-muted-foreground">
          Gere e gerencie relatórios para seus clientes e análises de portfólio
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Gerar Relatório</p>
                <p className="text-xs text-muted-foreground">Portfolio completo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Mail className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Envio Automático</p>
                <p className="text-xs text-muted-foreground">Configurar emails</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Download className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Downloads</p>
                <p className="text-xs text-muted-foreground">Histórico de reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Share2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Compartilhar</p>
                <p className="text-xs text-muted-foreground">Links diretos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Novo Relatório</CardTitle>
          <CardDescription>Configure e gere relatórios personalizados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Mês Atual</SelectItem>
                  <SelectItem value="last">Mês Anterior</SelectItem>
                  <SelectItem value="quarter">Último Trimestre</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Formato</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full gap-2">
                <FileText className="w-4 h-4" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Relatórios Disponíveis</CardTitle>
          <CardDescription>Escolha o tipo de relatório que deseja gerar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                  <Badge variant="outline">{report.format}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Último: {report.lastGenerated}
                  </span>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-3 h-3" />
                    Baixar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Reports History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Relatórios Mensais</CardTitle>
          <CardDescription>Relatórios automáticos enviados para os clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.month}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.clientReports} relatórios de clientes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-success text-success-foreground">
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}