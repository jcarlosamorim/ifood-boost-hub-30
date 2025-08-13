import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings2, Download, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardSettingsProps {
  visibleKPIs: string[];
  onKPIVisibilityChange: (kpiId: string, visible: boolean) => void;
  onExportDashboard: () => void;
}

const KPI_DESCRIPTIONS = {
  '1': 'Receita Total Portfolio - Soma total de todas as receitas do portfólio',
  '2': 'Ticket Médio Portfolio - Valor médio gasto por cliente',
  '3': 'Taxa Crescimento Portfolio - Percentual de crescimento da receita',
  '4': 'Taxa Retenção Clientes - Percentual de clientes que se mantêm ativos',
  '5': 'Clientes Gestão Loja - Número total de clientes do serviço de gestão',
  '6': 'Taxa de Inadimplência - Percentual de clientes em atraso',
  '7': 'MRR - Receita Recorrente Mensal',
  '8': 'Clientes +10K Semana - Clientes que faturaram mais de R$ 10.000 na semana'
};

export default function DashboardSettings({ visibleKPIs, onKPIVisibilityChange, onExportDashboard }: DashboardSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    onExportDashboard();
    setIsOpen(false);
    toast({
      title: "Exportação iniciada",
      description: "O relatório do dashboard está sendo gerado...",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="w-4 h-4 mr-2" />
          Configurações
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurações do Dashboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* KPI Visibility Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visibilidade dos KPIs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(KPI_DESCRIPTIONS).map(([id, description]) => (
                <div key={id} className="flex items-center space-x-2">
                  <Switch
                    id={`kpi-${id}`}
                    checked={visibleKPIs.includes(id)}
                    onCheckedChange={(checked) => onKPIVisibilityChange(id, checked)}
                  />
                  <Label htmlFor={`kpi-${id}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      {visibleKPIs.includes(id) ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{description}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exportação</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExport} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar Dashboard em PDF
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Gera um relatório completo com todos os KPIs, gráficos e insights
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}