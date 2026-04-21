import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT: server key
);

function generateInvoiceNumber() {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${num}`;
}

// GET invoices by email
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ invoices: [] });
  }

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('sender_email', email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ invoices: data });
}

// CREATE invoice
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const total = body.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0
    );

    const invoice = {
      id: uuidv4(),
      invoice_number: generateInvoiceNumber(),
      sender_name: body.senderName,
      sender_email: body.senderEmail,
      sender_wallet: body.senderWallet,
      client_name: body.clientName,
      client_email: body.clientEmail,
      items: body.items,
      currency: body.currency,
      total,
      due_date: body.dueDate,
      status: 'pending',
      tx_hash: null,
      notes: body.notes,
      created_at: new Date().toISOString(),
      paid_at: null,
    };

    const { error } = await supabase.from('invoices').insert(invoice);

    if (error) throw error;

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

// UPDATE payment status
export async function PATCH(req: NextRequest) {
  try {
    const { id, txHash } = await req.json();

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        tx_hash: txHash,
        paid_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ invoice: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update invoice' },
      { status: 500 }
    );
  }
}