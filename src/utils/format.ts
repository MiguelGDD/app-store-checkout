export function formatCurrency(value: number): string {
  return `COP ${Math.round(value).toLocaleString('es-CO')}`;
}

export function formatQuantity(quantity: number): string {
  return `${quantity} item${quantity === 1 ? '' : 's'}`;
}

export function formatOrderNumber(count: number): string {
  return `SC-${String(count).padStart(3, '0')}`;
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
