export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateIso: string): string {
  try {
    const d = new Date(dateIso);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateIso;
  }
}

export function generateOrderNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `FVS-${randomDigits}`;
}
