import React, { useRef, useState } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  FileText, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  Receipt,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { AbaNavegacao, Cliente, PixConfig, BackupData, AsaasConfig } from '../types';

interface NavbarProps {
  abaAtiva: AbaNavegacao;
  onChangeAba: (aba: AbaNavegacao) => void;
  clientes: Cliente[];
  pixConfig: PixConfig;
  asaasConfig?: AsaasConfig;
  onOpenAsaasModal?: () => void;
  onOpenConfigFixaModal?: () => void;
  onImportBackup: (backup: BackupData) => void;
  onZerarDados?: () => void;
  onOpenNovoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  abaAtiva,
  onChangeAba,
  clientes,
  pixConfig,
  asaasConfig,
  onOpenAsaasModal,
  onOpenConfigFixaModal,
  onImportBackup,
  onZerarDados,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exportar Backup JSON
  const handleExportarBackup = () => {
    const backup: BackupData = {
      versao: '1.0',
      dataExportacao: new Date().toISOString(),
      clientes,
      pixConfig,
      asaasConfig
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    const dataHoje = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `girofy_backup_${dataHoje}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar Backup JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as BackupData;
        if (parsed && Array.isArray(parsed.clientes)) {
          if (window.confirm(`Deseja restaurar ${parsed.clientes.length} cliente(s) do arquivo de backup? Os dados atuais serão substituídos.`)) {
            onImportBackup(parsed);
          }
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo de backup.');
      }
    };
    reader.readAsText(fileObj);
    e.target.value = '';
  };

  const navItem = (aba: AbaNavegacao, label: string, IconComponent: React.ComponentType<{ className?: string }>) => {
    const isAtiva = abaAtiva === aba || (aba === 'clientes' && abaAtiva === 'detalhe');
    return (
      <button
        onClick={() => {
          onChangeAba(aba);
          setMobileMenuOpen(false);
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-all cursor-pointer ${
          isAtiva
            ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
        }`}
      >
        <IconComponent className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <header className="bg-black border-b border-zinc-800 sticky top-0 z-40 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo */}
          <div 
            onClick={() => onChangeAba('clientes')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-white flex items-center justify-center text-black font-extrabold text-sm sm:text-base">
              G
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold text-white tracking-wider block leading-tight">
                Girofy <span className="text-zinc-400 font-normal">Painel</span>
              </span>
            </div>
          </div>

          {/* Abas Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItem('clientes', 'Clientes', Users)}
            {navItem('visao_geral', 'Visão Geral', LayoutDashboard)}
            {navItem('gerar_proposta', 'Gerar Proposta', FileText)}
            {navItem('proposta_visual', 'Visualizar Proposta', Sparkles)}
          </nav>

          {/* Botões Utilitários Desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {onOpenConfigFixaModal && (
              <button
                onClick={onOpenConfigFixaModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
                title="Configurações Padrão Girofy"
              >
                <Settings className="w-3.5 h-3.5 text-[#E2E8F0]" />
                <span className="font-medium">Config. Padrão</span>
              </button>
            )}

            {onOpenAsaasModal && (
              <button
                onClick={onOpenAsaasModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
                title="Configurações Asaas & NF"
              >
                <Receipt className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-medium">Asaas &amp; NF</span>
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={handleExportarBackup}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
              title="Baixar backup dos dados"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
          </div>

          {/* Botão Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-zinc-800 space-y-2 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2">
              {navItem('clientes', 'Clientes', Users)}
              {navItem('visao_geral', 'Visão Geral', LayoutDashboard)}
              {navItem('gerar_proposta', 'Gerar Proposta', FileText)}
              {navItem('proposta_visual', 'Visualizar', Sparkles)}
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              {onOpenAsaasModal && (
                <button
                  onClick={() => {
                    onOpenAsaasModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Asaas &amp; NF</span>
                </button>
              )}

              <button
                onClick={() => {
                  handleExportarBackup();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


