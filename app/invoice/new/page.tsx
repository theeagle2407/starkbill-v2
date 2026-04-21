'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { InvoiceItem, Currency } from '@/lib/types';

const CORAL = '#EC796B';
const AMBER = '#F9A84D';
const MUTED = '#8888A8';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#F0F0F5';
const CARD = 'rgba(255,255,255,0.04)';

const emptyItem = (): InvoiceItem => ({
  description: '',
  quantity: 1,
  unitPrice: 0,
});

export default function NewInvoicePage() {
  const router = useRouter();

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderWallet, setSenderWallet] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [currency, setCurrency] = useState<Currency>('USDC');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const addItem = () => setItems([...items, emptyItem()]);
  const removeItem = (idx: number) =>
    setItems(items.filter((_, i) => i !== idx));

  const updateItem = (
    idx: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (
      !senderName ||
      !senderEmail ||
      !senderWallet ||
      !clientName ||
      !clientEmail ||
      !dueDate
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (items.some(i => !i.description || i.quantity <= 0 || i.unitPrice <= 0)) {
      setError('Please complete all line items.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const invoiceId = 'inv_' + Math.random().toString(36).substring(2, 10);

      const totalAmount = items.reduce(
        (s, i) => s + i.quantity * i.unitPrice,
        0
      );

      const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: invoiceId,
          invoiceNumber,
          senderName,
          senderEmail,
          senderWallet,
          clientName,
          clientEmail,
          items,
          currency,
          total: totalAmount,
          dueDate,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to create invoice');

      router.push(`/pay/${invoiceId}?created=true`);
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
      setSubmitting(false);
    }
  };

  const inp = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${BORDER}`,
    background: 'rgba(255,255,255,0.05)',
    color: TEXT,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const lbl = {
    display: 'block' as const,
    fontSize: '11px',
    fontWeight: '700' as const,
    color: MUTED,
    marginBottom: '6px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: TEXT }}>
      <header style={{ padding: '20px 40px', borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/">StarkBill</Link>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900' }}>New Invoice</h1>

        {error && <p style={{ color: CORAL }}>{error}</p>}

        <div style={{ background: CARD, padding: '20px', marginTop: '20px', borderRadius: '12px' }}>
          <input style={inp} placeholder="Your name" value={senderName} onChange={e => setSenderName(e.target.value)} />
          <input style={inp} placeholder="Your email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} />
          <input style={inp} placeholder="Wallet" value={senderWallet} onChange={e => setSenderWallet(e.target.value)} />
        </div>

        <div style={{ background: CARD, padding: '20px', marginTop: '20px', borderRadius: '12px' }}>
          <input style={inp} placeholder="Client name" value={clientName} onChange={e => setClientName(e.target.value)} />
          <input style={inp} placeholder="Client email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            marginTop: '30px',
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            background: submitting ? 'gray' : `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
            color: '#fff',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {submitting ? 'Creating...' : 'Create Invoice'}
        </button>
      </main>
    </div>
  );
}