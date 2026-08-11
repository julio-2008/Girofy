import React, { useState, useEffect } from 'react';
import { X, Settings, Plus, Trash2, Check, Gift, ShieldAlert, Code2 } from 'lucide-react';
import { ConfiguracaoFixaGirofy, ItemBonusFixo } from '../types';

interface ConfiguracoesFixasModalProps {
  isOpen: boolean;
  onClose: () => void;
  configFixa: ConfiguracaoFixaGirofy;
  onSaveConfigFixa: (novaConfig: ConfiguracaoFixaGirofy) => void;
}

export const ConfiguracoesFixasModal: React.FC<ConfiguracoesFixasModalProps> = ({
  isOpen,
  onClose,
  configFixa,
  onSaveConfigFixa,
}) => {
  const [bonusList, setBonusList] = useState<ItemBonusFixo[]>(configFixa.bonusPadrao);
  const [seoItens, setSeoItens] = useState<string[]>(configFixa.seoTecnicoIncluso);
  const [clausulaNaoIncluso, setClausulaNaoIncluso] = useState<string>(configFixa.clausulaNaoIncluso);
  const [corDestaque, setCorDestaque] = useState<string>(configFixa.corDestaque || '#10B981');
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBonusList(configFixa.bonusPadrao);
      setSeoItens(configFixa.seoTecnicoIncluso);
      setClausulaNaoIncluso(configFixa.clausulaNaoIncluso);
      setCorDestaque(configFixa.corDestaque || '#10B981');
      setSalvo(false);
    }
  }, [isOpen, configFixa]);

  if (!isOpen) return null;

  const handleAddBonus = () => {
    setBonusList((prev) => [
      ...prev,
      {
        id: `bonus-fixo-${Date.now()}`,
        titulo: 'Novo Bônus Padrão',
        valorEstimado: 500,
        descricao: 'Descrição do bônus padrão incluso.',
      },
    ]);
  };

  const handleRemoveBonus = (id: string) => {
    setBonusList((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateBonus = (id: string, campo: keyof ItemBonusFixo, valor: any) => {
    setBonusList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [campo]: valor } : b))
    );
  };

  const handleAddSeoItem = () => {
    setSeoItens((prev) => [...prev, 'Novo item de SEO']);
  };

  const handleUpdateSeoItem = (index: number, valor: string) => {
    setSeoItens((prev) => {
      const copy = [...prev];
      copy[index] = valor;
      return copy;
    });
  };

  const handleRemoveSeoItem = (index: number) => {
    setSeoItens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfigFixa({
      bonusPadrao: bonusList,
      seoTecnicoIncluso: seoItens.filter((item) => item.trim().length > 0),
      clausulaNaoIncluso,
      corDestaque,
    });
    setSalvo(true);
    setTimeout(() => {
      setSalvo(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 rounded-none max-w-2xl w-full p-4 sm:p-6 space-y-5 my-8 text-xs relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-white" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Configurações Padrão (Fixas) Girofy
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-none hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-zinc-400">
          Estes itens são preenchidos uma vez e ficam salvos no sistema. Não precisam ser reeditados a cada nova proposta por cliente.
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          {/* 1. Os 4 Bônus Padrão */}
          <div className="space-y-3 bg-zinc-900/60 border border-zinc-800/80 rounded-none p-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-white" />
                <span>Bônus Padrão Inclusos no Pacote</span>
              </h3>
              <button
                type="button"
                onClick={handleAddBonus}
                className="px-2 py-1 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-none text-white text-[10px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar Bônus</span>
              </button>
            </div>

            <div className="space-y-3">
              {bonusList.map((bonus, idx) => (
                <div
                  key={bonus.id}
                  className="bg-black border border-zinc-800 rounded-none p-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-zinc-500">Bônus #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBonus(bonus.id)}
                      className="text-zinc-500 hover:text-white p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        value={bonus.titulo}
                        onChange={(e) => handleUpdateBonus(bonus.id, 'titulo', e.target.value)}
                        placeholder="Título do Bônus"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-none px-2.5 py-1.5 text-white font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        required
                        value={bonus.valorEstimado}
                        onChange={(e) => handleUpdateBonus(bonus.id, 'valorEstimado', Number(e.target.value))}
                        placeholder="Valor R$"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-none px-2.5 py-1.5 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={bonus.descricao}
                    onChange={(e) => handleUpdateBonus(bonus.id, 'descricao', e.target.value)}
                    placeholder="Descrição do bônus..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-none px-2.5 py-1.5 text-zinc-400 text-[11px] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 2. SEO Técnico Incluso */}
          <div className="space-y-3 bg-zinc-900/60 border border-zinc-800/80 rounded-none p-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-white" />
                <span>Itens do SEO Técnico Incluso</span>
              </h3>
              <button
                type="button"
                onClick={handleAddSeoItem}
                className="px-2 py-1 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-none text-white text-[10px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {seoItens.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-black border border-zinc-800 rounded-none px-2.5 py-1.5">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateSeoItem(idx, e.target.value)}
                    className="w-full bg-transparent text-white focus:outline-none text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSeoItem(idx)}
                    className="text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Cláusula O Que Não Está Incluso */}
          <div className="space-y-2 bg-zinc-900/60 border border-zinc-800/80 rounded-none p-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-zinc-800/80 pb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
              <span>Cláusula "O Que Não Está Incluso"</span>
            </h3>

            <textarea
              rows={2}
              value={clausulaNaoIncluso}
              onChange={(e) => setClausulaNaoIncluso(e.target.value)}
              placeholder="Ex: Tráfego pago, produção de conteúdo e integrações com ERPs legados..."
              className="w-full bg-black border border-zinc-800 rounded-none p-2.5 text-zinc-300 focus:outline-none text-[11px]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-none bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-none bg-[#E2E8F0] hover:bg-white text-black font-extrabold flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              {salvo ? <Check className="w-4 h-4" /> : null}
              <span>{salvo ? 'Salvo!' : 'Salvar Configurações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
