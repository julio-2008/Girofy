import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Building, 
  User, 
  Phone, 
  Check, 
  Clock, 
  DollarSign, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Cliente, StatusCliente } from '../types';
import { formatarMoeda, formatarDataBR, formatarTelefoneBR } from '../utils/formatters';

interface ClientesListProps {
  clientes: Cliente[];
  onSelectCliente: (id: string) => void;
  onOpenNovoModal: () => void;
}

export const ClientesList: React.FC<ClientesListProps> = ({
  clientes,
  onSelectCliente,
  onOpenNovoModal,
}) => {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // Filtragem de clientes
  const clientesFiltrados = clientes.filter((c) => {
    const matchTexto =
      c.empresa.toLowerCase().includes(busca.toLowerCase()) ||
      c.contato.toLowerCase().includes(busca.toLowerCase()) ||
      c.whatsapp.includes(busca);

    const matchStatus =
      filtroStatus === 'todos' || c.status === filtroStatus;

    return matchTexto && matchStatus;
  });

  const renderBadgeStatus = (status: StatusCliente) => {
    switch (status) {
      case 'proposta_enviada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-medium bg-[#18181B] text-[#A1A1AA] border border-[#27272A]">
            <Clock className="w-3 h-3 text-[#A1A1AA]" />
            Proposta enviada
          </span>
        );
      case 'aguardando_pagamento':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-semibold bg-[#E2E8F0]/15 text-[#E2E8F0] border border-[#E2E8F0]/50 animate-pulse">
            <span className="w-2 h-2 rounded-none bg-[#E2E8F0] animate-ping" />
            Aguardando pagamento
          </span>
        );
      case 'pago_em_producao':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-bold bg-[#E2E8F0] text-black shadow-xs">
            <DollarSign className="w-3 h-3" />
            Pago - Em produção
          </span>
        );
      case 'entregue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-medium bg-white/10 text-white border border-white/20">
            <Check className="w-3.5 h-3.5 text-white" />
            Entregue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Topo da Lista */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Clientes e Propostas</h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Gerencie propostas, acompanhe pagamentos e acompanhe o fluxo de entregas.
          </p>
        </div>
        <button
          onClick={onOpenNovoModal}
          className="w-full sm:w-auto bg-[#E2E8F0] hover:bg-white text-black font-bold px-4 py-2.5 rounded-none text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          + Novo Cliente
        </button>
      </div>

      {/* Barra de Filtros & Busca */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#131110] p-3 rounded-none border border-[#27272A]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por empresa, contato ou whatsapp..."
            className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#E2E8F0] rounded-none pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0 hidden sm:inline" />
          <div className="flex items-center gap-1 shrink-0">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'proposta_enviada', label: 'Proposta Enviada' },
              { id: 'aguardando_pagamento', label: 'Aguardando Pagamento' },
              { id: 'pago_em_producao', label: 'Em Produção' },
              { id: 'entregue', label: 'Entregue' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltroStatus(f.id)}
                className={`px-2.5 py-1.5 rounded-none text-xs transition-colors whitespace-nowrap cursor-pointer ${
                  filtroStatus === f.id
                    ? 'bg-[#E2E8F0] text-black font-bold'
                    : 'bg-[#18181B] text-[#A1A1AA] hover:text-white border border-[#27272A]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Cards de Clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-[#131110] border border-[#27272A] rounded-none p-6">
          <Building className="w-10 h-10 text-[#3F3F46] mx-auto mb-3" />
          <p className="text-sm text-[#A1A1AA]">Nenhum cliente cadastrado ou encontrado com os filtros atuais.</p>
          <button
            onClick={onOpenNovoModal}
            className="mt-4 text-xs text-[#E2E8F0] hover:underline font-medium cursor-pointer"
          >
            + Clique aqui para cadastrar um novo cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
              onClick={() => onSelectCliente(cliente.id)}
              className="bg-[#131110] hover:bg-[#18181B] border border-[#27272A] hover:border-[#E2E8F0]/60 rounded-none p-5 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
            >
              {/* Top Header do Card */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-white group-hover:text-[#E2E8F0] transition-colors line-clamp-1">
                    {cliente.empresa}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#E2E8F0] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>

                <div className="space-y-1.5 mb-3 text-xs text-[#A1A1AA]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#E2E8F0]" />
                    <span className="text-[#F4F4F5]">{cliente.contato}</span>
                  </div>
                  {cliente.whatsapp && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#A1A1AA]" />
                      <span>{formatarTelefoneBR(cliente.whatsapp)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#27272A]">
                  {renderBadgeStatus(cliente.status)}
                </div>
              </div>

              {/* Informações Financeiras no Rodapé do Card */}
              <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#A1A1AA] block uppercase">Valor Projeto</span>
                  <span className="text-sm font-bold text-[#E2E8F0]">
                    {formatarMoeda(cliente.valorProjeto)}
                  </span>
                </div>
                {cliente.valorManutencao > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] text-[#A1A1AA] block uppercase">Manutenção</span>
                    <span className="text-xs font-medium text-white">
                      {formatarMoeda(cliente.valorManutencao)}/mês
                    </span>
                  </div>
                )}
                {cliente.valorManutencao === 0 && (
                  <div className="text-right">
                    <span className="text-[10px] text-[#A1A1AA] block uppercase">Proposta</span>
                    <span className="text-xs text-[#A1A1AA]">
                      {formatarDataBR(cliente.dataProposta)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
