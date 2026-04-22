import { NextResponse } from 'next/server';
import { getInvoice } from '@/lib/invoice-store';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const invoice = getInvoice(params.id);

  if (!invoice) {
    return NextResponse.json(
      { success: false, error: 'Invoice not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    invoice,
  });
}