import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Client } from '@/types/restaurant';
import { formatClientName, getServiceTypeLabel, formatCurrency, hasAchieved10kThisWeek, calculateDelinquencyRisk, getRiskLevel } from '@/utils/clientUtils';

interface PDFExportData {
  clients: Client[];
  summary: {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    clients10kThisWeek: number;
    totalDelinquency: number;
    averageLTV: number;
  };
  filters: {
    searchTerm: string;
    serviceType: string;
    generatedAt: string;
  };
}

const generateSummary = (clients: Client[]) => {
  const activeClients = clients.filter(c => c.status === 'active').length;
  const inactiveClients = clients.filter(c => c.status === 'inactive').length;
  const clients10kThisWeek = clients.filter(c => hasAchieved10kThisWeek(c)).length;
  const totalDelinquency = clients.reduce((sum, c) => sum + c.delinquencyData.currentDebt, 0);
  const averageLTV = clients.reduce((sum, c) => sum + c.ltvData.totalValueGenerated, 0) / clients.length;

  return {
    totalClients: clients.length,
    activeClients,
    inactiveClients,
    clients10kThisWeek,
    totalDelinquency,
    averageLTV
  };
};

const addHeader = (doc: jsPDF) => {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Clientes', 20, 30);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 45);
  
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);
};

const addSummary = (doc: jsPDF, summary: PDFExportData['summary']) => {
  let y = 70;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Executivo', 20, y);
  y += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const summaryItems = [
    `Total de Clientes: ${summary.totalClients}`,
    `Clientes Ativos: ${summary.activeClients}`,
    `Clientes Inativos: ${summary.inactiveClients}`,
    `Clientes que faturaram +10K esta semana: ${summary.clients10kThisWeek}`,
    `LTV Médio: ${formatCurrency(summary.averageLTV)}`,
    `Total em Inadimplência: ${formatCurrency(summary.totalDelinquency)}`
  ];
  
  summaryItems.forEach(item => {
    doc.text(item, 25, y);
    y += 8;
  });
  
  return y + 10;
};

const addClientsTable = (doc: jsPDF, clients: Client[], startY: number) => {
  let y = startY;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalhamento dos Clientes', 20, y);
  y += 15;
  
  // Table headers
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  const headers = ['Cliente', 'Serviço', 'Status', 'LTV Total', 'Inadimplência', 'Risco'];
  const colWidths = [50, 25, 20, 25, 25, 20];
  let x = 20;
  
  headers.forEach((header, i) => {
    doc.text(header, x, y);
    x += colWidths[i];
  });
  
  y += 8;
  doc.setLineWidth(0.2);
  doc.line(20, y, 185, y);
  y += 5;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  
  clients.forEach(client => {
    if (y > 270) {
      doc.addPage();
      y = 30;
    }
    
    x = 20;
    const rowData = [
      formatClientName(client).substring(0, 25),
      getServiceTypeLabel(client.serviceType).substring(0, 12),
      client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Inadimplente',
      formatCurrency(client.ltvData.totalValueGenerated),
      formatCurrency(client.delinquencyData.currentDebt),
      client.delinquencyData.riskLevel === 'low' ? 'Baixo' : 
      client.delinquencyData.riskLevel === 'medium' ? 'Médio' : 'Alto'
    ];
    
    rowData.forEach((data, i) => {
      doc.text(data.toString(), x, y);
      x += colWidths[i];
    });
    
    y += 8;
  });
  
  return y;
};

const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Página ${i} de ${pageCount}`, 170, 285);
    doc.text('Relatório gerado automaticamente pelo sistema', 20, 285);
  }
};

export const generateClientsPDF = async (
  clients: Client[],
  searchTerm: string = '',
  serviceType: string = 'all'
): Promise<void> => {
  try {
    const doc = new jsPDF();
    
    const summary = generateSummary(clients);
    const exportData: PDFExportData = {
      clients,
      summary,
      filters: {
        searchTerm,
        serviceType,
        generatedAt: new Date().toISOString()
      }
    };
    
    // Add content to PDF
    addHeader(doc);
    const summaryEndY = addSummary(doc, exportData.summary);
    addClientsTable(doc, exportData.clients, summaryEndY);
    addFooter(doc);
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `relatorio-clientes-${date}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Erro ao gerar relatório PDF');
  }
};

// Função para exportar dashboard completo em PDF
export async function generateDashboardPDF(): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Cabeçalho
    pdf.setFontSize(20);
    pdf.setTextColor(233, 69, 96); // iFood red
    pdf.text('Relatório do Dashboard', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 35);
    
    // Linha separadora
    pdf.setDrawColor(233, 69, 96);
    pdf.line(20, 40, pageWidth - 20, 40);
    
    let currentY = 55;
    
    // Seção de Resumo Executivo
    pdf.setFontSize(16);
    pdf.setTextColor(50, 50, 50);
    pdf.text('Resumo Executivo', 20, currentY);
    currentY += 15;
    
    // KPIs principais
    const kpiSummary = [
      'Receita Total Portfolio: R$ 2.847.500',
      'Taxa de Crescimento: +8,5%',
      'Taxa de Retenção: 94%',
      'MRR: R$ 385.200',
      'Taxa de Inadimplência: 3,2%',
      'Clientes +10K na Semana: 12'
    ];
    
    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
    kpiSummary.forEach((kpi) => {
      pdf.text(`• ${kpi}`, 25, currentY);
      currentY += 7;
    });
    
    currentY += 10;
    
    // Capturar gráficos se existirem
    const chartElements = document.querySelectorAll('.recharts-wrapper');
    
    for (let i = 0; i < Math.min(chartElements.length, 3); i++) {
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = 25;
      }
      
      try {
        const canvas = await html2canvas(chartElements[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 20, currentY, imgWidth, Math.min(imgHeight, 80));
        currentY += Math.min(imgHeight, 80) + 15;
      } catch (error) {
        console.error('Erro ao capturar gráfico:', error);
      }
    }
    
    // Alertas de risco
    if (currentY > pageHeight - 80) {
      pdf.addPage();
      currentY = 25;
    }
    
    pdf.setFontSize(16);
    pdf.setTextColor(50, 50, 50);
    pdf.text('Alertas de Risco', 20, currentY);
    currentY += 15;
    
    const riskAlerts = [
      'Padaria do Bairro: Rating baixo (3.8) + crescimento negativo',
      'Sabor Caseiro: Sem contato há 5 dias',
      'Cliente em Potencial: Taxa de conversão abaixo da média'
    ];
    
    pdf.setFontSize(11);
    pdf.setTextColor(200, 50, 50);
    riskAlerts.forEach((alert) => {
      pdf.text(`⚠ ${alert}`, 25, currentY);
      currentY += 7;
    });
    
    // Rodapé
    const fileName = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Erro ao gerar PDF do dashboard:', error);
    throw new Error('Falha ao gerar relatório do dashboard');
  }
}

// Função para gerar o manual de utilização em PDF
export async function generateUserManualPDF(): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = 25;

    // Função auxiliar para adicionar título
    const addTitle = (title: string, fontSize: number = 16) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = 25;
      }
      pdf.setFontSize(fontSize);
      pdf.setTextColor(233, 69, 96);
      pdf.text(title, margin, currentY);
      currentY += fontSize === 20 ? 15 : 12;
    };

    // Função auxiliar para adicionar texto
    const addText = (text: string, fontSize: number = 11) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = 25;
      }
      pdf.setFontSize(fontSize);
      pdf.setTextColor(80, 80, 80);
      
      // Quebra de linha automática
      const lines = pdf.splitTextToSize(text, pageWidth - (margin * 2));
      lines.forEach((line: string) => {
        if (currentY > 270) {
          pdf.addPage();
          currentY = 25;
        }
        pdf.text(line, margin, currentY);
        currentY += 6;
      });
      currentY += 4;
    };

    // Capa
    pdf.setFontSize(24);
    pdf.setTextColor(233, 69, 96);
    pdf.text('MANUAL DE UTILIZAÇÃO', margin, 50);
    
    pdf.setFontSize(18);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Plataforma de Consultoria Gastronômica', margin, 70);
    
    pdf.setFontSize(12);
    pdf.text(`Versão 1.0.0 - ${new Date().toLocaleDateString('pt-BR')}`, margin, 250);
    
    pdf.addPage();
    currentY = 25;

    // Índice
    addTitle('ÍNDICE', 20);
    const indexItems = [
      '1. VISÃO GERAL DA PLATAFORMA',
      '2. ACESSO E NAVEGAÇÃO',
      '3. DASHBOARD PRINCIPAL',
      '4. GESTÃO DE CLIENTES',
      '5. ANÁLISE SETORIAL',
      '6. SISTEMA DE RELATÓRIOS',
      '7. CONFIGURAÇÕES',
      '8. FUNCIONALIDADES AVANÇADAS',
      '9. DICAS DE USO OTIMIZADO',
      '10. SUPORTE E TROUBLESHOOTING'
    ];
    
    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
    indexItems.forEach(item => {
      pdf.text(item, margin + 5, currentY);
      currentY += 8;
    });

    pdf.addPage();
    currentY = 25;

    // Conteúdo do manual
    addTitle('1. VISÃO GERAL DA PLATAFORMA', 18);
    addText('Sistema de consultoria especializada para restaurantes e delivery com dashboard interativo, KPIs em tempo real, gestão completa de clientes e geração automática de relatórios profissionais.');
    
    addTitle('O que é a Plataforma:', 14);
    addText('• Dashboard interativo com KPIs em tempo real\n• Gestão completa de clientes e análise de performance\n• Geração automática de relatórios profissionais\n• Análise setorial e comparativas de mercado');

    addTitle('Para quem foi desenvolvida:', 14);
    addText('• Consultores gastronômicos: Visão completa do portfólio de clientes\n• Restaurantes parceiros: Portal dedicado para acompanhar performance');

    pdf.addPage();
    currentY = 25;

    addTitle('2. ACESSO E NAVEGAÇÃO', 18);
    addTitle('Como fazer login:', 14);
    addText('1. Acesse a plataforma através do link fornecido\n2. Insira suas credenciais (email/senha)\n3. O sistema direcionará automaticamente para sua área');

    addTitle('Menu principal (Consultores):', 14);
    addText('• Portfolio Overview: Dashboard principal com visão geral\n• Setores: Análise por departamentos da empresa\n• Meus Clientes: Gestão completa da carteira\n• Relatórios: Geração e histórico de reports\n• Configurações: Personalização da conta e branding');

    pdf.addPage();
    currentY = 25;

    addTitle('3. DASHBOARD PRINCIPAL', 18);
    addTitle('KPIs Interativos Disponíveis:', 14);
    addText('1. Receita Total Portfolio: Faturamento consolidado\n2. Ticket Médio Portfolio: Valor médio por cliente\n3. Taxa Crescimento Portfolio: Percentual de expansão\n4. Taxa Retenção Clientes: Índice de permanência\n5. Clientes Gestão Loja: Quantidade no programa\n6. Taxa de Inadimplência: Percentual de débitos\n7. MRR: Receita mensal recorrente\n8. Clientes +10K Semana: Meta semanal atingida');

    addTitle('Sistema de Cores (Semáforo):', 14);
    addText('🟢 Verde: Indicadores positivos (crescimento >5%)\n🟡 Amarelo: Performance neutra (-5% a +5%)\n🔴 Vermelho: Indicadores negativos (queda >5%)');

    addTitle('Funcionalidades do Dashboard:', 14);
    addText('• Arrastar e soltar: Reorganize os cards\n• Clique nos KPIs: Ver insights detalhados\n• Configurações: Ocultar/exibir KPIs específicos\n• Export PDF: Gerar relatório completo');

    pdf.addPage();
    currentY = 25;

    addTitle('4. GESTÃO DE CLIENTES', 18);
    addTitle('Como cadastrar novo cliente:', 14);
    addText('1. Clique em "Cadastrar Cliente"\n2. Preencha dados básicos: Nome, localização, tipo\n3. Configure plano de pagamento e parcelas\n4. Defina meta semanal de faturamento\n5. Sistema gera número do cliente automaticamente');

    addTitle('Visualização da carteira:', 14);
    addText('• Cards individuais com foto e dados essenciais\n• Filtros: Por tipo de serviço, localização, status\n• Busca: Por nome do restaurante ou proprietário\n• Status visual: Ativo (verde), Inativo (cinza), Inadimplente (vermelho)');

    pdf.addPage();
    currentY = 25;

    addTitle('5. ANÁLISE SETORIAL', 18);
    addTitle('Setores monitorados:', 14);
    addText('1. Marketing: Leads, conversão, CAC, ROI, impressões\n2. Comercial: Vendas, ticket médio, taxa fechamento, NPS\n3. Financeiro: Faturamento, margem, inadimplência, EBITDA\n4. Onboarding: Tempo integração, taxa sucesso, satisfação\n5. Uso: Usuários ativos, retenção, engajamento, churn\n6. Expansão: Indicações, recompra, revenue expansion');

    pdf.addPage();
    currentY = 25;

    addTitle('6. SISTEMA DE RELATÓRIOS', 18);
    addTitle('Tipos de relatórios disponíveis:', 14);
    addText('1. Relatório de Portfólio: Visão geral de todos os restaurantes\n2. Relatórios Individuais: Performance específica por cliente\n3. Análise Setorial: Benchmark por categoria\n4. Relatório ROI: Valor demonstrado para cada cliente');

    addTitle('Geração de relatórios:', 14);
    addText('• Período personalizável: Mensal, trimestral, personalizado\n• Formatos: PDF, Excel, PowerPoint\n• Conteúdo configurável: Escolher seções a incluir\n• Branding personalizado: Logo e cores da empresa');

    pdf.addPage();
    currentY = 25;

    addTitle('7. CONFIGURAÇÕES E PERSONALIZAÇÃO', 18);
    addTitle('Aba Perfil:', 14);
    addText('Dados pessoais, informações de contato, telefone, cidade, empresa/consultoria e alteração de informações básicas.');

    addTitle('Aba Notificações:', 14);
    addText('• Alertas de performance: Quando cliente apresenta queda\n• Relatórios mensais: Confirmação de reports prontos\n• Novos clientes: Confirmação de cadastros\n• WhatsApp Business: Receber notificações via WhatsApp');

    addTitle('Aba Branding:', 14);
    addText('• Upload do logo da empresa (200x60px, PNG)\n• Nome da empresa e slogan\n• Cores personalizadas para relatórios\n• Personalização visual dos exports');

    pdf.addPage();
    currentY = 25;

    addTitle('8. FUNCIONALIDADES AVANÇADAS', 18);
    addTitle('Sistema de alertas inteligentes:', 14);
    addText('• Detecção automática de clientes em risco\n• Alertas de rating baixo combinado com crescimento negativo\n• Controle de relacionamento: Clientes sem contato há X dias\n• Performance abaixo da média: Identificação automática');

    addTitle('Exportação de dados:', 14);
    addText('• PDF profissional com branding personalizado\n• Export individual ou em lote\n• Dados filtrados conforme critério aplicado\n• Metadados completos para rastreabilidade');

    pdf.addPage();
    currentY = 25;

    addTitle('9. DICAS DE USO OTIMIZADO', 18);
    addTitle('Para maximizar resultados:', 14);
    addText('1. Acesse diariamente para acompanhar indicadores\n2. Configure alertas para não perder oportunidades\n3. Exporte relatórios mensais para clientes\n4. Use filtros para análises específicas\n5. Acompanhe tendências nos gráficos temporais');

    addTitle('Indicadores de atenção:', 14);
    addText('• Taxa inadimplência acima de 5%\n• Clientes sem contato há mais de 5 dias\n• Performance vermelha por mais de 2 semanas consecutivas\n• Queda no MRR por 2 meses seguidos');

    pdf.addPage();
    currentY = 25;

    addTitle('10. SUPORTE E TROUBLESHOOTING', 18);
    addTitle('Problemas comuns:', 14);
    addText('• Login não funciona: Verificar credenciais e conexão\n• Gráficos não carregam: Atualizar página ou limpar cache\n• Export falha: Verificar se há dados para exportar\n• Performance lenta: Verificar conexão com internet');

    addTitle('Recursos de ajuda:', 14);
    addText('• Tooltips explicativos em cada funcionalidade\n• Sistema de onboarding para novos usuários\n• Central de ajuda integrada\n• Suporte via WhatsApp Business');

    // Rodapé em todas as páginas
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Página ${i} de ${pageCount}`, pageWidth - 40, 285);
      if (i > 1) {
        pdf.text('Manual de Utilização - Plataforma de Consultoria Gastronômica', margin, 285);
      }
    }

    // Salvar o PDF
    const fileName = `manual-utilizacao-plataforma-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Erro ao gerar PDF do manual:', error);
    throw new Error('Falha ao gerar manual de utilização');
  }
}