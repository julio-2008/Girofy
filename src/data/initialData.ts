import { Cliente, PixConfig, ConfiguracaoFixaGirofy } from '../types';

export const CLIENTES_INICIAIS: Cliente[] = [];

export const PIX_CONFIG_INICIAL: PixConfig = {
  chavePix: '67996244200158',
  nomeBeneficiario: 'GIROFY SOLUCOES DIGITAIS',
  cidadeBeneficiario: 'SAO PAULO',
};

export const CONFIG_FIXA_INICIAL: ConfiguracaoFixaGirofy = {
  bonusPadrao: [
    {
      id: 'b1',
      titulo: 'Domínio Corporativo .com.br + SSL Incluso',
      valorEstimado: 250,
      descricao: 'Registro do domínio desejado e configuração de certificado de segurança SSL.',
    },
    {
      id: 'b2',
      titulo: 'Hospedagem em Servidor Cloud (12 meses)',
      valorEstimado: 800,
      descricao: 'Infraestrutura dedicada de alta velocidade, disponibilidade e backup.',
    },
    {
      id: 'b3',
      titulo: 'Treinamento da Equipe + Guia de Uso',
      valorEstimado: 1200,
      descricao: 'Capacitação prática para sua equipe utilizar o sistema com total autonomia.',
    },
    {
      id: 'b4',
      titulo: 'Suporte Técnico Prioritário Pós-Entrega',
      valorEstimado: 1500,
      descricao: 'Atendimento direto para dúvidas operacionais e ajustes pós-lançamento.',
    },
  ],
  seoTecnicoIncluso: [
    'Google Search Console',
    'XML Sitemap',
    'Meta Description Otimizada',
    'Pesquisa de Palavras-chave',
    'llms.txt (Otimização para IAs)',
  ],
  clausulaNaoIncluso:
    'Tráfego pago, produção de conteúdo de terceiros e integrações com ERPs legados não acordados previamente.',
  corDestaque: '#10B981',
};


