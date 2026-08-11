import React, { useState } from 'react';
import { X, QrCode, Copy, Check, ShieldCheck, Sparkles, Receipt, Building2, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { PropostaVisualData, AsaasConfig } from '../types';

interface AsaasPixCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposta: PropostaVisualData;
  asaasConfig?: AsaasConfig;
  onPagamentoConfirmado?: () => void;
}

export const AsaasPixCheckoutModal: React.FC<AsaasPixCheckoutModalProps> = ({
  isOpen,
  onClose,
  proposta,
  asaasConfig,
  onPagamentoConfirmado
}) => {
  const [etapa, setEtapa] = useState<'dados' | 'qrcode' | 'pago'>('dados');

  // Form para dados da NF-e no Asaas
  const [razaoSocial, setRazaoSocial] = useState(proposta.nomeClienteEmpresa || '');
  const [cnpjCpf, setCnpjCpf] = useState(proposta.cnpjCliente || '12.345.678/0001-90');
  const [emailNf, setEmailNf] = useState(proposta.contatoEmail || 'financeiro@cliente.com.br');
  const [copiado, setCopiado] = useState(false);

  if (!isOpen) return null;

  // Cálculo da entrada
  const valorEntrada = (proposta.valorProjeto * (proposta.porcentagemEntrada || 50)) / 100;

  // Payload fictício do Pix Asaas no formato EMV QRCPS
  const pixCopiaColaFake = `00020126580014BR.GOV.BCB.PIX0136asaas-${proposta.id}-pix-entry520400005303986540${valorEntrada.toFixed(2)}5802BR5925${
    asaasConfig?.razaoSocialEmitente || 'GIROFY TECNOLOGIA'
  }6009SAO PAULO62070503***6304A1B2`;

  const formatarMoeda = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleGerarPix = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa('qrcode');
  };

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(pixCopiaColaFake);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleSimularPagamentoAsaas = () => {
    setEtapa('pago');
    if (onPagamentoConfirmado) {
      onPagamentoConfirmado();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#09090B] border border-[#27272A] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-[#F4F4F5] relative">
        {/* Header Modal */}
        <div className="bg-[#18181B] border-b border-[#27272A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-lg text-black font-bold"
              style={{ backgroundColor: proposta.corDestaque || '#C9982E' }}
            >
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Checkout Pix Asaas &amp; Nota Fiscal
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">
                Pagamento seguro de entrada ({proposta.porcentagemEntrada || 50}%) com emissão direta de NFS-e
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Etapa 1: Confirmação de Dados para Nota Fiscal */}
          {etapa === 'dados' && (
            <form onSubmit={handleGerarPix} className="space-y-4">
              <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span>Projeto / Solução:</span>
                  <strong className="text-white">{proposta.nomeProjeto}</strong>
                </div>
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span>Valor Total do Projeto:</span>
                  <span className="text-white">{formatarMoeda(proposta.valorProjeto)}</span>
                </div>
                <div className="border-t border-[#27272A] pt-2 flex justify-between items-center">
                  <span className="font-semibold text-white">Entrada Imediata ({proposta.porcentagemEntrada || 50}% via PIX):</span>
                  <strong className="text-lg font-bold" style={{ color: proposta.corDestaque || '#C9982E' }}>
                    {formatarMoeda(valorEntrada)}
                  </strong>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-blue-400" />
                  Dados do Destinatário da Nota Fiscal (NFS-e)
                </h4>

                <div>
                  <label className="block text-[#A1A1AA] mb-1">Razão Social / Nome da Empresa *</label>
                  <input
                    type="text"
                    required
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#A1A1AA] mb-1">CNPJ ou CPF *</label>
                    <input
                      type="text"
                      required
                      value={cnpjCpf}
                      onChange={(e) => setCnpjCpf(e.target.value)}
                      className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A1A1AA] mb-1">E-mail para Receber a Nota *</label>
                    <input
                      type="email"
                      required
                      value={emailNf}
                      onChange={(e) => setEmailNf(e.target.value)}
                      className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-lg flex items-center gap-2.5 text-blue-300 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  O Asaas processa o Pix e envia a Nota Fiscal (NFS-e) diretamente para o e-mail informado acima.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-black transition-all shadow-xl hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer text-xs"
                style={{ backgroundColor: proposta.corDestaque || '#C9982E' }}
              >
                <QrCode className="w-4 h-4 fill-black" />
                <span>Gerar Qr Code Pix Asaas &amp; Emitir Nota</span>
              </button>
            </form>
          )}

          {/* Etapa 2: Exibição do QR Code Pix Asaas */}
          {etapa === 'qrcode' && (
            <div className="space-y-5 text-center">
              <div className="bg-white p-4 rounded-xl inline-block shadow-2xl border-4 border-emerald-500/30">
                {/* Visual Fake SVG QR Code Representation */}
                <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  <path d="M10 10h25v25H10zM15 15v15h15V15zM20 20h5v5h-5z" fill="black" />
                  <path d="M65 10h25v25H65zM70 15v15h15V15zM75 20h5v5h-5z" fill="black" />
                  <path d="M10 65h25v25H10zM15 70v15h15V70zM20 75h5v5h-5z" fill="black" />
                  <rect x="40" y="10" width="10" height="10" fill="black" />
                  <rect x="50" y="20" width="10" height="10" fill="black" />
                  <rect x="40" y="40" width="20" height="20" fill="black" />
                  <rect x="10" y="40" width="10" height="10" fill="black" />
                  <rect x="70" y="40" width="20" height="10" fill="black" />
                  <rect x="65" y="60" width="15" height="15" fill="black" />
                  <rect x="40" y="70" width="15" height="15" fill="black" />
                  <rect x="80" y="80" width="10" height="10" fill="black" />
                </svg>
              </div>

              <div>
                <span className="text-[11px] text-[#A1A1AA] block uppercase tracking-wider">
                  Valor da Entrada a Pagar:
                </span>
                <strong
                  className="text-2xl font-bold font-serif-display"
                  style={{ color: proposta.corDestaque || '#C9982E' }}
                >
                  {formatarMoeda(valorEntrada)}
                </strong>
              </div>

              {/* Copia e Cola */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] text-[#A1A1AA] font-medium block">
                  Código Pix Copia e Cola:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixCopiaColaFake}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded px-3 py-2 text-[11px] font-mono text-[#E2E8F0] focus:outline-none"
                  />
                  <button
                    onClick={handleCopiarPix}
                    className="px-4 py-2 rounded bg-[#27272A] hover:bg-[#3F3F46] text-white font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#18181B] border border-blue-500/30 rounded-lg text-left text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-blue-400">
                  <Receipt className="w-4 h-4" />
                  <span>Emissão Automática de Nota Fiscal Asaas:</span>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Assim que o banco confirmar o Pix, o Asaas transmitirá a Nota Fiscal (NFS-e) para <strong>{emailNf}</strong>.
                </p>
              </div>

              {/* Botão de Simulação em Tempo Real */}
              <div className="pt-2 border-t border-[#27272A] space-y-2">
                <button
                  onClick={handleSimularPagamentoAsaas}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg uppercase tracking-wider text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simular Pagamento Confirmado no Asaas</span>
                </button>
                <p className="text-[10px] text-[#71717A]">
                  (Simulação instantânea de webhook de pagamento do Asaas para testes do fluxo)
                </p>
              </div>
            </div>
          )}

          {/* Etapa 3: Sucesso e Agendamento da Mensalidade */}
          {etapa === 'pago' && (
            <div className="space-y-5 text-center py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-serif-display text-white">
                  Pagamento Confirmado via Pix!
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Sua proposta para <strong>{proposta.nomeProjeto}</strong> foi aprovada e iniciada.
                </p>
              </div>

              <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4" />
                    Nota Fiscal NFS-e Nº 004928:
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                    Enviada por E-mail
                  </span>
                </div>
                <p className="text-[#A1A1AA] text-[11px]">
                  Enviada com sucesso para: <strong className="text-white">{emailNf}</strong>
                </p>

                <div className="border-t border-[#27272A] pt-2 mt-2 flex items-center justify-between text-[#A1A1AA]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Mensalidade Agendada Asaas:
                  </span>
                  <strong className="text-white">
                    {formatarMoeda(proposta.valorMensalidade)}/mês
                  </strong>
                </div>
                <p className="text-[10px] text-[#71717A]">
                  * A primeira mensalidade do contrato começará a contar apenas 30 dias após a entrega oficial do sistema ({proposta.diasEntrega}).
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white font-bold transition-colors cursor-pointer text-xs uppercase tracking-wider"
              >
                Concluir &amp; Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
