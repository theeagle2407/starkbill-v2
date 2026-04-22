import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ SERVER-SIDE CLIENT (secure)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ GET SINGLE INVOICE
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'Invoice not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

// ✅ UPDATE INVOICE (after payment)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const { status, tx_hash } = body;

  const { data, error } = await supabase
    .from('invoices')
    .update({
      status,
      tx_hash,
      paid_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}