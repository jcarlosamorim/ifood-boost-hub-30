import { Client, PaymentCategory } from '@/types/restaurant';

export const getNextAvailableClientNumber = (clients: Client[]): number => {
  const usedNumbers = clients.map(client => client.clientNumber).sort((a, b) => a - b);
  
  for (let i = 1; i <= usedNumbers.length + 1; i++) {
    if (!usedNumbers.includes(i)) {
      return i;
    }
  }
  
  return 1;
};

export const formatClientName = (client: Client): string => {
  return `Cliente nº ${client.clientNumber} - ${client.firstName} ${client.lastName} - ${getServiceTypeLabel(client.serviceType)}`;
};

export const getServiceTypeLabel = (serviceType: string): string => {
  switch (serviceType) {
    case 'gestao-loja':
      return 'Gestão de Loja';
    case 'mentoria':
      return 'Mentoria';
    default:
      return serviceType;
  }
};

export const getPaymentCategoryLabel = (category: PaymentCategory): string => {
  switch (category) {
    case 'gestao-loja-novos':
      return 'Gestão de Loja - Novos Clientes';
    case 'gestao-loja-parcelas-2000':
      return 'Gestão de Loja - Pagamento de parcelas iniciais (total R$ 2.000,00)';
    case 'gestao-loja-parcelas-1750':
      return 'Gestão de Loja - Pagamento de parcelas iniciais (total R$ 1.750,00)';
    case 'gestao-loja-parcelas-1800':
      return 'Gestão de Loja - Pagamento de parcelas iniciais (total R$ 1.800,00)';
    case 'gestao-loja-parcelas-1500':
      return 'Gestão de Loja - Pagamento de parcelas iniciais (total R$ 1.500,00)';
    case 'mentoria-novos':
      return 'Mentoria - Novos Clientes';
    default:
      return category;
  }
};

export const getWeekStartDate = (date: Date = new Date()): Date => {
  const today = new Date(date);
  const dayOfWeek = today.getDay();
  const daysToWednesday = dayOfWeek >= 3 ? 3 - dayOfWeek : 3 - dayOfWeek - 7;
  
  const wednesday = new Date(today);
  wednesday.setDate(today.getDate() + daysToWednesday);
  wednesday.setHours(0, 0, 0, 0);
  
  return wednesday;
};

export const getCurrentWeekRevenue = (client: Client): number => {
  const weekStart = getWeekStartDate();
  const currentWeek = client.weeklyRevenue.find(week => 
    new Date(week.weekStart).getTime() === weekStart.getTime()
  );
  
  return currentWeek?.revenue || 0;
};

export const hasAchieved10kThisWeek = (client: Client): boolean => {
  return getCurrentWeekRevenue(client) >= 10000;
};

export const calculateDelinquencyRisk = (client: Client): number => {
  const { delinquencyData, ltvData } = client;
  
  let riskScore = 0;
  
  // Base risk from current delinquency rate
  riskScore += delinquencyData.delinquencyRate * 0.4;
  
  // Days overdue factor
  if (delinquencyData.daysOverdue > 0) {
    riskScore += Math.min(delinquencyData.daysOverdue * 2, 30);
  }
  
  // LTV factor (lower LTV = higher risk)
  if (ltvData.totalValuePaid < 5000) {
    riskScore += 20;
  }
  
  // Time since last payment
  if (delinquencyData.lastPaymentDate) {
    const daysSincePayment = Math.floor(
      (Date.now() - new Date(delinquencyData.lastPaymentDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    riskScore += Math.min(daysSincePayment * 0.5, 15);
  }
  
  return Math.min(Math.round(riskScore), 100);
};

export const getRiskLevel = (riskScore: number): 'low' | 'medium' | 'high' => {
  if (riskScore <= 30) return 'low';
  if (riskScore <= 70) return 'medium';
  return 'high';
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};