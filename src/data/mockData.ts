import { Client, ConsultingKPIs, MonthlyReport } from '@/types/restaurant';

export const mockClients: Client[] = [
  {
    id: "1",
    clientNumber: 1,
    firstName: "João",
    lastName: "Silva",
    serviceType: "gestao-loja",
    paymentPlan: {
      category: "gestao-loja-parcelas-2000",
      totalValue: 2000,
      installments: [
        { id: "1", amount: 500, dueDate: "2024-01-15", paidDate: "2024-01-15", status: "paid" },
        { id: "2", amount: 500, dueDate: "2024-02-15", paidDate: "2024-02-15", status: "paid" },
        { id: "3", amount: 500, dueDate: "2024-03-15", status: "pending" },
        { id: "4", amount: 500, dueDate: "2024-04-15", status: "pending" }
      ]
    },
    status: "active",
    isActive: true,
    registrationDate: "2024-01-01",
    lastContact: "2024-01-15",
    weeklyRevenue: [
      { weekStart: "2024-01-17", weekEnd: "2024-01-23", revenue: 12000, achieved10k: true },
      { weekStart: "2024-01-24", weekEnd: "2024-01-30", revenue: 8500, achieved10k: false }
    ],
    ltvData: {
      totalValueGenerated: 45000,
      totalValuePaid: 1000,
      activeTime: 25,
      revenueExpansionRate: 15.2,
      averageMonthlyValue: 1800
    },
    delinquencyData: {
      currentDebt: 1000,
      delinquencyRate: 5.2,
      riskScore: 25,
      riskLevel: "low",
      lastPaymentDate: "2024-02-15",
      daysOverdue: 0
    },
    state: "São Paulo",
    city: "São Paulo",
    region: "Sudeste"
  },
  {
    id: "2",
    clientNumber: 2,
    firstName: "Maria",
    lastName: "Santos",
    serviceType: "mentoria",
    paymentPlan: {
      category: "mentoria-novos",
      totalValue: 1500,
      installments: [
        { id: "5", amount: 1500, dueDate: "2024-02-01", paidDate: "2024-02-01", status: "paid" }
      ]
    },
    status: "active",
    isActive: true,
    registrationDate: "2024-02-01",
    lastContact: "2024-02-20",
    weeklyRevenue: [
      { weekStart: "2024-02-21", weekEnd: "2024-02-27", revenue: 15000, achieved10k: true }
    ],
    ltvData: {
      totalValueGenerated: 28000,
      totalValuePaid: 1500,
      activeTime: 20,
      revenueExpansionRate: 8.5,
      averageMonthlyValue: 1400
    },
    delinquencyData: {
      currentDebt: 0,
      delinquencyRate: 0,
      riskScore: 10,
      riskLevel: "low",
      lastPaymentDate: "2024-02-01",
      daysOverdue: 0
    },
    state: "Rio de Janeiro",
    city: "Rio de Janeiro",
    region: "Sudeste"
  },
  {
    id: "3",
    clientNumber: 5,
    firstName: "Carlos",
    lastName: "Oliveira",
    serviceType: "gestao-loja",
    paymentPlan: {
      category: "gestao-loja-parcelas-1750",
      totalValue: 1750,
      installments: [
        { id: "6", amount: 437.50, dueDate: "2024-01-10", paidDate: "2024-01-10", status: "paid" },
        { id: "7", amount: 437.50, dueDate: "2024-02-10", status: "overdue" },
        { id: "8", amount: 437.50, dueDate: "2024-03-10", status: "pending" },
        { id: "9", amount: 437.50, dueDate: "2024-04-10", status: "pending" }
      ]
    },
    status: "delinquent",
    isActive: true,
    registrationDate: "2024-01-01",
    lastContact: "2024-02-20",
    weeklyRevenue: [
      { weekStart: "2024-02-21", weekEnd: "2024-02-27", revenue: 8500, achieved10k: false }
    ],
    ltvData: {
      totalValueGenerated: 18000,
      totalValuePaid: 437.50,
      activeTime: 58,
      revenueExpansionRate: -2.1,
      averageMonthlyValue: 900
    },
    delinquencyData: {
      currentDebt: 1312.50,
      delinquencyRate: 75,
      riskScore: 85,
      riskLevel: "high",
      lastPaymentDate: "2024-01-10",
      daysOverdue: 45
    },
    state: "Minas Gerais",
    city: "Belo Horizonte",
    region: "Sudeste"
  },
  {
    id: "4",
    clientNumber: 10,
    firstName: "Ana",
    lastName: "Costa",
    serviceType: "mentoria",
    paymentPlan: {
      category: "mentoria-novos",
      totalValue: 2500,
      installments: [
        { id: "10", amount: 2500, dueDate: "2024-01-15", paidDate: "2024-01-15", status: "paid" }
      ]
    },
    status: "inactive",
    isActive: false,
    registrationDate: "2024-01-15",
    deactivationDate: "2024-02-28",
    lastContact: "2024-02-28",
    weeklyRevenue: [],
    ltvData: {
      totalValueGenerated: 45000,
      totalValuePaid: 2500,
      activeTime: 44,
      revenueExpansionRate: 18.5,
      averageMonthlyValue: 1000
    },
    delinquencyData: {
      currentDebt: 0,
      delinquencyRate: 0,
      riskScore: 15,
      riskLevel: "low",
      lastPaymentDate: "2024-01-15",
      daysOverdue: 0
    },
    state: "São Paulo",
    city: "Campinas",
    region: "Sudeste"
  }
];

export const mockMonthlyReports: MonthlyReport[] = [
  {
    id: '1',
    restaurantId: '1',
    month: 12,
    year: 2024,
    totalRevenue: 32000,
    orderCount: 1247,
    averageTicket: 28.50,
    rent: 2500,
    payroll: 26000,
    accounting: 500,
    otherFixedCosts: 1200,
    ingredients: 12000,
    ifoodFee: 8960,
    packaging: 2400,
    gasEnergy: 1500,
    workingDays: 30,
    cancelledOrders: 24,
    topDishes: [
      { name: 'Burger Clássico', quantity: 180 },
      { name: 'Batata Frita', quantity: 150 },
      { name: 'Milkshake', quantity: 120 }
    ],
    missingIngredients: { occurred: false, details: '' },
    equipmentFailure: { occurred: true, details: 'Chapinha quebrou por 2 dias' },
    overtime: { occurred: true, hours: 15 }
  }
];

export const consultingKPIs: ConsultingKPIs = {
  totalRevenue: 450000,
  totalRevenueGrowth: 15.2,
  activeClients: 24,
  activeClientsChange: 3,
  inactiveClients: 5,
  inactiveClientsChange: 1,
  clientsOver10kThisWeek: 12,
  clientsOver10kThisWeekChange: 4,
  recurringPayments: 18,
  recurringPaymentsChange: 2,
  totalDelinquency: 15000,
  totalDelinquencyChange: -2000,
  averageLTV: 2850,
  averageLTVGrowth: 15.7,
  delinquencyRate: 8.5,
  delinquencyRateChange: -1.2,
  clientRetentionRate: 87.5,
  clientRetentionRateChange: -2.3,
  averageClientLifetime: 145,
  averageClientLifetimeChange: 12,
  mrr: 125000,
  mrrGrowth: 22.5,
  gestaoLojaClients: 18,
  gestaoLojaClientsChange: 2,
  mentoriaClients: 6,
  mentoriaClientsChange: 1,
  newClientsThisMonth: 5,
  newClientsThisMonthChange: 2,
  churnRate: 4.2,
  churnRateChange: -0.8,
  revenueExpansionRate: 12.5,
  revenueExpansionRateChange: 3.2
};

export const monthlyRevenueData = [
  { month: 'Jan', revenue: 380000 },
  { month: 'Fev', revenue: 390000 },
  { month: 'Mar', revenue: 405000 },
  { month: 'Abr', revenue: 420000 },
  { month: 'Mai', revenue: 435000 },
  { month: 'Jun', revenue: 450000 }
];

export const sectorPerformanceData = [
  { sector: 'Fast Food', revenue: 120000, growth: 18 },
  { sector: 'Hambúrgueria', revenue: 95000, growth: 12 },
  { sector: 'Pizzaria', revenue: 85000, growth: 8 },
  { sector: 'Asiática', revenue: 75000, growth: 22 },
  { sector: 'Brasileira', revenue: 45000, growth: -2 },
  { sector: 'Saudável', revenue: 30000, growth: 25 }
];