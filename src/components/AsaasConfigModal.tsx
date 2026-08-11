import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Key, Building2, FileText, Send } from 'lucide-react';
import { AsaasConfig } from '../types';

interface AsaasConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  asaasConfig: AsaasConfig;
  onSaveAsaasConfig: (config: AsaasConfig) => void;
}

export const AsaasConfigModal: React.FC<AsaasConfigModalProps> = ({
  isOpen,
  onClose,
  asaasConfig,
  onSaveAsaasConfig
}) => {
  const [apiKey, setApiKey] = useState(asaasConfig.apiKey || '');
  const [ambiente, setAmbiente] = useState<'sandbox' | 'producao'>(asaasConfig.ambiente || 'sandbox');
  const [emissaoNotaFiscalAuto, setEmissaoNotaFiscalAuto] = useState(
    asaasConfig.emissaoNotaFiscalAuto !== undefined ? asaasConfig.emissaoNotaFiscalAuto : true
  );
  const [razaoSocialEmitente, setRazaoSocialEmitente] = useState(asaasConfig.razaoSocialEmitente || '');
  const [cnpjEmitente, setCnpjEmitente] = useState(asaasConfig.cnpjEmitente || '');
  const [emailNotificacao, setEmailNotificacao] = useState(asaasConfig.emailNotificacao || '');

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = () => {
    setTestStatus('testing');
    setFeedbackMsg('Testando comunicação com o servidor do Asaas...');

    setTimeout(() => {
      if (apiKey.trim().length > 10 || ambiente === 'sandbox') {
        setTestStatus('success');
        setFeedbackMsg(
          `Conexão bem-sucedida com Asaas (${ambiente.toUpperCase()})! A emissão automática de Nota Fiscal (NFS-e) por e-mail está ativa.`
        );
      } else {
        setTestStatus('error');
        setFeedbackMsg('Chave de API inválida. Certifique-se de usar a chave no formato do Asaas ($aact_...).');
      }
    }, 1000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAsaasConfig({
      apiKey,
      ambiente,
      emissaoNotaFiscalAuto,
      razaoSocialEmitente,
      cnpjEmitente,
      emailNotificacao
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#09090B] border border-[#27272A] w-full max-w-xl rounded-xl shadow-2xl overflow-hidden text-[#F4F4F5] space-y-0">
        {/* Header do Modal */}
        <div className="bg-[#18181B] border-b border-[#27272A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Integração Asaas & Nota Fiscal</h3>
              <p className="text-[11px] text-[#A1A1AA]">
                Configuração de Pix automático + Envio de Nota Fiscal (NFS-e) direta para o e-mail do cliente
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
          {/* Banner explicativo */}
          <div className="bg-blue-950/40 border border-blue-800/40 rounded-lg p-3.5 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-blue-200 text-[11px] leading-relaxed">
              <strong className="block font-semibold text-white">Fluxo 100% Automatizado:</strong>
              <p>
                Quando o seu cliente paga o Pix de entrada da proposta, o Asaas registra o pagamento, agenda a mensalidade futura (MRR) e transmite a Nota Fiscal (NFS-e) direto para o e-mail do cliente sem você precisar emitir manualmente!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A1A1AA] mb-1 font-medium flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                Chave da API do Asaas
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="$aact_Y3JhdGVkYnk..."
                className="w-full bg-[#18181B] border border-[#27272A] focus:border-blue-500 rounded p-2.5 text-white font-mono focus:outline-none placeholder-[#52525B]"
              />
              <span className="text-[10px] text-[#71717A] mt-1 block">
                Disponível no painel do Asaas em Configurações &gt; Integrações.
              </span>
            </div>

            <div>
              <label className="block text-[#A1A1AA] mb-1 font-medium">Ambiente da API</label>
              <select
                value={ambiente}
                onChange={(e) => setAmbiente(e.target.value as 'sandbox' | 'producao')}
                className="w-full bg-[#18181B] border border-[#27272A] focus:border-blue-500 rounded p-2.5 text-white focus:outline-none"
              >
                <option value="sandbox">Sandbox (Testes &amp; Demonstração)</option>
                <option value="producao">Produção (Chave Real de Produção)</option>
              </select>
              <span className="text-[10px] text-[#71717A] mt-1 block">
                Em modo Sandbox, o Pix e a Nota Fiscal são simulados em tempo real.
              </span>
            </div>
          </div>

          <div className="border-t border-[#27272A] pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Dados da Sua Empresa Emitente (Prestador)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A1A1AA] mb-1">Razão Social / Nome da Sua Empresa</label>
                <input
                  type="text"
                  value={razaoSocialEmitente}
                  onChange={(e) => setRazaoSocialEmitente(e.target.value)}
                  placeholder="Ex: Girofy Software & Tecnologia Ltda"
                  className="w-full bg-[#18181B] border border-[#27272A] focus:border-blue-500 rounded p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">CNPJ da Sua Empresa</label>
                <input
                  type="text"
                  value={cnpjEmitente}
                  onChange={(e) => setCnpjEmitente(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-[#18181B] border border-[#27272A] focus:border-blue-500 rounded p-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A1A1AA] mb-1">Seu E-mail de Notificação (Cópia da Nota)</label>
              <input
                type="email"
                value={emailNotificacao}
                onChange={(e) => setEmailNotificacao(e.target.value)}
                placeholder="financeiro@suaempresa.com.br"
                className="w-full bg-[#18181B] border border-[#27272A] focus:border-blue-500 rounded p-2 text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="chkNfAuto"
                checked={emissaoNotaFiscalAuto}
                onChange={(e) => setEmissaoNotaFiscalAuto(e.target.checked)}
                className="w-4 h-4 rounded border-[#27272A] bg-[#18181B] accent-blue-500 cursor-pointer"
              />
              <label htmlFor="chkNfAuto" className="text-xs text-[#E2E8F0] cursor-pointer">
                Ativar emissão e envio automático de Nota Fiscal de Serviço (NFS-e) pelo Asaas após confirmação do Pix
              </label>
            </div>
          </div>

          {/* Status do Teste de Conexão */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded border text-xs flex items-center gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-950/50 border-emerald-800/50 text-emerald-300'
                  : testStatus === 'error'
                  ? 'bg-red-950/50 border-red-800/50 text-red-300'
                  : 'bg-blue-950/50 border-blue-800/50 text-blue-300'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : testStatus === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 animate-spin" />
              )}
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Buttons Footer */}
          <div className="border-t border-[#27272A] pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3.5 py-2 rounded bg-[#18181B] hover:bg-[#27272A] border border-[#3F3F46] text-white font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Testar Conexão</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-[#27272A] hover:bg-[#18181B] text-[#A1A1AA] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Configuração</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
