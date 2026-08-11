/**
 * Formata um valor numérico para a moeda brasileira (BRL)
 * Exemplo: 1234.56 -> "R$ 1.234,56"
 */
export function formatarMoeda(valor: number): string {
  if (isNaN(valor) || valor === null || valor === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Formata uma string de data (YYYY-MM-DD ou ISO string) para o formato brasileiro DD/MM/AAAA
 */
export function formatarDataBR(dataIsoOuYmd?: string): string {
  if (!dataIsoOuYmd) return '-';
  try {
    const partes = dataIsoOuYmd.split('T')[0].split('-');
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    }
    const d = new Date(dataIsoOuYmd);
    if (isNaN(d.getTime())) return dataIsoOuYmd;
    return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  } catch {
    return dataIsoOuYmd;
  }
}

/**
 * Retorna a quantidade de dias passados desde a data especificada (YYYY-MM-DD) até hoje
 */
export function calcularDiasPassados(dataYmd: string): number {
  if (!dataYmd) return 0;
  try {
    const [ano, mes, dia] = dataYmd.split('T')[0].split('-').map(Number);
    const dataInicial = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    // Zerar horas para comparar apenas datas
    hoje.setHours(0, 0, 0, 0);
    dataInicial.setHours(0, 0, 0, 0);

    const diffTempo = hoje.getTime() - dataInicial.getTime();
    const diffDias = Math.floor(diffTempo / (1000 * 3600 * 24));
    return diffDias > 0 ? diffDias : 0;
  } catch {
    return 0;
  }
}

/**
 * Normaliza um número de telefone/whatsapp removendo caracteres não numéricos
 */
export function limparApenasNumeros(valor: string): string {
  return valor.replace(/\D/g, '');
}

/**
 * Formata um número de telefone para formato legível de celular no Brasil
 * Ex: 11999998888 -> (11) 99999-8888
 */
export function formatarTelefoneBR(valor: string): string {
  const nums = limparApenasNumeros(valor);
  if (nums.length === 11) {
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  }
  if (nums.length === 10) {
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
  }
  return valor;
}

/**
 * Converte número para link do WhatsApp wa.me
 */
export function gerarLinkWhatsApp(numero: string, mensagem?: string): string {
  let nums = limparApenasNumeros(numero);
  if (!nums) return '#';
  if (!nums.startsWith('55') && (nums.length === 10 || nums.length === 11)) {
    nums = '55' + nums;
  }
  const urlMsg = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${nums}${urlMsg}`;
}
