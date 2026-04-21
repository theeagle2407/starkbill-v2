import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { Invoice, CreateInvoiceInput } from '@/lib/types';

// In-memory storage
const invoices: Invoice[] = [];

function generateInvoiceNumber(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${num}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ invoices: [] });
  }
  const filtered = invoices.filter(i => i.senderEmail === email);
  return NextResponse.json({ invoices: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateInvoiceInput = await req.json();
    const total = body.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const invoice: Invoice = {
      id: uuidv4(),
      invoiceNumber: generateInvoiceNumber(),
      senderName: body.senderName,
      senderEmail: body.senderEmail,
      senderWallet: body.senderWallet,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      items: body.items,
      currency: body.currency,
      total,
      dueDate: body.dueDate,
      status: 'pending',
      txHash: null,
      createdAt: new Date().toISOString(),
      paidAt: null,
      notes: body.notes,
    };

    invoices.push(invoice);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, txHash } = await req.json();
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    invoice.status = 'paid';
    invoice.txHash = txHash;
    invoice.paidAt = new Date().toISOString();
    return NextResponse.json({ invoice });
  } catch {
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}