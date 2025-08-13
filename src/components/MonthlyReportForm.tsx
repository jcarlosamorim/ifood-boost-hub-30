import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Calculator, FileText, TrendingUp, AlertTriangle } from "lucide-react";

const monthlyReportSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2024),
  // Receitas e Vendas
  totalRevenue: z.number().min(0),
  orderCount: z.number().min(0),
  // Custos Fixos
  rent: z.number().min(0).default(2500),
  payroll: z.number().min(0).default(26000),
  accounting: z.number().min(0).default(500),
  otherFixedCosts: z.number().min(0).default(0),
  // Custos Variáveis
  ingredients: z.number().min(0),
  packaging: z.number().min(0),
  gasEnergy: z.number().min(0),
  // Indicadores Operacionais
  workingDays: z.number().min(1).max(31),
  cancelledOrders: z.number().min(0),
  topDish1Name: z.string().optional(),
  topDish1Quantity: z.number().min(0).optional(),
  topDish2Name: z.string().optional(),
  topDish2Quantity: z.number().min(0).optional(),
  topDish3Name: z.string().optional(),
  topDish3Quantity: z.number().min(0).optional(),
  // Pontos de Atenção
  missingIngredients: z.boolean().default(false),
  missingIngredientsDetails: z.string().optional(),
  equipmentFailure: z.boolean().default(false),
  equipmentFailureDetails: z.string().optional(),
  overtime: z.boolean().default(false),
  overtimeHours: z.number().min(0).optional(),
});

type MonthlyReportFormData = z.infer<typeof monthlyReportSchema>;

interface MonthlyReportFormProps {
  restaurantId: string;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const MonthlyReportForm = ({ restaurantId, onSave, onCancel }: MonthlyReportFormProps) => {
  const form = useForm<MonthlyReportFormData>({
    resolver: zodResolver(monthlyReportSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: 2024,
      rent: 2500,
      payroll: 26000,
      accounting: 500,
      otherFixedCosts: 0,
      missingIngredients: false,
      equipmentFailure: false,
      overtime: false,
    },
  });

  const watchedValues = form.watch();
  
  // Cálculos automáticos
  const averageTicket = watchedValues.orderCount > 0 ? watchedValues.totalRevenue / watchedValues.orderCount : 0;
  const ifoodFee = watchedValues.totalRevenue * 0.28;
  const totalFixedCosts = (watchedValues.rent || 0) + (watchedValues.payroll || 0) + (watchedValues.accounting || 0) + (watchedValues.otherFixedCosts || 0);
  const totalVariableCosts = (watchedValues.ingredients || 0) + ifoodFee + (watchedValues.packaging || 0) + (watchedValues.gasEnergy || 0);
  const netProfit = (watchedValues.totalRevenue || 0) - totalFixedCosts - totalVariableCosts;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const onSubmit = (data: MonthlyReportFormData) => {
    const reportData = {
      ...data,
      restaurantId,
      averageTicket,
      ifoodFee,
      totalFixedCosts,
      totalVariableCosts,
      netProfit,
      topDishes: [
        { name: data.topDish1Name || '', quantity: data.topDish1Quantity || 0 },
        { name: data.topDish2Name || '', quantity: data.topDish2Quantity || 0 },
        { name: data.topDish3Name || '', quantity: data.topDish3Quantity || 0 },
      ].filter(dish => dish.name && dish.quantity > 0),
      missingIngredientsData: {
        occurred: data.missingIngredients,
        details: data.missingIngredientsDetails || ''
      },
      equipmentFailureData: {
        occurred: data.equipmentFailure,
        details: data.equipmentFailureDetails || ''
      },
      overtimeData: {
        occurred: data.overtime,
        hours: data.overtimeHours || 0
      }
    };

    onSave(reportData);
    toast({
      title: "Relatório salvo com sucesso!",
      description: `Relatório de ${data.month}/${data.year} foi salvo.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Relatório Mensal</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Mês de Referência */}
          <Card>
            <CardHeader>
              <CardTitle>📅 Mês de Referência</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="12" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="2024" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Receitas e Vendas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                📈 Receitas e Vendas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faturamento Total iFood</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="R$ 0,00"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Pedidos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Ticket Médio (Calculado automaticamente)</Label>
                <p className="text-2xl font-bold text-primary">{formatCurrency(averageTicket)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Custos Fixos */}
          <Card>
            <CardHeader>
              <CardTitle>💰 Custos Fixos (Atualizar só se mudar)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Aluguel 
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payroll"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Folha de Pagamento 
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accounting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Contador 
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherFixedCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outros Fixos</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Custos Variáveis */}
          <Card>
            <CardHeader>
              <CardTitle>🥘 Custos Variáveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Gasto com Ingredientes</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="packaging"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embalagens</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gasEnergy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gás/Energia (estimado)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Taxa iFood (28% automático)</Label>
                <p className="text-xl font-bold text-red-600">{formatCurrency(ifoodFee)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Indicadores Operacionais */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Indicadores Operacionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workingDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dias Trabalhados no Mês</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="31" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cancelledOrders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pedidos Cancelados</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />
              
              <div>
                <Label className="text-sm font-medium">Principais Pratos Vendidos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="topDish1Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1. Nome do Prato</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="topDish2Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2. Nome do Prato</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="topDish3Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>3. Nome do Prato</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="topDish1Quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidades</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="topDish2Quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidades</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="topDish3Quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidades</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pontos de Atenção */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ⚠ Pontos de Atenção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Faltou ingrediente importante?</Label>
                  <FormField
                    control={form.control}
                    name="missingIngredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {watchedValues.missingIngredients && (
                  <FormField
                    control={form.control}
                    name="missingIngredientsDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qual ingrediente?</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex items-center justify-between">
                  <Label>Algum equipamento quebrou?</Label>
                  <FormField
                    control={form.control}
                    name="equipmentFailure"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {watchedValues.equipmentFailure && (
                  <FormField
                    control={form.control}
                    name="equipmentFailureDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qual equipamento?</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex items-center justify-between">
                  <Label>Precisou fazer hora extra?</Label>
                  <FormField
                    control={form.control}
                    name="overtime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {watchedValues.overtime && (
                  <FormField
                    control={form.control}
                    name="overtimeHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantas horas?</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                💰 Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(watchedValues.totalRevenue || 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Custos Totais</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalFixedCosts + totalVariableCosts)}
                  </p>
                </div>
                <div className={`text-center p-4 rounded-lg ${
                  netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                  <p className={`text-2xl font-bold ${
                    netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(netProfit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Relatório
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};