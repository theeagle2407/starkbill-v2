type Invoice = {
  id: string;
  invoiceNumber: string;
  senderName: string;
  senderEmail: string;
  senderWallet: string;
  clientName: string;
  clientEmail: string;
  items: any[];
  currency: string;
  total: number;
  dueDate: string;
  notes?: string;
  status: 'pending' | 'paid';
  tx_hash?: string;
};

const store: Record<string, Invoice> = {};

export function createInvoice(invoice: Invoice) {
  store[invoice.id] = invoice;
  return invoice;
}

export function getInvoice(id: string) {
  return store[id] || null;
}

export function updateInvoice(id: string, data: Partial<Invoice>) {
  if (!store[id]) return null;
  store[id] = { ...store[id], ...data };
  return store[id];
}