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

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
          total,
          dueDate,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.error || 'Failed to create invoice'
        );
      }

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
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        color: TEXT,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          height: '60px',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: 'blur(20px)',
          background: 'rgba(10,10,15,0.9)',
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            fontWeight: 900,
            fontSize: '18px',
            color: TEXT,
          }}
        >
          Stark
          <span
            style={{
              background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Bill
          </span>
        </Link>

        <Link
          href="/dashboard"
          style={{
            color: MUTED,
            textDecoration: 'none',
            fontSize: '13px',
          }}
        >
          ← Dashboard
        </Link>
      </header>

      {/* MAIN */}
      <main
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 900,
              marginBottom: '6px',
            }}
          >
            New Invoice
          </h1>

          <p style={{ color: MUTED, fontSize: '14px' }}>
            Fill the details below and generate a payment link.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '18px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(236,121,107,0.08)',
              border: '1px solid rgba(236,121,107,0.2)',
              color: CORAL,
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* FROM */}
        <section
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: CORAL,
              letterSpacing: '1px',
              marginBottom: '18px',
            }}
          >
            FROM — YOUR DETAILS
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
            }}
          >
            <input
              style={inputStyle}
              placeholder="Your name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />

            <input
              style={inputStyle}
              type="email"
              placeholder="you@email.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <input
                style={inputStyle}
                placeholder="Your Starknet wallet address"
                value={senderWallet}
                onChange={(e) =>
                  setSenderWallet(e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* TO */}
        <section
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: CORAL,
              letterSpacing: '1px',
              marginBottom: '18px',
            }}
          >
            TO — CLIENT DETAILS
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
            }}
          >
            <input
              style={inputStyle}
              placeholder="Client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />

            <input
              style={inputStyle}
              type="email"
              placeholder="client@email.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
        </section>

        {/* DETAILS */}
        <section
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: CORAL,
              letterSpacing: '1px',
              marginBottom: '18px',
            }}
          >
            INVOICE DETAILS
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              marginBottom: '18px',
            }}
          >
            <select
              style={inputStyle}
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value as Currency)
              }
            >
              <option value="USDC">USDC</option>
              <option value="STRK">STRK</option>
            </select>

            <input
              style={inputStyle}
              type="date"
              value={dueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* ITEMS */}
          <div
            style={{
              fontSize: '12px',
              color: MUTED,
              marginBottom: '10px',
              fontWeight: 700,
            }}
          >
            LINE ITEMS
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 80px 120px 40px',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <input
                style={inputStyle}
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(
                    index,
                    'description',
                    e.target.value
                  )
                }
              />

              <input
                style={inputStyle}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    index,
                    'quantity',
                    Number(e.target.value)
                  )
                }
              />

              <input
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={item.unitPrice}
                onChange={(e) =>
                  updateItem(
                    index,
                    'unitPrice',
                    Number(e.target.value)
                  )
                }
              />

              <button
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                style={{
                  border: 'none',
                  borderRadius: '8px',
                  cursor:
                    items.length === 1
                      ? 'not-allowed'
                      : 'pointer',
                  background:
                    'rgba(255,255,255,0.06)',
                  color: TEXT,
                }}
              >
                ×
              </button>
            </div>
          ))}

          <button
            onClick={addItem}
            style={{
              marginTop: '8px',
              background: 'none',
              border: 'none',
              color: CORAL,
              cursor: 'pointer',
              fontWeight: 700,
              padding: 0,
            }}
          >
            + Add line item
          </button>

          {/* TOTAL */}
          <div
            style={{
              marginTop: '22px',
              paddingTop: '18px',
              borderTop: `1px solid ${BORDER}`,
              textAlign: 'right',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: MUTED,
                marginBottom: '4px',
              }}
            >
              TOTAL DUE
            </div>

            <div
              style={{
                fontSize: '28px',
                fontWeight: 900,
                background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {total.toFixed(2)} {currency}
            </div>
          </div>

          {/* NOTES */}
          <div style={{ marginTop: '18px' }}>
            <textarea
              style={{
                ...inputStyle,
                minHeight: '90px',
                resize: 'vertical',
              }}
              placeholder="Payment notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </section>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 800,
            cursor: submitting
              ? 'not-allowed'
              : 'pointer',
            color: '#fff',
            background: submitting
              ? 'rgba(236,121,107,0.4)'
              : `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
          }}
        >
          {submitting
            ? 'Creating invoice...'
            : 'Create invoice'}
        </button>
      </main>
    </div>
  );
}