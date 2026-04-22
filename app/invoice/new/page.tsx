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

const emptyItem = (): InvoiceItem => ({ description: '', quantity: 1, unitPrice: 0 });

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
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
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

  setSubmitting(true);
  setError('');

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

    // ✅ SAFE JSON HANDLING
    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('Server did not return JSON');
    }

    if (!res.ok || !data.success) {
      throw new Error(data?.error || 'Failed to create invoice');
    }

    router.push(`/pay/${invoiceId}`);
  } catch (err: any) {
    setError(err.message || 'Failed to create invoice');
    setSubmitting(false);
  }
}

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${BORDER}`,
    background: 'rgba(255,255,255,0.05)',
    color: TEXT,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: TEXT, fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.9)', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: '18px', fontWeight: '800', color: TEXT }}>
          Stark<span style={{ background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bill</span>
        </Link>
        <Link href="/dashboard" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}>← Dashboard</Link>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '4px' }}>New Invoice</h1>
          <p style={{ fontSize: '13px', color: MUTED }}>Fill in the details to create and share your invoice.</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(236,121,107,0.08)', border: '1px solid rgba(236,121,107,0.2)', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', color: CORAL }}>
            {error}
          </div>
        )}

        <div style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, padding: '24px', marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: CORAL, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '18px' }}>FROM — Your Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', fontWeight: '600' }}>Your name *</div>
              <input style={inp} value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Jane Smith" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', fontWeight: '600' }}>Your email *</div>
              <input style={inp} type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', fontWeight: '600' }}>Your Starknet wallet address *</div>
              <input style={inp} value={senderWallet} onChange={e => setSenderWallet(e.target.value)} placeholder="0x..." />
            </div>
          </div>
        </div>

        <div style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, padding: '24px', marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: CORAL, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '18px' }}>TO — Client Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', fontWeight: '600' }}>Client name *</div>
              <input style={inp} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', fontWeight: '600' }}>Client email *</div>
              <input style={inp} type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@example.com" />
            </div>
          </div>
        </div>

        <div style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, padding: '24px', marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: CORAL, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '18px' }}>INVOICE DETAILS</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', fontWeight: '600' }}>Currency *</div>
              <select style={inp} value={currency} onChange={e => setCurrency(e.target.value as Currency)}>
                <option value="USDC">USDC</option>
                <option value="STRK">STRK</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', fontWeight: '600' }}>Due date *</div>
              <input style={inp} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div style={{ fontSize: '12px', color: MUTED, fontWeight: '600', marginBottom: '10px' }}>Line items *</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 32px', gap: '8px', marginBottom: '8px' }}>
            {['Description', 'Qty', 'Unit price', ''].map(h => (
              <div key={h} style={{ fontSize: '11px', color: MUTED, fontWeight: '700' }}>{h}</div>
            ))}
          </div>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 32px', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
              <input style={inp} value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Service or product" />
              <input style={inp} type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)} />
              <input style={inp} type="number" min="0" step="0.01" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)} placeholder="0.00" />
              <button onClick={() => removeItem(idx)} disabled={items.length === 1}
                style={{ background: 'none', border: 'none', cursor: items.length === 1 ? 'not-allowed' : 'pointer', color: MUTED, fontSize: '20px', opacity: items.length === 1 ? 0.3 : 1, padding: 0 }}>×</button>
            </div>
          ))}
          <button onClick={addItem} style={{ marginTop: '6px', fontSize: '13px', color: CORAL, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', padding: 0 }}>
            + Add line item
          </button>

          <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: MUTED, fontWeight: '700', letterSpacing: '0.5px', marginBottom: '4px' }}>TOTAL DUE</div>
              <div style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {total.toFixed(2)} {currency}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px', fontWeight: '600' }}>Notes (optional)</div>
            <textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms or additional info..." />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={submitting}
          style={{ width: '100%', padding: '14px', background: submitting ? 'rgba(236,121,107,0.4)' : `linear-gradient(135deg, ${CORAL}, ${AMBER})`, color: '#fff', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? 'Creating invoice...' : 'Create invoice'}
        </button>
      </main>
    </div>
  );
}