'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { InvoiceItem, Currency } from '@/lib/types';
import { createInvoice } from '@/lib/invoice-store';

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

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const addItem = () => {
    setItems((prev) => [...prev, emptyItem()]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    setError('');

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

    if (
      items.some(
        (item) =>
          !item.description ||
          item.quantity <= 0 ||
          item.unitPrice <= 0
      )
    ) {
      setError('Please complete all line items.');
      return;
    }

    setSubmitting(true);

    try {
      const invoiceId =
        'inv_' + Math.random().toString(36).substring(2, 10);

      const invoiceNumber = `INV-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const payload = {
        id: invoiceId,
        invoiceNumber,
        senderName,
        senderEmail,
        senderWallet,
        clientName,
        clientEmail,
        items,
        currency,
        total,
        dueDate,
        notes,
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || 'Failed to create invoice');
      }

      // optional store
      createInvoice({
        ...payload,
        status: 'pending',
      });

      // localStorage save
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(
          localStorage.getItem('starkbill_invoices') || '{}'
        );

        existing[invoiceId] = payload;

        localStorage.setItem(
          'starkbill_invoices',
          JSON.stringify(existing)
        );
      }

      // redirect ONCE (clean)
      router.push(`/pay/${invoiceId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
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
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: TEXT }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          height: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          borderBottom: `1px solid ${BORDER}`,
          background: 'rgba(10,10,15,0.9)',
        }}
      >
        <Link href="/" style={{ color: TEXT, fontWeight: 900 }}>
          Stark<span style={{ color: CORAL }}>Bill</span>
        </Link>

        <Link href="/dashboard" style={{ color: MUTED }}>
          Dashboard
        </Link>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>New Invoice</h1>

        {error && (
          <p style={{ color: CORAL, marginTop: 10 }}>{error}</p>
        )}

        {/* FORM (kept minimal for clarity) */}

        <div style={{ marginTop: 20 }}>
          <input
            style={inputStyle}
            placeholder="Your name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />

          <input
            style={{ ...inputStyle, marginTop: 10 }}
            placeholder="Your email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
          />

          <input
            style={{ ...inputStyle, marginTop: 10 }}
            placeholder="Wallet"
            value={senderWallet}
            onChange={(e) => setSenderWallet(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            marginTop: 20,
            width: '100%',
            padding: 14,
            borderRadius: 10,
            border: 'none',
            color: '#fff',
            background: submitting
              ? '#444'
              : `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
          }}
        >
          {submitting ? 'Creating...' : 'Create invoice'}
        </button>
      </main>
    </div>
  );
}