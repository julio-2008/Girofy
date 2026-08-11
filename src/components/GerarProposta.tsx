import React, { useState } from 'react';
import {
  FileText,
  Share2,
  Copy,
  Check,
  MessageCircle,
  CheckCircle2,
  Settings,
  Globe,
  AlertCircle,
  ListChecks,
  Lock
} from 'lucide-react';
import { Cliente, PropostaVisualData, ConfiguracaoFixaGirofy } from '../types';

interface GerarPropostaProps {
  clientes: Cliente[];
  configFixa: ConfiguracaoFixaGirofy;
  onOpenConfigFixaModal: () => void;
  onVisualizarProposta?: (propostaData: PropostaVisualData) => void;
}

export const GerarProposta: React.FC<GerarPropostaProps> = ({
  clientes,
  configFixa,
  onOpenConfigFixaModal,
  onVisualizarProposta,
}) => {
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string>('');

  // Formulário estritamente POR CLIENTE (Campos variáveis)
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [contatoWhatsapp, setContatoWhatsapp] = useState('');
  const [dominioDesejado, setDominioDesejado] = useState('lufestas.com.br');
  const [dorDoCliente, setDorDoCliente] = useState(
    'Perdemos muito tempo anotando pedidos no papel e cobrando clientes um por um no WhatsApp'
  );
  const [escopoEspecifico, setEscopoEspecifico] = useState(
    'Sistema web sob medida com catálogo digital de produtos, carrinho de pedidos automatizado, painel administrativo de gestão de vendas e emissão de recibos fiscais.'
  );

  const [valorProjeto, setValorProjeto] = useState<number>(12000);
  const [porcentagemEntrada, setPorcentagemEntrada] = useState<number>(50);
  const [valorMensalidade, setValorMensalidade] = useState<number>(490);
  const [diasEntrega, setDiasEntrega] = useState('10 a 15 dias');

  const [copiado, setCopiado] = useState(false);
  const [linkGerado, setLinkGerado] = useState('');

  // Carregar dados de cliente cadastrado
  const handleSelectCliente = (id: string) => {
    setClienteSelecionadoId(id);
    const cli = clientes.find((c) => c.id === id);
    if (cli) {
      setNomeEmpresa(cli.empresa);
      setContatoWhatsapp(cli.whatsapp);
      setValorProjeto(cli.valorProjeto);
      setValorMensalidade(cli.valorManutencao);
    }
  };

  const montarDadosProposta = (): PropostaVisualData => {
    return {
      id: `prop-${Date.now()}`,
      nomeClienteEmpresa: nomeEmpresa || 'Cliente Especial',
      contatoWhatsapp: contatoWhatsapp || '11999998888',
      dominioDesejado: dominioDesejado || 'seusite.com.br',
      dorDoCliente: dorDoCliente.trim(),
      escopoEspecifico: escopoEspecifico.trim(),
      valorProjeto: Number(valorProjeto) || 0,
      porcentagemEntrada: Number(porcentagemEntrada) || 50,
      valorMensalidade: Number(valorMensalidade) || 0,
      diasEntrega: diasEntrega || '10 a 15 dias',
      // Copiar itens fixos das configurações
      bonusInclusos: configFixa.bonusPadrao,
      seoTecnicoIncluso: configFixa.seoTecnicoIncluso,
      clausulaNaoIncluso: configFixa.clausulaNaoIncluso,
      corDestaque: configFixa.corDestaque || '#10B981',
    };
  };

  const handleGerarLink = (e: React.FormEvent) => {
    e.preventDefault();
    const propData = montarDadosProposta();
    const jsonStr = JSON.stringify(propData);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const url = `${window.location.origin}${window.location.pathname}#proposta=${encoded}`;
    setLinkGerado(url);

    if (onVisualizarProposta) {
      onVisualizarProposta(propData);
    }
  };

  const handleCopiarLink = () => {
    if (!linkGerado) return;
    navigator.clipboard.writeText(linkGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const formatarMoeda = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 text-xs max-w-3xl mx-auto px-2 sm:px-0 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-none p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E2E8F0]" />
            Nova Proposta Comercial Por Cliente
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Preencha apenas os dados específicos deste cliente para gerar a proposta imediata.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {clientes.length > 0 && (
            <select
              value={clienteSelecionadoId}
              onChange={(e) => handleSelectCliente(e.target.value)}
              className="bg-black border border-zinc-800 rounded-none px-3 py-2 text-white text-xs focus:outline-none w-full sm:w-auto"
            >
              <option value="">Carregar de cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.empresa} ({formatarMoeda(c.valorProjeto)})
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={onOpenConfigFixaModal}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-none text-zinc-300 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Editar Bônus, SEO e Cláusulas Padrão"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Configurações Padrão</span>
          </button>
        </div>
      </div>

      {/* Formulário com Apenas 2 Seções */}
      <form onSubmit={handleGerarLink} className="space-y-6">
        {/* SEÇÃO 1: Dados do Cliente e Valores */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-none p-4 sm:p-6 space-y-4">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              1. Dados do Cliente &amp; Condições Financeiras
            </h3>
            <span className="text-[10px] text-[#E2E8F0] font-mono">
              Campos por Cliente
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Empresa do Cliente *</label>
              <input
                type="text"
                required
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                placeholder="Ex: Lu Festas & Eventos"
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">WhatsApp do Cliente *</label>
              <input
                type="text"
                required
                value={contatoWhatsapp}
                onChange={(e) => setContatoWhatsapp(e.target.value)}
                placeholder="11999998888"
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Valor Total do Projeto (R$) *</label>
              <input
                type="number"
                required
                value={valorProjeto}
                onChange={(e) => setValorProjeto(Number(e.target.value))}
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none px-3 py-2.5 text-white font-bold text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">% Entrada (Sinal Pix)</label>
              <select
                value={porcentagemEntrada}
                onChange={(e) => setPorcentagemEntrada(Number(e.target.value))}
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none px-3 py-2.5 text-white focus:outline-none"
              >
                <option value={50}>50% ({formatarMoeda((valorProjeto * 50) / 100)})</option>
                <option value={30}>30% ({formatarMoeda((valorProjeto * 30) / 100)})</option>
                <option value={100}>100% à vista ({formatarMoeda(valorProjeto)})</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Mensalidade Pós-Entrega (R$/mês)</label>
              <input
                type="number"
                value={valorMensalidade}
                onChange={(e) => setValorMensalidade(Number(e.target.value))}
                placeholder="490"
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none px-3 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Prazo de Entrega Estimado</label>
              <input
                type="text"
                value={diasEntrega}
                onChange={(e) => setDiasEntrega(e.target.value)}
                placeholder="10 a 15 dias"
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none px-3 py-2.5 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Dor do Cliente, Domínio Desejado & Escopo Específico */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-none p-4 sm:p-6 space-y-4">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              2. Dor do Cliente, Domínio &amp; Escopo Específico
            </h3>
            <span className="text-[10px] text-[#E2E8F0] font-mono">
              Conteúdo Personalizado
            </span>
          </div>

          <div className="space-y-4">
            {/* A Dor Deles */}
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#E2E8F0]" />
                <span>A Dor Deles (Frase literal que o cliente usou na conversa) *</span>
              </label>
              <textarea
                rows={2}
                required
                value={dorDoCliente}
                onChange={(e) => setDorDoCliente(e.target.value)}
                placeholder="Cole aqui a frase exata do cliente, ex: Perdemos muito tempo anotando pedidos no papel..."
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none p-3 text-zinc-200 focus:outline-none text-xs leading-relaxed"
              />
            </div>

            {/* Domínio Desejado */}
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#E2E8F0]" />
                <span>Domínio Desejado (com preview de navegador) *</span>
              </label>
              <input
                type="text"
                required
                value={dominioDesejado}
                onChange={(e) => setDominioDesejado(e.target.value.toLowerCase().replace(/https?:\/\//, '').replace(/\s+/g, ''))}
                placeholder="ex: lufestas.com.br"
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none px-3 py-2.5 text-white font-mono text-xs focus:outline-none"
              />

              {/* Live Preview da Barra do Navegador */}
              {dominioDesejado && (
                <div className="mt-2.5 bg-black border border-zinc-800 rounded-none p-2.5 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 shrink-0 px-1">
                    <div className="w-2.5 h-2.5 bg-zinc-700"></div>
                    <div className="w-2.5 h-2.5 bg-zinc-700"></div>
                    <div className="w-2.5 h-2.5 bg-zinc-700"></div>
                  </div>
                  <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-none px-3 py-1.5 flex items-center gap-2 overflow-hidden">
                    <Lock className="w-3 h-3 text-[#E2E8F0] shrink-0" />
                    <span className="text-[11px] font-mono text-zinc-400 select-none">https://</span>
                    <span className="text-[11px] font-mono text-white font-bold truncate">
                      {dominioDesejado}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#E2E8F0] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-[#E2E8F0]/10 border border-[#E2E8F0]/20 shrink-0">
                    Ativo
                  </span>
                </div>
              )}
            </div>

            {/* Escopo Específico do Projeto */}
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-[#E2E8F0]" />
                <span>Escopo Específico do Projeto (Módulos entregues pra esta empresa) *</span>
              </label>
              <textarea
                rows={4}
                required
                value={escopoEspecifico}
                onChange={(e) => setEscopoEspecifico(e.target.value)}
                placeholder="Descreva o escopo real e módulos entregues de forma clara para o cliente..."
                className="w-full bg-black border border-zinc-800 focus:border-[#E2E8F0] rounded-none p-3 text-zinc-200 focus:outline-none text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Resumo de Configurações Fixas Ativas */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-none p-3.5 flex items-center justify-between gap-3 text-[11px] text-zinc-400">
          <div>
            <strong className="text-white block font-semibold">Configurações Fixas Padrão Ativas:</strong>
            <span>{configFixa.bonusPadrao.length} Bônus Padrão • SEO Técnico • Cláusula Não Incluso</span>
          </div>
          <button
            type="button"
            onClick={onOpenConfigFixaModal}
            className="text-[#E2E8F0] hover:text-white hover:underline font-semibold cursor-pointer shrink-0"
          >
            Editar Fixos
          </button>
        </div>

        {/* Botão Submeter */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-none bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Share2 className="w-4 h-4" />
            <span>Gerar Link da Proposta</span>
          </button>
        </div>

        {/* Resultado Link Gerado */}
        {linkGerado && (
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-[#E2E8F0] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Link da Proposta Gerado com Sucesso!</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCopiarLink}
                className="flex-1 py-3 rounded-none bg-black hover:bg-zinc-900 border border-zinc-800 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                {copiado ? <Check className="w-4 h-4 text-[#E2E8F0]" /> : <Copy className="w-4 h-4" />}
                <span>{copiado ? 'Copiado!' : 'Copiar Link'}</span>
              </button>

              <a
                href={`https://wa.me/55${contatoWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Olá! Analisei nossa conversa e preparei a proposta exclusiva para vocês:\n\n${linkGerado}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-none bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Enviar no WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
