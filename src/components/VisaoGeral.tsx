import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Repeat, 
  AlertCircle, 
  Send, 
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Cliente } from '../types';
import { 
  formatarMoeda, 
  calcularDiasPassados, 
  gerarLinkWhatsApp 
} from '../utils/formatters';

interface VisaoGeralProps {
  clientes: Cliente[];
  onSelectCliente: (id: string) => void;
}

export const VisaoGeral: React.FC<VisaoGeralProps> = ({
  clientes,
  onSelectCliente,
}) => {
  // Cálculos Métricos
  const totalClientesAtivos = clientes.filter((c) => c.status !== 'entregue').length;

  const somaAguardandoPagamento = clientes
    .filter((c) => c.status === 'aguardando_pagamento')
    .reduce((acc, c) => acc + (c.valorProjeto || 0), 0);

  const somaPagoEmProducao = clientes
    .filter((c) => c.status === 'pago_em_producao' || c.status === 'entregue')
    .reduce((acc, c) => acc + (c.valorProjeto || 0), 0);

  const somaManutencaoMensal = clientes
    .filter((c) => c.status === 'pago_em_producao' || c.status === 'entregue')
    .reduce((acc, c) => acc + (c.valorManutencao || 0), 0);

  // Preparação de dados para o gráfico de barras
  const statusContagem = {
    proposta_enviada: clientes.filter((c) => c.status === 'proposta_enviada').length,
    aguardando_pagamento: clientes.filter((c) => c.status === 'aguardando_pagamento').length,
    pago_em_producao: clientes.filter((c) => c.status === 'pago_em_producao').length,
    entregue: clientes.filter((c) => c.status === 'entregue').length,
  };

  const dadosGrafico = [
    { name: 'Proposta Enviada', quantidade: statusContagem.proposta_enviada, cor: '#71717A' },
    { name: 'Aguard. Pagamento', quantidade: statusContagem.aguardando_pagamento, cor: '#CBD5E1' },
    { name: 'Pago / Produção', quantidade: statusContagem.pago_em_producao, cor: '#E2E8F0' },
    { name: 'Entregue', quantidade: statusContagem.entregue, cor: '#F4F4F5' },
  ];

  // Clientes para Follow-up (Em "proposta_enviada" há mais de 3 dias)
  const clientesFollowUp = clientes.filter((c) => {
    if (c.status !== 'proposta_enviada') return false;
    const dias = calcularDiasPassados(c.dataProposta);
    return dias >= 3;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header Dashboard */}
      <div className="border-b border-[#27272A] pb-4">
        <h2 className="text-xl font-bold text-white tracking-wide">Visão Geral do Negócio</h2>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Acompanhe suas métricas financeiras, distribuição de propostas e oportunidades de follow-up.
        </p>
      </div>

      {/* Grid de Cards Métricos Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Clientes Ativos */}
        <div className="bg-[#131110] border border-[#27272A] rounded p-5 space-y-2">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-xs font-medium uppercase tracking-wider">Clientes em Andamento</span>
            <Users className="w-4 h-4 text-[#E2E8F0]" />
          </div>
          <div className="text-2xl font-bold text-white">{totalClientesAtivos}</div>
          <p className="text-[11px] text-[#A1A1AA]">Propostas ativas + Projetos em produção</p>
        </div>

        {/* Card 2: Aguardando Pagamento */}
        <div className="bg-[#131110] border border-[#27272A] rounded p-5 space-y-2">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-xs font-medium uppercase tracking-wider">Aguardando Pagamento</span>
            <Clock className="w-4 h-4 text-[#CBD5E1]" />
          </div>
          <div className="text-2xl font-bold text-[#CBD5E1]">
            {formatarMoeda(somaAguardandoPagamento)}
          </div>
          <p className="text-[11px] text-[#A1A1AA]">
            {statusContagem.aguardando_pagamento} proposta(s) aguardando PIX
          </p>
        </div>

        {/* Card 3: Soma de Valores Pagos */}
        <div className="bg-[#131110] border border-[#27272A] rounded p-5 space-y-2">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-xs font-medium uppercase tracking-wider">Receita Fechada</span>
            <DollarSign className="w-4 h-4 text-[#E2E8F0]" />
          </div>
          <div className="text-2xl font-bold text-[#E2E8F0]">
            {formatarMoeda(somaPagoEmProducao)}
          </div>
          <p className="text-[11px] text-[#A1A1AA]">Projetos pagos ou já entregues</p>
        </div>

        {/* Card 4: Manutenção Mensal Recorrente */}
        <div className="bg-[#131110] border border-[#27272A] rounded p-5 space-y-2">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-xs font-medium uppercase tracking-wider">Manutenção Recorrente</span>
            <Repeat className="w-4 h-4 text-[#E2E8F0]" />
          </div>
          <div className="text-2xl font-bold text-white">
            {formatarMoeda(somaManutencaoMensal)}<span className="text-xs font-normal text-[#A1A1AA]">/mês</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">Receita mensal recorrente (MRR)</p>
        </div>
      </div>

      {/* Seção Gráfico e Próximos Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras por Status */}
        <div className="bg-[#131110] border border-[#27272A] rounded p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#E2E8F0]" />
              Distribuição por Status
            </h3>
            <p className="text-xs text-[#A1A1AA]">Quantidade de clientes em cada fase do funil</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#A1A1AA', fontSize: 11 }} 
                  axisLine={{ stroke: '#27272A' }}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fill: '#A1A1AA', fontSize: 11 }} 
                  axisLine={{ stroke: '#27272A' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090B',
                    borderColor: '#27272A',
                    color: '#F4F4F5',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                  cursor={{ fill: 'rgba(226, 232, 240, 0.05)' }}
                />
                <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lista de Próximos Follow-ups (Alertas visuais de mais de 3 dias sem resposta) */}
        <div className="bg-[#131110] border border-[#27272A] rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E2E8F0]" />
                Próximos Follow-ups Necessários
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Propostas enviadas há 3 dias ou mais sem atualização de status
              </p>
            </div>
            <span className="bg-[#E2E8F0]/20 text-[#E2E8F0] font-bold text-xs px-2.5 py-1 rounded border border-[#E2E8F0]/40">
              {clientesFollowUp.length}
            </span>
          </div>

          {clientesFollowUp.length === 0 ? (
            <div className="text-center py-8 text-[#A1A1AA] text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
              <p>Excelente! Não há nenhuma proposta pendente de retorno há mais de 3 dias.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {clientesFollowUp.map((c) => {
                const diasPassados = calcularDiasPassados(c.dataProposta);
                const mensagemWhatsApp = `Olá ${c.contato}, tudo bem? Passando para saber se você conseguiu analisar a proposta do projeto para a ${c.empresa}. Qualquer dúvida estou à disposição!`;
                const linkWa = gerarLinkWhatsApp(c.whatsapp, mensagemWhatsApp);

                return (
                  <div
                    key={c.id}
                    className="bg-[#09090B] border border-[#27272A] hover:border-[#E2E8F0]/50 rounded p-3.5 flex items-center justify-between gap-3 transition-colors text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm">{c.empresa}</strong>
                        <span className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {diasPassados} dias sem retorno
                        </span>
                      </div>
                      <span className="text-[#A1A1AA] block mt-0.5">
                        Contato: {c.contato} • Proposta de {formatarMoeda(c.valorProjeto)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {c.whatsapp && (
                        <a
                          href={linkWa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#18181B] hover:bg-[#27272A] text-[#E2E8F0] border border-[#3F3F46] p-2 rounded transition-colors"
                          title="Enviar WhatsApp de cobrança amigável"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => onSelectCliente(c.id)}
                        className="bg-[#E2E8F0] hover:bg-white text-black font-bold p-2 rounded transition-colors cursor-pointer"
                        title="Ver detalhes do cliente"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
