import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Client, PaymentCategory, ServiceType } from '@/types/restaurant';
import { getNextAvailableClientNumber, formatClientName, getPaymentCategoryLabel } from '@/utils/clientUtils';
import { mockClients } from '@/data/mockData';

const clientSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  serviceType: z.enum(['gestao-loja', 'mentoria']),
  paymentCategory: z.string(),
  totalValue: z.number().min(1, 'Valor deve ser maior que 0'),
  installmentCount: z.number().min(1, 'Deve ter pelo menos 1 parcela'),
  installmentValue: z.number().min(1, 'Valor da parcela deve ser maior que 0'),
  state: z.string().min(2, 'Estado é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  region: z.string().min(2, 'Região é obrigatória'),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientRegistrationFormProps {
  onSave: (client: Client) => void;
  onCancel: () => void;
}

const paymentCategories: { value: PaymentCategory; label: string }[] = [
  { value: 'gestao-loja-novos', label: 'Gestão de Loja - Novos Clientes' },
  { value: 'gestao-loja-parcelas-2000', label: 'Gestão de Loja - Parcelas R$ 2.000,00' },
  { value: 'gestao-loja-parcelas-1750', label: 'Gestão de Loja - Parcelas R$ 1.750,00' },
  { value: 'gestao-loja-parcelas-1800', label: 'Gestão de Loja - Parcelas R$ 1.800,00' },
  { value: 'gestao-loja-parcelas-1500', label: 'Gestão de Loja - Parcelas R$ 1.500,00' },
  { value: 'mentoria-novos', label: 'Mentoria - Novos Clientes' },
];

export default function ClientRegistrationForm({ onSave, onCancel }: ClientRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const nextClientNumber = getNextAvailableClientNumber(mockClients);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      serviceType: 'gestao-loja',
      paymentCategory: 'gestao-loja-novos',
      totalValue: 2000,
      installmentCount: 4,
      installmentValue: 500,
      state: '',
      city: '',
      region: '',
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    
    try {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        clientNumber: nextClientNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        serviceType: data.serviceType as ServiceType,
        paymentPlan: {
          category: data.paymentCategory as PaymentCategory,
          totalValue: data.totalValue,
          installments: Array.from({ length: data.installmentCount }, (_, index) => ({
            id: `installment-${Date.now()}-${index}`,
            amount: data.installmentValue,
            dueDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending' as const,
          }))
        },
        status: 'active',
        isActive: true,
        registrationDate: new Date().toISOString().split('T')[0],
        lastContact: new Date().toISOString().split('T')[0],
        weeklyRevenue: [],
        ltvData: {
          totalValueGenerated: 0,
          totalValuePaid: 0,
          activeTime: 0,
          revenueExpansionRate: 0,
          averageMonthlyValue: 0,
        },
        delinquencyData: {
          currentDebt: 0,
          delinquencyRate: 0,
          riskScore: 0,
          riskLevel: 'low',
          daysOverdue: 0,
        },
        state: data.state,
        city: data.city,
        region: data.region,
      };

      onSave(newClient);
      
      toast({
        title: "Cliente cadastrado com sucesso!",
        description: `${formatClientName(newClient)} foi adicionado ao sistema.`,
      });
      
    } catch (error) {
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Cadastro de Novo Cliente</CardTitle>
          <CardDescription>
            Cliente será registrado como: Cliente nº {nextClientNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="João" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Service Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Serviço</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gestao-loja">Gestão de Loja</SelectItem>
                          <SelectItem value="mentoria">Mentoria</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria de Pagamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Payment Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="totalValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2000" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="installmentCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Parcelas</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="4" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="installmentValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Parcela (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="500" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Região</FormLabel>
                      <FormControl>
                        <Input placeholder="Sudeste" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Cadastrar Cliente"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}