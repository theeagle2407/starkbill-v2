import { NextResponse } from 'next/server';
import { createInvoice } from '@/lib/invoice-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // basic validation (important)
    if (!body?.id || !body?.senderName || !body?.clientName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const invoice = createInvoice({
      ...body,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}