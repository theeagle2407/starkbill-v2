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

const STORAGE_KEY = 'starkbill_invoices';

function getAll(): Record<string, Invoice> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveAll(data: Record<string, Invoice>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createInvoice(invoice: Invoice) {
  const store = getAll();
  store[invoice.id] = invoice;
  saveAll(store);
  return invoice;
}

export function getInvoice(id: string) {
  const store = getAll();
  return store[id] || null;
}

export function updateInvoice(id: string, data: Partial<Invoice>) {
  const store = getAll();
  if (!store[id]) return null;
  store[id] = { ...store[id], ...data };
  saveAll(store);
  return store[id];
}