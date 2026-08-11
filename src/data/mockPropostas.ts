import { PropostaVisualData } from '../types';

export const PROPOSTAS_PRESETS: Record<string, PropostaVisualData> = {
  software_automacao: {
    id: 'prop-b2b-software-1',
    nomeProjeto: 'Sistema de Gestão & Automação de Processos B2B',
    nomeClienteEmpresa: 'Logística & Serviços Express',
    contatoWhatsapp: '11998877665',
    dominioDesejado: 'logisticaexpress.com.br',
    dorDoCliente: 'Perdemos mais de 15 horas semanais no preenchimento manual de planilhas e emissão de notas fiscais no papel',
    escopoEspecifico: 'Plataforma web customizada com integração Asaas para emissão automática de nota fiscal (NFS-e), painel de métricas financeiras e infraestrutura em nuvem dedicada.',
    valorProjeto: 15000,
    porcentagemEntrada: 50,
    valorMensalidade: 490,
    diasEntrega: '10 a 15 dias',
    bonusInclusos: [
      {
        id: 'b1',
        titulo: 'Domínio Corporativo .com.br + SSL Incluso',
        valorEstimado: 250,
        descricao: 'Registro do domínio desejado e configuração de certificado de segurança SSL.'
      },
      {
        id: 'b2',
        titulo: 'Hospedagem em Servidor Cloud (12 meses)',
        valorEstimado: 800,
        descricao: 'Infraestrutura dedicada de alta velocidade, disponibilidade e backup.'
      },
      {
        id: 'b3',
        titulo: 'Treinamento da Equipe + Guia de Uso',
        valorEstimado: 1200,
        descricao: 'Capacitação prática para sua equipe utilizar o sistema com total autonomia.'
      },
      {
        id: 'b4',
        titulo: 'Suporte Técnico Prioritário Pós-Entrega',
        valorEstimado: 1500,
        descricao: 'Atendimento direto para dúvidas operacionais e ajustes pós-lançamento.'
      }
    ],
    seoTecnicoIncluso: [
      'Google Search Console',
      'XML Sitemap',
      'Meta Description Otimizada',
      'Pesquisa de Palavras-chave',
      'llms.txt (Otimização para IAs)'
    ],
    clausulaNaoIncluso: 'Tráfego pago, produção de conteúdo de terceiros e integrações com ERPs legados não acordados previamente.',
    corDestaque: '#10B981'
  },

  automacao_fiscal: {
    id: 'prop-b2b-automacao-2',
    nomeProjeto: 'Sistema Integrado de Faturamento & Asaas Pix',
    nomeClienteEmpresa: 'TechConsult Serviços',
    contatoWhatsapp: '11987654321',
    dominioDesejado: 'techconsult.com.br',
    dorDoCliente: 'Nossa equipe perde tempo cobrando clientes um a um pelo WhatsApp e enviando recibos manualmente',
    escopoEspecifico: 'Fluxo Pix automático via Asaas com baixa imediata no sistema, emissão automática de Nota Fiscal (NFS-e) e gestão de recorrência mensal.',
    valorProjeto: 12000,
    porcentagemEntrada: 50,
    valorMensalidade: 350,
    diasEntrega: '7 a 10 dias',
    bonusInclusos: [
      {
        id: 'b1',
        titulo: 'Domínio Corporativo .com.br + SSL Incluso',
        valorEstimado: 250,
        descricao: 'Registro do domínio desejado e configuração de certificado de segurança SSL.'
      },
      {
        id: 'b2',
        titulo: 'Hospedagem em Servidor Cloud (12 meses)',
        valorEstimado: 800,
        descricao: 'Infraestrutura dedicada de alta velocidade, disponibilidade e backup.'
      },
      {
        id: 'b3',
        titulo: 'Treinamento da Equipe + Guia de Uso',
        valorEstimado: 1200,
        descricao: 'Capacitação prática para sua equipe utilizar o sistema com total autonomia.'
      },
      {
        id: 'b4',
        titulo: 'Suporte Técnico Prioritário Pós-Entrega',
        valorEstimado: 1500,
        descricao: 'Atendimento direto para dúvidas operacionais e ajustes pós-lançamento.'
      }
    ],
    seoTecnicoIncluso: [
      'Google Search Console',
      'XML Sitemap',
      'Meta Description Otimizada',
      'Pesquisa de Palavras-chave',
      'llms.txt (Otimização para IAs)'
    ],
    clausulaNaoIncluso: 'Tráfego pago, produção de conteúdo de terceiros e integrações com ERPs legados não acordados previamente.',
    corDestaque: '#10B981'
  }
};
