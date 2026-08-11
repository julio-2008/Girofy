export type StatusCliente = 
  | 'proposta_enviada'
  | 'aguardando_pagamento'
  | 'pago_em_producao'
  | 'entregue';

export interface Cliente {
  id: string;
  empresa: string;
  contato: string;
  whatsapp: string;
  valorProjeto: number;
  valorManutencao: number;
  dataProposta: string; // YYYY-MM-DD
  status: StatusCliente;
  dataPagamento?: string; // ISO String or YYYY-MM-DD
  dataEntrega?: string; // ISO String or YYYY-MM-DD
  anotacoes: string;
  criadoEm: string; // ISO string
  atualizadoEm: string; // ISO string
}

export type AbaNavegacao = 'clientes' | 'detalhe' | 'visao_geral' | 'gerar_proposta' | 'proposta_visual';

export type TipoPropostaB2B = 'software' | 'automacao' | 'app_web' | 'consultoria_tech' | 'outro';

export interface BeneficioEntregavel {
  id: string;
  titulo: string;
  descricao: string;
  icone: string; // Lucide icon name
}

export interface ImagemDemonstrativa {
  id: string;
  url: string;
  legenda: string;
}

export interface ItemBonusFixo {
  id: string;
  titulo: string;
  valorEstimado: number;
  descricao: string;
}

export interface ConfiguracaoFixaGirofy {
  bonusPadrao: ItemBonusFixo[];
  seoTecnicoIncluso: string[];
  clausulaNaoIncluso: string;
  corDestaque: string;
}

export interface PropostaVisualData {
  id: string;
  nomeProjeto?: string;
  nomeClienteEmpresa: string;
  contatoWhatsapp: string;
  dominioDesejado: string; // Ex: "lufestas.com.br"
  dorDoCliente: string; // Frase literal que o cliente usou na conversa
  escopoEspecifico: string; // Descrevendo os módulos reais entregues para ESSA empresa
  valorProjeto: number;
  porcentagemEntrada: number; // e.g. 50 (%)
  valorMensalidade: number; // MRR
  diasEntrega: string; // e.g. "10 a 15 dias"
  // Atributos fixos copiados ou aplicados da configuração
  bonusInclusos: ItemBonusFixo[];
  seoTecnicoIncluso: string[];
  clausulaNaoIncluso: string;
  corDestaque: string;
}

export interface AsaasConfig {
  apiKey: string;
  ambiente: 'sandbox' | 'producao';
  emissaoNotaFiscalAuto: boolean;
  razaoSocialEmitente: string;
  cnpjEmitente: string;
  emailNotificacao?: string;
}

export interface PixConfig {
  chavePix: string;
  nomeBeneficiario: string;
  cidadeBeneficiario: string;
}

export interface BackupData {
  versao: string;
  dataExportacao: string;
  clientes: Cliente[];
  pixConfig: PixConfig;
  asaasConfig?: AsaasConfig;
}

