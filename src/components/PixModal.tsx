import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, AlertCircle, X, QrCode, ArrowLeft } from 'lucide-react';
import { gerarPayloadPix } from '../utils/pix';
import { formatarMoeda } from '../utils/formatters';
import { PixConfig } from '../types';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  valorPadrao: number;
  nomeEmpresa: string;
  pixConfig: PixConfig;
  onSavePixConfig: (config: PixConfig) => void;
  onConfirmarPagamento: () => void;
}

export const PixModal: React.FC<PixModalProps> = ({
  isOpen,
  onClose,
  valorPadrao,
  nomeEmpresa,
  pixConfig,
  onSavePixConfig,
  onConfirmarPagamento,
}) => {
  const [chavePix, setChavePix] = useState(pixConfig.chavePix || '67996244200158');
  const [nomeBeneficiario, setNomeBeneficiario] = useState(pixConfig.nomeBeneficiario || 'GIROFY SOLUCOES DIGITAIS');
  const [cidade, setCidade] = useState(pixConfig.cidadeBeneficiario || 'SAO PAULO');
  const [valorInput, setValorInput] = useState<number>(valorPadrao || 0);
  const [copiado, setCopiado] = useState(false);
  const [editandoConfig, setEditandoConfig] = useState(!pixConfig.chavePix);

  if (!isOpen) return null;

  const payloadPix = gerarPayloadPix(
    chavePix,
    valorInput,
    nomeBeneficiario,
    cidade
  );

  const handleCopiar = () => {
    if (!payloadPix) return;
    navigator.clipboard.writeText(payloadPix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const handleSalvarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePixConfig({
      chavePix,
      nomeBeneficiario,
      cidadeBeneficiario: cidade,
    });
    setEditandoConfig(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/85 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#131110] border border-[#3F3F46] rounded-md max-w-lg w-full p-5 sm:p-6 text-[#F4F4F5] relative shadow-2xl my-auto max-h-[90vh] flex flex-col overflow-y-auto">
        {/* Header Fixo/Stick Top */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-4 shrink-0 sticky top-0 bg-[#131110] z-10">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#E2E8F0]" />
            <h3 className="text-base sm:text-lg font-bold tracking-wide text-white line-clamp-1">
              QR Code PIX - {nomeEmpresa}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white p-1.5 rounded-full hover:bg-[#27272A] transition-colors cursor-pointer"
            title="Fechar Janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body do Modal */}
        <div className="space-y-4 flex-1">
          {/* Form para editar Chave PIX */}
          {editandoConfig || !chavePix ? (
            <form onSubmit={handleSalvarConfig} className="space-y-4 bg-[#18181B] p-4 rounded border border-[#27272A]">
              <h4 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">
                Configurar sua Chave PIX
              </h4>
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Chave PIX (CNPJ, E-mail, Telefone ou Aleatória)</label>
                <input
                  type="text"
                  required
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  placeholder="Ex: 67996244200158"
                  className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#A1A1AA] mb-1">Nome Beneficiário</label>
                  <input
                    type="text"
                    required
                    value={nomeBeneficiario}
                    onChange={(e) => setNomeBeneficiario(e.target.value)}
                    placeholder="GIROFY SOLUCOES"
                    className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A1A1AA] mb-1">Cidade</label>
                  <input
                    type="text"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="SAO PAULO"
                    className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#E2E8F0] hover:bg-white text-black font-bold py-2 px-4 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Salvar e Gerar QR Code
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Informações da Cobrança */}
              <div className="bg-[#18181B] p-3 rounded border border-[#27272A] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#A1A1AA] block uppercase">Chave PIX Ativa</span>
                  <span className="font-mono text-xs text-white font-semibold">{chavePix}</span>
                </div>
                <button
                  onClick={() => setEditandoConfig(true)}
                  className="text-xs text-[#E2E8F0] hover:underline cursor-pointer font-medium"
                >
                  Alterar Chave
                </button>
              </div>

              {/* Valor Ajustável */}
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Valor do PIX (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={valorInput}
                  onChange={(e) => setValorInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-base font-bold text-[#E2E8F0] focus:outline-none"
                />
              </div>

              {/* Renderização do QR Code */}
              <div className="flex flex-col items-center justify-center p-5 bg-white rounded-md my-2 shadow-inner border border-slate-300">
                {payloadPix ? (
                  <QRCodeSVG value={payloadPix} size={190} level="M" />
                ) : (
                  <div className="text-xs text-black py-8">Preencha a chave PIX para gerar o QR Code</div>
                )}
                <span className="text-black font-bold text-lg mt-2">
                  {formatarMoeda(valorInput)}
                </span>
              </div>

              {/* Código Copia e Cola */}
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Código PIX Copia e Cola</label>
                <textarea
                  readOnly
                  rows={2}
                  value={payloadPix}
                  className="w-full bg-[#09090B] border border-[#3F3F46] rounded p-2 text-xs font-mono text-[#A1A1AA] resize-none focus:outline-none"
                />
                <button
                  onClick={handleCopiar}
                  disabled={!payloadPix}
                  className={`w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-bold transition-all cursor-pointer ${
                    copiado
                      ? 'bg-emerald-800 text-white border border-emerald-600'
                      : 'bg-[#E2E8F0] hover:bg-white text-black'
                  }`}
                >
                  {copiado ? (
                    <>
                      <Check className="w-4 h-4" />
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar Código PIX
                    </>
                  )}
                </button>
              </div>

              {/* AVISO OBRIGATÓRIO */}
              <div className="bg-[#18181B] border border-[#3F3F46] rounded p-3 flex items-start gap-2 text-xs text-[#D4D4D8]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-300" />
                <p>
                  O sistema não detecta pagamento automaticamente. Confirme manualmente abaixo após verificar no seu banco.
                </p>
              </div>

              {/* Botão de confirmação manual e Voltar */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    onConfirmarPagamento();
                    onClose();
                  }}
                  className="w-full bg-[#E2E8F0] hover:bg-white text-black font-bold py-3 px-4 rounded text-xs transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Check className="w-5 h-5" />
                  Confirmar Pagamento Recebido
                </button>

                <button
                  onClick={onClose}
                  className="w-full bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white border border-[#27272A] font-semibold py-2 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar / Fechar Janela
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

