import { Order, PharmacyInfo } from '../types/pharmacy';
import { formatCurrency } from './formatters';

export function buildWhatsAppOrderMessage(order: Order, pharmacy: PharmacyInfo): string {
  const lines: string[] = [];

  lines.push(`🟢 *NOVO PEDIDO - ${pharmacy.name.toUpperCase()}*`);
  lines.push(`📋 *Pedido:* #${order.orderNumber}`);
  lines.push(`👤 *Cliente:* ${order.customerName}`);
  lines.push(`📱 *Telefone:* ${order.customerPhone}`);
  if (order.customerCpf) {
    lines.push(`📄 *CPF:* ${order.customerCpf}`);
  }

  lines.push('');
  lines.push(`📦 *ITENS DO PEDIDO:*`);
  order.items.forEach((item, index) => {
    const rxTag = item.requiresPrescription ? ' ⚠️ [Receita Obrigatória]' : '';
    lines.push(
      `${index + 1}. *${item.quantity}x* ${item.productName}${rxTag} - ${formatCurrency(item.totalItemPrice)}`
    );
  });

  lines.push('');
  lines.push(`💰 *Subtotal:* ${formatCurrency(order.subtotal)}`);
  if (order.fulfillmentType === 'delivery') {
    const feeText = order.deliveryFee === 0 ? 'GRÁTIS' : formatCurrency(order.deliveryFee);
    lines.push(`🛵 *Taxa de Entrega:* ${feeText}`);
  } else {
    lines.push(`🏪 *Retirada:* Grátis no balcão`);
  }
  lines.push(`🏷️ *VALOR TOTAL:* ${formatCurrency(order.total)}`);

  lines.push('');
  if (order.fulfillmentType === 'delivery' && order.deliveryAddress) {
    lines.push(`📍 *ENDEREÇO DE ENTREGA:*`);
    lines.push(`${order.deliveryAddress.street}, nº ${order.deliveryAddress.number}`);
    if (order.deliveryAddress.complement) {
      lines.push(`Compl: ${order.deliveryAddress.complement}`);
    }
    lines.push(`Bairro: ${order.deliveryAddress.neighborhood} - ${order.deliveryAddress.city}`);
    if (order.deliveryAddress.referencePoint) {
      lines.push(`Ponto de ref.: ${order.deliveryAddress.referencePoint}`);
    }
  } else {
    lines.push(`🏪 *MODALIDADE:* Retirada na Farmácia`);
    lines.push(`Endereço da loja: ${pharmacy.addressStreet}, ${pharmacy.addressNumber} - ${pharmacy.addressNeighborhood}`);
  }

  lines.push('');
  lines.push(`💳 *FORMA DE PAGAMENTO:*`);
  lines.push(`• ${order.paymentMethodName}`);
  if (order.cashChangeFor) {
    const change = order.cashChangeFor - order.total;
    lines.push(`• Levar troco para ${formatCurrency(order.cashChangeFor)} (Troco: ${formatCurrency(Math.max(0, change))})`);
  }

  if (order.notes && order.notes.trim()) {
    lines.push('');
    lines.push(`📝 *Observações:* ${order.notes.trim()}`);
  }

  if (order.hasPrescriptionItems) {
    lines.push('');
    lines.push(`⚠️ *MEDICAMENTO COM RECEITA MÉDICA:*`);
    lines.push(`O pedido contém item(ns) sob controle. Por favor, envie a foto da receita médica aqui nesta conversa para avaliação do farmacêutico.`);
  }

  lines.push('');
  lines.push(`_Mensagem gerada pelo site da ${pharmacy.name}. Aguardo confirmação!_`);

  return lines.join('\n');
}

export function getWhatsAppUrl(order: Order, pharmacy: PharmacyInfo): string {
  // Strip non-digits from pharmacy whatsapp number
  const cleanPhone = pharmacy.whatsappNumber.replace(/\D/g, '');
  const message = buildWhatsAppOrderMessage(order, pharmacy);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
