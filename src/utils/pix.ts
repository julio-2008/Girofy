/**
 * Utilitário para geração do código PIX "Copia e Cola" (Padrão EMV BR Code do Banco Central)
 */

function crc16CCITT(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatTLV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function removerAcentos(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .toUpperCase();
}

export function gerarPayloadPix(
  chavePix: string,
  valor: number,
  nomeBeneficiario: string = 'GIROFY',
  cidadeBeneficiario: string = 'SAO PAULO'
): string {
  const chaveLimpa = chavePix.trim();
  if (!chaveLimpa) return '';

  const valorFormatado = valor > 0 ? valor.toFixed(2) : '';

  // 00 Payload Format Indicator
  const pfi = formatTLV('00', '01');

  // 01 Point of Initiation Method (12 = dinâmico ou reutilizável)
  const pim = formatTLV('01', '12');

  // 26 Merchant Account Information (PIX)
  const gui = formatTLV('00', 'br.gov.bcb.pix');
  const key = formatTLV('01', chaveLimpa);
  const merchantAccount = formatTLV('26', `${gui}${key}`);

  // 52 Merchant Category Code (0000 = Geral)
  const mcc = formatTLV('52', '0000');

  // 53 Transaction Currency (986 = BRL)
  const currency = formatTLV('53', '986');

  // 54 Transaction Amount
  const amountStr = valorFormatado ? formatTLV('54', valorFormatado) : '';

  // 58 Country Code
  const country = formatTLV('58', 'BR');

  // 59 Merchant Name (Máximo 25 caracteres)
  const nomeLimpo = removerAcentos(nomeBeneficiario || 'GIROFY').slice(0, 25);
  const merchantName = formatTLV('59', nomeLimpo || 'GIROFY');

  // 60 Merchant City (Máximo 15 caracteres)
  const cidadeLimpa = removerAcentos(cidadeBeneficiario || 'SAO PAULO').slice(0, 15);
  const merchantCity = formatTLV('60', cidadeLimpa || 'SAO PAULO');

  // 62 Additional Data Field Template (TxID = ***)
  const txid = formatTLV('05', '***');
  const additionalData = formatTLV('62', txid);

  // String parcial sem o CRC16
  const payloadParcial = `${pfi}${pim}${merchantAccount}${mcc}${currency}${amountStr}${country}${merchantName}${merchantCity}${additionalData}6304`;

  // Calcular CRC16
  const crc = crc16CCITT(payloadParcial);

  return `${payloadParcial}${crc}`;
}
