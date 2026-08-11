import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ClientesList } from './components/ClientesList';
import { ClienteDetalhe } from './components/ClienteDetalhe';
import { VisaoGeral } from './components/VisaoGeral';
import { GerarProposta } from './components/GerarProposta';
import { PropostaVisual } from './components/PropostaVisual';
import { NovoClienteModal } from './components/NovoClienteModal';
import { PixModal } from './components/PixModal';
import { AsaasConfigModal } from './components/AsaasConfigModal';
import { ConfiguracoesFixasModal } from './components/ConfiguracoesFixasModal';

import { Cliente, AbaNavegacao, PixConfig, BackupData, AsaasConfig, PropostaVisualData, ConfiguracaoFixaGirofy } from './types';
import { CLIENTES_INICIAIS, PIX_CONFIG_INICIAL, CONFIG_FIXA_INICIAL } from './data/initialData';
import { Download } from 'lucide-react';

const LOCAL_STORAGE_CLIENTES_KEY = 'girofy_clientes_v1';
const LOCAL_STORAGE_PIX_KEY = 'girofy_pix_config_v1';
const LOCAL_STORAGE_ASAAS_KEY = 'girofy_asaas_config_v1';
const LOCAL_STORAGE_CONFIG_FIXA_KEY = 'girofy_config_fixa_v1';

export default function App() {
  // Estado de Clientes com inicialização via LocalStorage
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    try {
      const salvo = localStorage.getItem(LOCAL_STORAGE_CLIENTES_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler clientes do localStorage', e);
    }
    return CLIENTES_INICIAIS;
  });

  // Estado de Configuração do PIX com inicialização via LocalStorage
  const [pixConfig, setPixConfig] = useState<PixConfig>(() => {
    try {
      const salvo = localStorage.getItem(LOCAL_STORAGE_PIX_KEY);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch (e) {
      console.error('Erro ao ler pixConfig do localStorage', e);
    }
    return PIX_CONFIG_INICIAL;
  });

  // Estado de Configuração Fixa Girofy com LocalStorage
  const [configFixa, setConfigFixa] = useState<ConfiguracaoFixaGirofy>(() => {
    try {
      const salvo = localStorage.getItem(LOCAL_STORAGE_CONFIG_FIXA_KEY);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch (e) {
      console.error('Erro ao ler configFixa do localStorage', e);
    }
    return CONFIG_FIXA_INICIAL;
  });

  // Estado de Configuração do Asaas & Nota Fiscal
  const [asaasConfig, setAsaasConfig] = useState<AsaasConfig>(() => {
    try {
      const salvo = localStorage.getItem(LOCAL_STORAGE_ASAAS_KEY);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch (e) {
      console.error('Erro ao ler asaasConfig do localStorage', e);
    }
    return {
      apiKey: '',
      ambiente: 'sandbox',
      emissaoNotaFiscalAuto: true,
      razaoSocialEmitente: 'Girofy Software & Tecnologia Ltda',
      cnpjEmitente: '34.567.890/0001-12',
      emailNotificacao: 'financeiro@girofy.com.br'
    };
  });

  // Estado para proposta customizada via Hash URL ou gerador
  const [propostaUrlCustom, setPropostaUrlCustom] = useState<PropostaVisualData | undefined>(undefined);

  // Controle de Navegação e Modais
  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>('clientes');
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string | null>(null);

  const [novoClienteModalOpen, setNovoClienteModalOpen] = useState(false);
  const [asaasModalOpen, setAsaasModalOpen] = useState(false);
  const [configFixaModalOpen, setConfigFixaModalOpen] = useState(false);

  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [pixModalValue, setPixModalValue] = useState(0);
  const [pixModalEmpresa, setPixModalEmpresa] = useState('');

  // Sincronização Automática com LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CLIENTES_KEY, JSON.stringify(clientes));
    } catch (e) {
      console.error('Erro ao salvar clientes no localStorage', e);
    }
  }, [clientes]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PIX_KEY, JSON.stringify(pixConfig));
    } catch (e) {
      console.error('Erro ao salvar pixConfig no localStorage', e);
    }
  }, [pixConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ASAAS_KEY, JSON.stringify(asaasConfig));
    } catch (e) {
      console.error('Erro ao salvar asaasConfig no localStorage', e);
    }
  }, [asaasConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CONFIG_FIXA_KEY, JSON.stringify(configFixa));
    } catch (e) {
      console.error('Erro ao salvar configFixa no localStorage', e);
    }
  }, [configFixa]);

  // Verificar se há uma proposta no Hash da URL (#proposta=...)
  useEffect(() => {
    const parseHashUrl = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('proposta=')) {
        try {
          const encoded = hash.split('proposta=')[1];
          const jsonStr = decodeURIComponent(atob(encoded));
          const parsedProp = JSON.parse(jsonStr) as PropostaVisualData;
          if (parsedProp && parsedProp.nomeClienteEmpresa) {
            setPropostaUrlCustom(parsedProp);
            setAbaAtiva('proposta_visual');
          }
        } catch (e) {
          console.error('Erro ao decodificar proposta da URL', e);
        }
      }
    };
    parseHashUrl();
    window.addEventListener('hashchange', parseHashUrl);
    return () => window.removeEventListener('hashchange', parseHashUrl);
  }, []);

  // Handler de Novo Cliente
  const handleSaveNovoCliente = (
    dadosCliente: Omit<Cliente, 'id' | 'criadoEm' | 'atualizadoEm'>
  ) => {
    const agoraIso = new Date().toISOString();
    const novoCliente: Cliente = {
      ...dadosCliente,
      id: `cli-${Date.now()}`,
      criadoEm: agoraIso,
      atualizadoEm: agoraIso,
    };

    setClientes((prev) => [novoCliente, ...prev]);
    setClienteSelecionadoId(novoCliente.id);
    setAbaAtiva('detalhe');
  };

  // Handler de Atualização de Cliente
  const handleUpdateCliente = (clienteAtualizado: Cliente) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === clienteAtualizado.id ? clienteAtualizado : c))
    );
  };

  // Handler de Exclusão de Cliente
  const handleDeleteCliente = (id: string) => {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    setClienteSelecionadoId(null);
    setAbaAtiva('clientes');
  };

  // Selecionar Cliente e Abrir Tela de Detalhes
  const handleSelectCliente = (id: string) => {
    setClienteSelecionadoId(id);
    setAbaAtiva('detalhe');
  };

  // Abrir Modal de QR Code PIX a partir de um Cliente ou Valor
  const handleAbrirPixModal = (valor: number, empresa: string) => {
    setPixModalValue(valor);
    setPixModalEmpresa(empresa);
    setPixModalOpen(true);
  };

  // Confirmar Pagamento do Cliente Ativo via Modal PIX
  const handleConfirmarPagamentoPixModal = () => {
    if (!clienteSelecionadoId) return;
    const hojeYMD = new Date().toISOString().split('T')[0];

    setClientes((prev) =>
      prev.map((c) => {
        if (c.id === clienteSelecionadoId) {
          return {
            ...c,
            status: 'pago_em_producao',
            dataPagamento: c.dataPagamento || hojeYMD,
            atualizadoEm: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  // Importar Backup
  const handleImportBackup = (backup: BackupData) => {
    if (backup.clientes) {
      setClientes(backup.clientes);
    }
    if (backup.pixConfig) {
      setPixConfig(backup.pixConfig);
    }
    if (backup.asaasConfig) {
      setAsaasConfig(backup.asaasConfig);
    }
    setAbaAtiva('clientes');
  };

  // Zerar Tudo (Resetar Dados do Sistema)
  const handleZerarDados = () => {
    if (window.confirm('Tem certeza de que deseja ZERAR todos os dados do sistema? Esta ação limpará todos os clientes cadastrados.')) {
      setClientes([]);
      setPixConfig(PIX_CONFIG_INICIAL);
      localStorage.removeItem(LOCAL_STORAGE_CLIENTES_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PIX_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ASAAS_KEY);
      setAbaAtiva('clientes');
      setClienteSelecionadoId(null);
    }
  };

  const clienteAtual = clientes.find((c) => c.id === clienteSelecionadoId);

  // Se a aba for proposta_visual, renderizar PropostaVisual de tela cheia
  if (abaAtiva === 'proposta_visual') {
    return (
      <div className="min-h-screen bg-black">
        <PropostaVisual
          propostaCustomizada={propostaUrlCustom}
          onVoltarPainel={() => {
            window.location.hash = '';
            setPropostaUrlCustom(undefined);
            setAbaAtiva('clientes');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#F4F4F5] font-sans antialiased selection:bg-[#E2E8F0] selection:text-black flex flex-col">
      {/* Top Navbar */}
      <Navbar
        abaAtiva={abaAtiva}
        onChangeAba={(novaAba) => {
          setAbaAtiva(novaAba);
          if (novaAba !== 'detalhe') {
            setClienteSelecionadoId(null);
          }
        }}
        clientes={clientes}
        pixConfig={pixConfig}
        asaasConfig={asaasConfig}
        onOpenAsaasModal={() => setAsaasModalOpen(true)}
        onOpenConfigFixaModal={() => setConfigFixaModalOpen(true)}
        onImportBackup={handleImportBackup}
        onZerarDados={handleZerarDados}
        onOpenNovoModal={() => setNovoClienteModalOpen(true)}
      />

      {/* Conteúdo Principal da Tela */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {abaAtiva === 'clientes' && (
          <ClientesList
            clientes={clientes}
            onSelectCliente={handleSelectCliente}
            onOpenNovoModal={() => setNovoClienteModalOpen(true)}
          />
        )}

        {abaAtiva === 'detalhe' && clienteAtual && (
          <ClienteDetalhe
            cliente={clienteAtual}
            onVoltar={() => {
              setAbaAtiva('clientes');
              setClienteSelecionadoId(null);
            }}
            onUpdateCliente={handleUpdateCliente}
            onDeleteCliente={handleDeleteCliente}
            onAbrirPixModal={handleAbrirPixModal}
            pixConfig={pixConfig}
          />
        )}

        {abaAtiva === 'detalhe' && !clienteAtual && (
          <div className="text-center py-12">
            <p className="text-sm text-[#9C958A] mb-4">Cliente não encontrado ou removido.</p>
            <button
              onClick={() => setAbaAtiva('clientes')}
              className="bg-[#E2E8F0] hover:bg-white text-black font-semibold px-4 py-2 rounded text-xs cursor-pointer"
            >
              Voltar para Clientes
            </button>
          </div>
        )}

        {abaAtiva === 'visao_geral' && (
          <VisaoGeral
            clientes={clientes}
            onSelectCliente={handleSelectCliente}
          />
        )}

        {abaAtiva === 'gerar_proposta' && (
          <GerarProposta
            clientes={clientes}
            configFixa={configFixa}
            onOpenConfigFixaModal={() => setConfigFixaModalOpen(true)}
            onVisualizarProposta={(prop) => {
              setPropostaUrlCustom(prop);
              setAbaAtiva('proposta_visual');
            }}
          />
        )}
      </main>

      {/* Mobile Footer Quick Export Bar */}
      <footer className="border-t border-[#27272A] bg-[#0A0908] py-4 text-center text-xs text-[#9C958A] mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Girofy Painel • Automação B2B, Gestão de Clientes &amp; Faturamento Asaas</span>
          <div className="flex items-center gap-4 md:hidden text-[11px] text-[#E2E8F0]">
            <button 
              onClick={() => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ versao: '1.0', clientes, pixConfig, asaasConfig }, null, 2));
                const a = document.createElement('a');
                a.href = dataStr;
                a.download = `girofy_backup_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Download className="w-3 h-3" />
              Exportar Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Modais Globais */}
      <ConfiguracoesFixasModal
        isOpen={configFixaModalOpen}
        onClose={() => setConfigFixaModalOpen(false)}
        configFixa={configFixa}
        onSaveConfigFixa={(novaConfig) => setConfigFixa(novaConfig)}
      />

      <NovoClienteModal
        isOpen={novoClienteModalOpen}
        onClose={() => setNovoClienteModalOpen(false)}
        onSave={handleSaveNovoCliente}
      />

      <AsaasConfigModal
        isOpen={asaasModalOpen}
        onClose={() => setAsaasModalOpen(false)}
        asaasConfig={asaasConfig}
        onSaveAsaasConfig={(novaConfig) => setAsaasConfig(novaConfig)}
      />

      <PixModal
        isOpen={pixModalOpen}
        onClose={() => setPixModalOpen(false)}
        valorPadrao={pixModalValue}
        nomeEmpresa={pixModalEmpresa}
        pixConfig={pixConfig}
        onSavePixConfig={(novaConfig) => setPixConfig(novaConfig)}
        onConfirmarPagamento={handleConfirmarPagamentoPixModal}
      />
    </div>
  );
}

