export interface Client {
  id: string;
  clientNumber: number;
  firstName: string;
  lastName: string;
  serviceType: 'gestao-loja' | 'mentoria';
  paymentPlan: {
    category: PaymentCategory;
    totalValue: number;
    installments: PaymentInstallment[];
  };
  status: 'active' | 'inactive' | 'delinquent';
  isActive: boolean;
  registrationDate: string;
  deactivationDate?: string;
  lastContact: string;
  weeklyRevenue: WeeklyRevenue[];
  ltvData: ClientLTV;
  delinquencyData: DelinquencyData;
  state: string;
  city: string;
  region: string;
}

export interface PaymentInstallment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface WeeklyRevenue {
  weekStart: string; // Always Wednesday
  weekEnd: string;
  revenue: number;
  achieved10k: boolean;
}

export interface ClientLTV {
  totalValueGenerated: number;
  totalValuePaid: number;
  activeTime: number; // days
  revenueExpansionRate: number;
  averageMonthlyValue: number;
}

export interface DelinquencyData {
  currentDebt: number;
  delinquencyRate: number; // percentage
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  lastPaymentDate?: string;
  daysOverdue: number;
}

export type PaymentCategory = 
  | 'gestao-loja-novos'
  | 'gestao-loja-parcelas-2000'
  | 'gestao-loja-parcelas-1750'
  | 'gestao-loja-parcelas-1800'
  | 'gestao-loja-parcelas-1500'
  | 'mentoria-novos';

export type ServiceType = 'gestao-loja' | 'mentoria';

export interface MonthlyReport {
  id: string;
  restaurantId: string;
  month: number;
  year: number;
  // Receitas e Vendas
  totalRevenue: number;
  orderCount: number;
  averageTicket: number; // calculado automaticamente
  // Custos Fixos
  rent: number;
  payroll: number;
  accounting: number;
  otherFixedCosts: number;
  // Custos Variáveis
  ingredients: number;
  ifoodFee: number; // 28% automático
  packaging: number;
  gasEnergy: number;
  // Indicadores Operacionais
  workingDays: number;
  cancelledOrders: number;
  topDishes: Array<{
    name: string;
    quantity: number;
  }>;
  // Pontos de Atenção
  missingIngredients: {
    occurred: boolean;
    details: string;
  };
  equipmentFailure: {
    occurred: boolean;
    details: string;
  };
  overtime: {
    occurred: boolean;
    hours: number;
  };
}

export interface ConsultingKPIs {
  totalRevenue: number;
  totalRevenueGrowth: number;
  activeClients: number;
  activeClientsChange: number;
  inactiveClients: number;
  inactiveClientsChange: number;
  clientsOver10kThisWeek: number;
  clientsOver10kThisWeekChange: number;
  recurringPayments: number;
  recurringPaymentsChange: number;
  totalDelinquency: number;
  totalDelinquencyChange: number;
  averageLTV: number;
  averageLTVGrowth: number;
  delinquencyRate: number;
  delinquencyRateChange: number;
  clientRetentionRate: number;
  clientRetentionRateChange: number;
  averageClientLifetime: number;
  averageClientLifetimeChange: number;
  mrr: number;
  mrrGrowth: number;
  gestaoLojaClients: number;
  gestaoLojaClientsChange: number;
  mentoriaClients: number;
  mentoriaClientsChange: number;
  newClientsThisMonth: number;
  newClientsThisMonthChange: number;
  churnRate: number;
  churnRateChange: number;
  revenueExpansionRate: number;
  revenueExpansionRateChange: number;
}

export type FoodCategory = 
  | 'Todos os Setores'
  | 'Fast Food'
  | 'Pizzaria & Italiana'
  | 'Comida Brasileira'
  | 'Asiática'
  | 'Saudável & Açaí'
  | 'Padaria & Café'
  | 'Hambúrgueria Artesanal'
  | 'Doces & Sobremesas';