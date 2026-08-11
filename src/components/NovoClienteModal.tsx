import React, { useState } from 'react';
import { X, UserPlus, DollarSign, Calendar, Building, User, Phone, FileText } from 'lucide-react';
import { Cliente, StatusCliente } from '../types';

interface NovoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novoCliente: Omit<Cliente, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
}

export const NovoClienteModal: React.FC<NovoClienteModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const hojeYMD = new Date().toISOString().split('T')[0];

  const [empresa, setEmpresa] = useState('');
  const [contato, setContato] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [valorProjeto, setValorProjeto] = useState('');
  const [valorManutencao, setValorManutencao] = useState('');
  const [dataProposta, setDataProposta] = useState(hojeYMD);
  const [status, setStatus] = useState<StatusCliente>('proposta_enviada');
  const [anotacoes, setAnotacoes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa.trim() || !contato.trim()) return;

    onSave({
      empresa: empresa.trim(),
      contato: contato.trim(),
      whatsapp: whatsapp.trim(),
      valorProjeto: parseFloat(valorProjeto) || 0,
      valorManutencao: parseFloat(valorManutencao) || 0,
      dataProposta: dataProposta || hojeYMD,
      status,
      anotacoes: anotacoes.trim(),
    });

    // Reset Form
    setEmpresa('');
    setContato('');
    setWhatsapp('');
    setValorProjeto('');
    setValorManutencao('');
    setDataProposta(hojeYMD);
    setStatus('proposta_enviada');
    setAnotacoes('');

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/85 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#131110] border border-[#3F3F46] rounded-md max-w-lg w-full p-5 sm:p-6 text-[#F4F4F5] relative shadow-2xl my-auto max-h-[90vh] flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-4 shrink-0 sticky top-0 bg-[#131110] z-10">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#E2E8F0]" />
            <h3 className="text-base sm:text-lg font-bold tracking-wide text-white">Cadastrar Novo Cliente</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome da Empresa */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-[#E2E8F0]" />
              Nome da Empresa / Cliente *
            </label>
            <input
              type="text"
              required
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Ex: Restaurante Sabor & Arte"
              className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none placeholder:text-[#52525B]"
            />
          </div>

          {/* Nome do Contato */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#E2E8F0]" />
              Nome do Contato Principal *
            </label>
            <input
              type="text"
              required
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              placeholder="Ex: Marcelo Oliveira"
              className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none placeholder:text-[#52525B]"
            />
          </div>

          {/* WhatsApp / Telefone */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#E2E8F0]" />
              WhatsApp / Telefone
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: (11) 98765-4321"
              className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none placeholder:text-[#52525B]"
            />
          </div>

          {/* Valores: Projeto & Manutenção */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#E2E8F0]" />
                Valor do Projeto (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valorProjeto}
                onChange={(e) => setValorProjeto(e.target.value)}
                placeholder="2500,00"
                className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none placeholder:text-[#52525B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#E2E8F0]" />
                Manutenção Mensal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valorManutencao}
                onChange={(e) => setValorManutencao(e.target.value)}
                placeholder="150,00"
                className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none placeholder:text-[#52525B]"
              />
            </div>
          </div>

          {/* Data Proposta e Status Inicial */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#E2E8F0]" />
                Data da Proposta
              </label>
              <input
                type="date"
                value={dataProposta}
                onChange={(e) => setDataProposta(e.target.value)}
                className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Status Inicial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusCliente)}
                className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="proposta_enviada">Proposta enviada</option>
                <option value="aguardando_pagamento">Aguardando pagamento</option>
                <option value="pago_em_producao">Pago - Em produção</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>
          </div>

          {/* Anotações Inicial */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#E2E8F0]" />
              Anotações / Observações
            </label>
            <textarea
              rows={3}
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              placeholder="Ex: O que foi combinado, detalhes do layout, links de referência..."
              className="w-full bg-[#09090B] border border-[#3F3F46] focus:border-[#E2E8F0] rounded p-2.5 text-xs text-white focus:outline-none placeholder:text-[#52525B] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#27272A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#E2E8F0] hover:bg-white text-black font-bold px-5 py-2 rounded text-xs transition-colors cursor-pointer uppercase tracking-wider"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
