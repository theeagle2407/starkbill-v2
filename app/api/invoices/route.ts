import { NextRequest, NextResponse } from 'next/server';
import { createInvoice } from '@/lib/invoices-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const id = body.id;

    const invoice = createInvoice({
      id,
      invoiceNumber: body.invoiceNumber,
      senderName: body.senderName,
      senderEmail: body.senderEmail,
      senderWallet: body.senderWallet,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      items: body.items,
      currency: body.currency,
      total: body.total,
      dueDate: body.dueDate,
      notes: body.notes,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      invoice,
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Something went wrong',
      },
      { status: 500 }
    );
  }
}