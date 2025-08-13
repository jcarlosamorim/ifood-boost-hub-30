import { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, CreditCard, Bell, Shield, Palette, BookOpen, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso.",
    });
    setIsLoading(false);
  };

  const handleDownloadManual = async () => {
    setIsLoading(true);
    try {
      const { generateUserManualPDF } = await import('@/utils/exportUtils');
      await generateUserManualPDF();
      toast({
        title: "Manual baixado",
        description: "O manual de utilização foi baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao baixar o manual. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências da plataforma
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados pessoais e informações de contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="name" defaultValue={user?.name} className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" defaultValue={user?.email} className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="phone" placeholder="(11) 99999-9999" className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="city" placeholder="São Paulo, SP" className="pl-10" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa/Consultoria</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="company" placeholder="Nome da sua consultoria" className="pl-10" />
                </div>
              </div>
              
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como você deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas de Performance</p>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando um cliente apresentar queda de performance
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Relatórios Mensais</p>
                    <p className="text-sm text-muted-foreground">
                      Notificação quando relatórios mensais estiverem prontos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Novos Clientes</p>
                    <p className="text-sm text-muted-foreground">
                      Confirmação quando um novo cliente for adicionado
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">WhatsApp Business</p>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações via WhatsApp Business
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Faturamento</CardTitle>
              <CardDescription>Gerencie seus clientes e configurações de cobrança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Plano Atual</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Consultant Pro</span>
                      <span className="text-primary font-semibold">R$ 297/mês</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Até 50 restaurantes, relatórios ilimitados
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Próximo Pagamento</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">•••• •••• •••• 1234</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cobrança em 15/07/2024
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Faturamento por Cliente</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Burger House Premium</span>
                    <span className="font-medium">R$ 800/mês</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Pizzaria Famiglia</span>
                    <span className="font-medium">R$ 650/mês</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Sushi Master</span>
                    <span className="font-medium">R$ 1.200/mês</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Mantenha sua conta segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div>
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button variant="outline">Alterar Senha</Button>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação de Dois Fatores</p>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalização da Marca</CardTitle>
              <CardDescription>Customize a aparência dos seus relatórios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo">Logo da Empresa</Label>
                    <Input id="logo" type="file" accept="image/*" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recomendado: 200x60px, formato PNG
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" placeholder="Sua Consultoria LTDA" />
                  </div>
                  
                  <div>
                    <Label htmlFor="tagline">Slogan</Label>
                    <Input id="tagline" placeholder="Especialistas em delivery" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Cores do Tema</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="p-3 border rounded-lg text-center">
                        <div className="w-8 h-8 bg-primary rounded mx-auto mb-2"></div>
                        <span className="text-xs">Primária</span>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="w-8 h-8 bg-secondary rounded mx-auto mb-2"></div>
                        <span className="text-xs">Secundária</span>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="w-8 h-8 bg-accent rounded mx-auto mb-2"></div>
                        <span className="text-xs">Destaque</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Branding'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual de Utilização</CardTitle>
              <CardDescription>Baixe o manual completo da plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <BookOpen className="w-8 h-8 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Manual Completo de Utilização</h3>
                    <p className="text-muted-foreground mb-4">
                      Manual detalhado com todas as funcionalidades da plataforma, incluindo:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                      <li>• Visão geral da plataforma e navegação</li>
                      <li>• Dashboard principal e KPIs interativos</li>
                      <li>• Gestão completa de clientes</li>
                      <li>• Sistema de relatórios e exportação</li>
                      <li>• Análise setorial e geográfica</li>
                      <li>• Configurações e personalização</li>
                      <li>• Dicas de uso otimizado e troubleshooting</li>
                    </ul>
                    <Button 
                      onClick={handleDownloadManual} 
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isLoading ? 'Gerando PDF...' : 'Baixar Manual (PDF)'}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Informações do Manual</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Versão:</span>
                      <span className="ml-2 font-medium">1.0.0</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última atualização:</span>
                      <span className="ml-2 font-medium">Janeiro 2024</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Páginas:</span>
                      <span className="ml-2 font-medium">~25 páginas</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Formato:</span>
                      <span className="ml-2 font-medium">PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}