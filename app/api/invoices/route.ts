import { NextResponse } from 'next/server';
import { createInvoice, getInvoice } from '@/lib/invoice-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const invoice = createInvoice({
      ...body,
      status: 'pending',
    });

    return NextResponse.json({ success: true, invoice });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}