import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  DollarSign, 
  QrCode, 
  Trash2, 
  Save, 
  Building, 
  User, 
  Phone, 
  Calendar, 
  FileText,
  Clock,
  Send,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Cliente, StatusCliente, PixConfig } from '../types';
import { formatarMoeda, formatarDataBR, gerarLinkWhatsApp } from '../utils/formatters';

interface ClienteDetalheProps {
  cliente: Cliente;
  onVoltar: () => void;
  onUpdateCliente: (clienteAtualizado: Cliente) => void;
  onDeleteCliente: (id: string) => void;
  onAbrirPixModal: (valor: number, empresa: string) => void;
  pixConfig: PixConfig;
}

export const ClienteDetalhe: React.FC<ClienteDetalheProps> = ({
  cliente,
  onVoltar,
  onUpdateCliente,
  onDeleteCliente,
  onAbrirPixModal,
}) => {
  const [empresa, setEmpresa] = useState(cliente.empresa);
  const [contato, setContato] = useState(cliente.contato);
  const [whatsapp, setWhatsapp] = useState(cliente.whatsapp);
  const [valorProjeto, setValorProjeto] = useState(cliente.valorProjeto.toString());
  const [valorManutencao, setValorManutencao] = useState(cliente.valorManutencao.toString());
  const [dataProposta, setDataProposta] = useState(cliente.dataProposta);
  const [status, setStatus] = useState<StatusCliente>(cliente.status);
  const [anotacoes, setAnotacoes] = useState(cliente.anotacoes || '');
  const [salvoComSucesso, setSalvoComSucesso] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  useEffect(() => {
    setEmpresa(cliente.empresa);
    setContato(cliente.contato);
    setWhatsapp(cliente.whatsapp);
    setValorProjeto(cliente.valorProjeto.toString());
    setValorManutencao(cliente.valorManutencao.toString());
    setDataProposta(cliente.dataProposta);
    setStatus(cliente.status);
    setAnotacoes(cliente.anotacoes || '');
  }, [cliente]);

  const handleSalvarEdicoes = (statusCustomizado?: StatusCliente) => {
    const novoStatus = statusCustomizado || status;
    const hojeYMD = new Date().toISOString().split('T')[0];

    const clienteAtualizado: Cliente = {
      ...cliente,
      empresa: empresa.trim(),
      contato: contato.trim(),
      whatsapp: whatsapp.trim(),
      valorProjeto: parseFloat(valorProjeto) || 0,
      valorManutencao: parseFloat(valorManutencao) || 0,
      dataProposta: dataProposta,
      status: novoStatus,
      anotacoes: anotacoes,
      dataPagamento: novoStatus === 'pago_em_producao' ? (cliente.dataPagamento || hojeYMD) : cliente.dataPagamento,
      dataEntrega: novoStatus === 'entregue' ? (cliente.dataEntrega || hojeYMD) : cliente.dataEntrega,
      atualizadoEm: new Date().toISOString(),
    };

    onUpdateCliente(clienteAtualizado);
    setSalvoComSucesso(true);
    setTimeout(() => setSalvoComSucesso(false), 2500);
  };

  const handleConfirmarPagamento = () => {
    setStatus('pago_em_producao');
    handleSalvarEdicoes('pago_em_producao');
  };

  const handleMarcarComoEntregue = () => {
    setStatus('entregue');
    handleSalvarEdicoes('entregue');
  };

  const linkWhatsapp = gerarLinkWhatsApp(
    whatsapp,
    `Olá ${contato}, tudo bem? Estou entrando em contato referente à proposta do projeto digital para a ${empresa}.`
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Voltar & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27272A] pb-4">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-[#E2E8F0] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Lista
        </button>

        <div className="flex items-center gap-2">
          {confirmandoExclusao ? (
            <div className="flex items-center gap-2 bg-[#2B1B18] p-1 px-2 rounded border border-red-900/50">
              <span className="text-xs text-red-300">Excluir cliente?</span>
              <button
                onClick={() => onDeleteCliente(cliente.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded font-semibold cursor-pointer"
              >
                Sim
              </button>
              <button
                onClick={() => setConfirmandoExclusao(false)}
                className="text-xs text-[#A1A1AA] hover:text-white px-1 cursor-pointer"
              >
                Não
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmandoExclusao(true)}
              className="text-xs text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir
            </button>
          )}

          <button
            onClick={() => handleSalvarEdicoes()}
            className="bg-[#E2E8F0] hover:bg-white text-black font-bold px-4 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            {salvoComSucesso ? (
              <>
                <Check className="w-4 h-4" />
                Salvo!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Banner do Cliente */}
      <div className="bg-[#131110] border border-[#27272A] rounded p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#E2E8F0] font-bold tracking-wider uppercase block mb-1">
            Detalhamento de Cliente
          </span>
          <h1 className="text-2xl font-bold text-white">{empresa || 'Sem nome'}</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5 flex items-center gap-2">
            <span>Contato: <strong className="text-white">{contato}</strong></span>
            {whatsapp && (
              <>
                <span>•</span>
                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E2E8F0] hover:underline flex items-center gap-1 text-xs"
                >
                  <Send className="w-3 h-3" />
                  Abrir WhatsApp
                </a>
              </>
            )}
          </p>
        </div>

        {/* Status selector rápido */}
        <div className="bg-[#09090B] border border-[#27272A] p-3 rounded shrink-0">
          <label className="block text-[10px] uppercase text-[#A1A1AA] mb-1">Status Atual</label>
          <select
            value={status}
            onChange={(e) => {
              const newSt = e.target.value as StatusCliente;
              setStatus(newSt);
              handleSalvarEdicoes(newSt);
            }}
            className="bg-[#131110] border border-[#3F3F46] text-xs font-semibold text-white rounded px-3 py-1.5 focus:border-[#E2E8F0] focus:outline-none"
          >
            <option value="proposta_enviada">Proposta enviada</option>
            <option value="aguardando_pagamento">Aguardando pagamento</option>
            <option value="pago_em_producao">Pago - Em produção</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>
      </div>

      {/* Grid Principal de Edição e Pagamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Formulário Editável de Dados */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#131110] border border-[#27272A] rounded p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider border-b border-[#27272A] pb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#E2E8F0]" />
              Dados Principais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Contato Principal</label>
                <input
                  type="text"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Data da Proposta</label>
                <input
                  type="date"
                  value={dataProposta}
                  onChange={(e) => setDataProposta(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Valor do Projeto (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorProjeto}
                  onChange={(e) => setValorProjeto(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm font-bold text-[#E2E8F0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Manutenção Mensal (R$/mês)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorManutencao}
                  onChange={(e) => setValorManutencao(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm font-semibold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Seção de Anotações Livres */}
          <div className="bg-[#131110] border border-[#27272A] rounded p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-2">
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E2E8F0]" />
                Anotações do Cliente
              </h3>
              <span className="text-[10px] text-[#A1A1AA]">Salvo ao clicar em salvar</span>
            </div>
            <textarea
              rows={6}
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              placeholder="Digite observações sobre combinados, briefing, reuniões, links do projeto..."
              className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded p-3 text-xs text-white focus:outline-none resize-y placeholder:text-[#52525B]"
            />
          </div>
        </div>

        {/* Coluna 3: Seção de Pagamento & Ações */}
        <div className="space-y-6">
          <div className="bg-[#131110] border border-[#27272A] rounded p-5 space-y-5">
            <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider border-b border-[#27272A] pb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#E2E8F0]" />
              Gestão de Pagamento
            </h3>

            <div className="space-y-2 bg-[#09090B] p-3 rounded border border-[#27272A]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#A1A1AA]">Valor do Projeto:</span>
                <span className="font-bold text-[#E2E8F0] text-sm">
                  {formatarMoeda(parseFloat(valorProjeto) || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#A1A1AA]">Manutenção Recorrente:</span>
                <span className="font-medium text-white">
                  {formatarMoeda(parseFloat(valorManutencao) || 0)}/mês
                </span>
              </div>
              {cliente.dataPagamento && (
                <div className="flex justify-between items-center text-xs pt-2 border-t border-[#27272A]">
                  <span className="text-[#A1A1AA]">Pago em:</span>
                  <span className="text-white font-medium">{formatarDataBR(cliente.dataPagamento)}</span>
                </div>
              )}
            </div>

            {/* Botão para Gerar QR Code PIX */}
            <button
              type="button"
              onClick={() => onAbrirPixModal(parseFloat(valorProjeto) || 0, empresa)}
              className="w-full bg-[#18181B] hover:bg-[#27272A] text-[#E2E8F0] border border-[#3F3F46] font-semibold py-3 px-4 rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <QrCode className="w-4 h-4 text-[#E2E8F0]" />
              Gerar QR Code PIX
            </button>

            {/* Botão de Confirmar Pagamento Recebido */}
            <button
              type="button"
              onClick={handleConfirmarPagamento}
              disabled={status === 'pago_em_producao' || status === 'entregue'}
              className={`w-full py-3 px-4 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                status === 'pago_em_producao' || status === 'entregue'
                  ? 'bg-[#18181B] text-[#71717A] border border-[#27272A] cursor-not-allowed'
                  : 'bg-[#E2E8F0] hover:bg-white text-black shadow-md cursor-pointer'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {status === 'pago_em_producao' || status === 'entregue'
                ? 'Pagamento Já Confirmado'
                : 'Confirmar Pagamento Recebido'}
            </button>

            {/* Botão Marcar como Entregue */}
            <button
              type="button"
              onClick={handleMarcarComoEntregue}
              disabled={status === 'entregue'}
              className={`w-full py-2.5 px-4 rounded text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                status === 'entregue'
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 cursor-default'
                  : 'bg-[#18181B] hover:bg-[#27272A] text-white border border-[#3F3F46] cursor-pointer'
              }`}
            >
              <Check className="w-4 h-4" />
              {status === 'entregue' ? 'Projeto Entregue ✓' : 'Marcar como Entregue'}
            </button>
          </div>

          {/* Histórico e Prazos */}
          <div className="bg-[#131110] border border-[#27272A] rounded p-4 text-xs space-y-2">
            <span className="text-[#A1A1AA] block font-medium uppercase text-[10px]">Histórico de Datas</span>
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Proposta enviada:</span>
              <span className="text-white">{formatarDataBR(dataProposta)}</span>
            </div>
            {cliente.dataPagamento && (
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Confirmado Pagamento:</span>
                <span className="text-white">{formatarDataBR(cliente.dataPagamento)}</span>
              </div>
            )}
            {cliente.dataEntrega && (
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Entregue em:</span>
                <span className="text-white">{formatarDataBR(cliente.dataEntrega)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
