import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Receipt,
  Clock,
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  Gift,
  Lock,
  Globe,
  Code2,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { PropostaVisualData } from '../types';

interface PropostaVisualProps {
  propostaCustomizada?: PropostaVisualData;
  onVoltarPainel?: () => void;
  isPublico?: boolean;
}

export const PropostaVisual: React.FC<PropostaVisualProps> = ({
  propostaCustomizada,
  onVoltarPainel,
  isPublico
}) => {
  const [proposta, setProposta] = useState<PropostaVisualData>(
    propostaCustomizada || {
      id: 'default-prop',
      nomeClienteEmpresa: 'Lu Festas & Eventos',
      contatoWhatsapp: '11999998888',
      dominioDesejado: 'lufestas.com.br',
      dorDoCliente:
        'Perdemos muito tempo anotando pedidos no papel e cobrando clientes um por um no WhatsApp',
      escopoEspecifico:
        'Sistema web sob medida com catálogo digital de produtos, carrinho de pedidos automatizado, painel administrativo de gestão de vendas e emissão de recibos fiscais.',
      valorProjeto: 12000,
      porcentagemEntrada: 50,
      valorMensalidade: 490,
      diasEntrega: '10 a 15 dias',
      bonusInclusos: [
        {
          id: 'b1',
          titulo: 'Domínio Corporativo .com.br + SSL Incluso',
          valorEstimado: 250,
          descricao: 'Registro do domínio desejado e configuração de certificado de segurança SSL.'
        },
        {
          id: 'b2',
          titulo: 'Hospedagem em Servidor Cloud (12 meses)',
          valorEstimado: 800,
          descricao: 'Infraestrutura dedicada de alta velocidade, disponibilidade e backup.'
        },
        {
          id: 'b3',
          titulo: 'Treinamento da Equipe + Guia de Uso',
          valorEstimado: 1200,
          descricao: 'Capacitação prática para sua equipe utilizar o sistema com total autonomia.'
        },
        {
          id: 'b4',
          titulo: 'Suporte Técnico Prioritário Pós-Entrega',
          valorEstimado: 1500,
          descricao: 'Atendimento direto para dúvidas operacionais e ajustes pós-lançamento.'
        }
      ],
      seoTecnicoIncluso: [
        'Google Search Console',
        'XML Sitemap',
        'Meta Description Otimizada',
        'Pesquisa de Palavras-chave',
        'llms.txt (Otimização para IAs)'
      ],
      clausulaNaoIncluso:
        'Tráfego pago, produção de conteúdo de terceiros e integrações com ERPs legados não acordados previamente.',
      corDestaque: '#10B981'
    }
  );

  const [linkCopiado, setLinkCopiado] = useState(false);

  // Verificar se o acesso é via link público (#proposta=)
  const eLinkPublicoExterno = isPublico || window.location.hash.includes('proposta=');

  useEffect(() => {
    if (propostaCustomizada) {
      setProposta(propostaCustomizada);
    }
  }, [propostaCustomizada]);

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  };

  const valorEntrada = (proposta.valorProjeto * (proposta.porcentagemEntrada || 50)) / 100;

  const totalBonusEstimado = (proposta.bonusInclusos || []).reduce(
    (acc, b) => acc + (Number(b.valorEstimado) || 0),
    0
  );

  const formatarMoeda = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Li a proposta comercial para a ${proposta.nomeClienteEmpresa} e quero dar início ao projeto.`
  );
  const urlWhatsApp = `https://wa.me/55${proposta.contatoWhatsapp.replace(/\D/g, '')}?text=${mensagemWhatsApp}`;

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-20 w-full overflow-x-hidden selection:bg-[#E2E8F0] selection:text-black">
      {/* Top Bar para Modo Sistema (Invisível no Link Final Compartilhado) */}
      {!eLinkPublicoExterno && onVoltarPainel && (
        <header className="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 sticky top-0 z-40 backdrop-blur-md">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 text-xs">
            <button
              onClick={onVoltarPainel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Painel</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400 hidden sm:inline">Pré-visualização</span>
              <button
                onClick={handleCopiarLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {linkCopiado ? <Check className="w-3.5 h-3.5 text-[#E2E8F0]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{linkCopiado ? 'Copiado!' : 'Copiar Link do Cliente'}</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Conteúdo Principal da Proposta Comercial */}
      <main className="max-w-2xl mx-auto px-4 pt-8 sm:pt-12 space-y-8 animate-fadeIn">
        {/* Cabeçalho de Marca Girofy */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-none bg-[#E2E8F0] text-black font-extrabold flex items-center justify-center text-sm">
              G
            </div>
            <span className="text-sm font-bold tracking-wider text-white">
              Girofy <span className="text-zinc-500 font-normal">Software &amp; Automação</span>
            </span>
          </div>

          <span className="text-[10px] font-mono text-[#E2E8F0] bg-[#E2E8F0]/10 border border-[#E2E8F0]/20 px-2.5 py-1 rounded-none uppercase tracking-wider font-semibold">
            Proposta Comercial
          </span>
        </div>

        {/* 1. TÍTULO COM A DOR DO CLIENTE (Frase literal sem estatísticas falsas) */}
        <div className="space-y-3 bg-zinc-950 border border-zinc-800/80 rounded-none p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2E8F0]/5 rounded-none blur-2xl pointer-events-none"></div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E2E8F0] font-bold block">
            {proposta.nomeClienteEmpresa}
          </span>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            "{proposta.dorDoCliente}"
          </h1>

          <p className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-zinc-800/80">
            Esta proposta foi estruturada sob medida para solucionar este gargalo e automatizar a operação da sua empresa.
          </p>
        </div>

        {/* 2. PREVIEW DO DOMÍNIO (Mockup simples de barra de navegador) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <Globe className="w-3.5 h-3.5 text-[#E2E8F0]" />
              Domínio do Seu Projeto
            </span>
            <span className="text-[#E2E8F0] font-semibold flex items-center gap-1 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Certificado SSL Incluso
            </span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-none p-3.5 sm:p-4">
            <div className="bg-black border border-zinc-800 rounded-none p-3 flex items-center gap-3">
              {/* Botões do Browser */}
              <div className="flex items-center gap-1.5 shrink-0 px-1">
                <div className="w-2.5 h-2.5 bg-zinc-800"></div>
                <div className="w-2.5 h-2.5 bg-zinc-800"></div>
                <div className="w-2.5 h-2.5 bg-zinc-800"></div>
              </div>

              {/* Barra de Endereço */}
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-none px-3.5 py-2 flex items-center gap-2 overflow-hidden">
                <Lock className="w-3.5 h-3.5 text-[#E2E8F0] shrink-0" />
                <span className="text-xs font-mono text-zinc-500 select-none">https://</span>
                <span className="text-xs sm:text-sm font-mono text-white font-bold tracking-wide truncate">
                  {proposta.dominioDesejado}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ESCOPO ESPECÍFICO DO PROJETO (Texto por cliente) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-none p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            <CheckCircle2 className="w-4 h-4 text-[#E2E8F0] shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Escopo Específico do Projeto
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
            {proposta.escopoEspecifico}
          </p>
        </div>

        {/* 4. STACK DE BÔNUS FIXOS (Com valor riscado) */}
        {proposta.bonusInclusos && proposta.bonusInclusos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#E2E8F0]" />
                <span>Bônus Inclusos Sem Custo Extra</span>
              </h3>
              <span className="text-[10px] font-mono text-[#E2E8F0] bg-[#E2E8F0]/10 border border-[#E2E8F0]/20 px-2 py-0.5 rounded-none">
                {formatarMoeda(totalBonusEstimado)} de presente
              </span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-none p-5 space-y-3">
              {proposta.bonusInclusos.map((bonus, idx) => (
                <div
                  key={bonus.id || idx}
                  className="flex items-start justify-between gap-3 border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#E2E8F0] shrink-0" />
                      {bonus.titulo}
                    </span>
                    {bonus.descricao && (
                      <p className="text-[11px] text-zinc-400 pl-5">{bonus.descricao}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-zinc-500 line-through block font-mono">
                      {formatarMoeda(bonus.valorEstimado)}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#E2E8F0] uppercase tracking-wider">
                      Incluso
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. INCLUSÕES TÉCNICAS DE SEO */}
        {proposta.seoTecnicoIncluso && proposta.seoTecnicoIncluso.length > 0 && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-none p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <Code2 className="w-4 h-4 text-[#E2E8F0] shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Inclusões Técnicas de SEO &amp; Indexação
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {proposta.seoTecnicoIncluso.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-black border border-zinc-800/80 rounded-none px-3 py-2 text-zinc-300">
                  <Check className="w-3.5 h-3.5 text-[#E2E8F0] shrink-0" />
                  <span className="text-[11px] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CARD DO INVESTIMENTO */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-none p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">
                Investimento Total do Projeto
              </span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-white">
                {formatarMoeda(proposta.valorProjeto)}
              </strong>
            </div>

            {proposta.diasEntrega && (
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">
                  Prazo de Entrega
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white flex items-center justify-end gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#E2E8F0]" />
                  {proposta.diasEntrega}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-black border border-zinc-800 rounded-none p-4 space-y-1">
              <span className="text-zinc-400 text-[11px] block font-medium">
                Sinal Pix de Entrada ({proposta.porcentagemEntrada || 50}%)
              </span>
              <strong className="text-xl font-bold text-white block">
                {formatarMoeda(valorEntrada)}
              </strong>
              <span className="text-[10px] text-zinc-500 block">
                Para início imediato do projeto
              </span>
            </div>

            {proposta.valorMensalidade > 0 && (
              <div className="bg-black border border-zinc-800 rounded-none p-4 space-y-1">
                <span className="text-zinc-400 text-[11px] block font-medium">
                  Manutenção &amp; Servidor Cloud
                </span>
                <strong className="text-xl font-bold text-white block">
                  {formatarMoeda(proposta.valorMensalidade)}/mês
                </strong>
                <span className="text-[10px] text-zinc-500 block">
                  Somente após aprovação e entrega
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-zinc-400 bg-black/80 border border-zinc-800/80 rounded-none p-3 flex items-center gap-2.5">
            <Receipt className="w-4 h-4 text-[#E2E8F0] shrink-0" />
            <span>Nota Fiscal (NFS-e) e recibo fiscal gerados automaticamente via Asaas no recebimento.</span>
          </div>
        </div>

        {/* 7. LINHA CURTA "NÃO INCLUSO" */}
        {proposta.clausulaNaoIncluso && (
          <div className="text-[11px] text-zinc-400 bg-zinc-950/80 border border-zinc-800/60 rounded-none p-3.5 flex items-start gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-zinc-300">Não incluso:</strong> {proposta.clausulaNaoIncluso}
            </p>
          </div>
        )}

        {/* 8. CTA FINAL (ÚNICO LUGAR COM VERDE & BORDAS RETAS) */}
        <div className="pt-2">
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-none bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm sm:text-base transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <MessageCircle className="w-5 h-5 fill-black" />
            <span>Vamos iniciar o projeto</span>
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </a>
        </div>
      </main>
    </div>
  );
};
