export type Currency = 'USDC' | 'STRK';
export type InvoiceStatus = 'pending' | 'paid' | 'overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  senderName: string;
  senderEmail: string;
  senderWallet: string;
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  currency: Currency;
  total: number;
  dueDate: string;
  status: InvoiceStatus;
  txHash: string | null;
  createdAt: string;
  paidAt: string | null;
  notes: string;
}

export interface CreateInvoiceInput {
  senderName: string;
  senderEmail: string;
  senderWallet: string;
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  currency: Currency;
  dueDate: string;
  notes: string;
}