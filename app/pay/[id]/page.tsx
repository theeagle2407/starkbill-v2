'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { payWithStarkzap } from '@/lib/starkzap';
import { getInvoice } from '@/lib/invoice-store';

const CORAL = '#EC796B';
const AMBER = '#F9A84D';
const MUTED = '#8888A8';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#F0F0F5';
const CARD = 'rgba(255,255,255,0.04)';

export default function PayPage() {
  const { id } = useParams<{ id: string }>();

  const [invoice, setInvoice] = useState<any>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(true);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] =
    useState<'idle' | 'success' | 'failed'>('idle');

  const [txHash, setTxHash] = useState<string | null>(null);

  // Load invoice from URL (your current system)
  useEffect(() => {
  if (!id) {
    setInvoice(null);
    setLoadingInvoice(false);
    return;
  }

  const load = () => {
    try {
      const store = localStorage.getItem('starkbill_invoices');

      if (!store) {
        setInvoice(null);
        setLoadingInvoice(false);
        return;
      }

      const parsedStore = JSON.parse(store);

      const found = parsedStore?.[id as string];

      setInvoice(found || null);
    } catch (err) {
      console.error('LocalStorage error:', err);
      setInvoice(null);
    }

    setLoadingInvoice(false);
  };

  // 🔥 IMPORTANT: delay until client is ready
  if (typeof window !== 'undefined') {
    load();
  }
}, [id]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handlePay = async () => {
    if (!invoice) return;

    setLoading(true);
    setStatus('idle');

    const result = await payWithStarkzap({
      amount: String(invoice.total),
      tokenAddress: invoice.senderWallet,
      recipient: invoice.senderWallet,
      decimals: invoice.currency === 'USDC' ? 6 : 18,
    });

    if (!result.success) {
      setStatus('failed');
      setLoading(false);
      return;
    }

    setTxHash(result.txHash);
    setStatus('success');
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: TEXT }}>
      {/* HEADER */}
      <header style={{
        padding: '20px 40px',
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ fontWeight: 800, color: TEXT }}>
          Stark<span style={{
            background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Bill</span>
        </Link>

        <Link href="/dashboard" style={{ color: MUTED }}>
          Dashboard
        </Link>
      </header>

      <main style={{ maxWidth: '520px', margin: '60px auto', padding: '0 24px' }}>

        <div style={{
          background: CARD,
          borderRadius: '16px',
          border: `1px solid ${BORDER}`,
          padding: '28px'
        }}>

          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
            Invoice
          </h2>

          {loadingInvoice && (
            <p style={{ color: MUTED }}>Loading invoice...</p>
          )}

          {!loadingInvoice && !invoice && (
            <p style={{ color: '#F87171' }}>
              Invoice not found
            </p>
          )}

          {!loadingInvoice && invoice && (
            <>
              {/* AMOUNT */}
              <div style={{ marginTop: '16px', color: MUTED }}>
                Total Amount
              </div>

              <div style={{ fontSize: '26px', fontWeight: 900 }}>
                {invoice.total} {invoice.currency}
              </div>

              {/* EXTRA DATA (ADDED) */}
              <div style={{ marginTop: '16px', fontSize: '12px', color: MUTED }}>
  <div>From: {invoice.senderName?.trim() || '—'}</div>
  <div>To: {invoice.clientName?.trim() || '—'}</div>
  {invoice.dueDate && <div>Due: {invoice.dueDate}</div>}
</div>

              {/* WALLET */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ color: MUTED, fontSize: '12px' }}>
                  Pay To Wallet
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '10px',
                  borderRadius: '10px',
                  marginTop: '6px'
                }}>
                  <code style={{ fontSize: '12px' }}>
                    {invoice.senderWallet}
                  </code>

                  <button
                    onClick={() => handleCopy(invoice.senderWallet)}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* ITEMS (ADDED) */}
              {invoice.items?.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ color: MUTED, fontSize: '12px' }}>
                    Items
                  </div>

                  {invoice.items.map((item: any, i: number) => (
                    <div key={i} style={{ fontSize: '13px' }}>
                      {item.description} × {item.quantity}
                    </div>
                  ))}
                </div>
              )}

              {/* PAYMENT BUTTON */}
              <button
                onClick={handlePay}
                disabled={loading}
                style={{
                  marginTop: '24px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: loading
                    ? '#333'
                    : `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Processing...' : 'Pay'}
              </button>

              {/* STATUS */}
              {status === 'success' && (
                <p style={{ marginTop: '12px', color: '#4ADE80' }}>
                  Payment successful{' '}
                  {txHash && (
                    <a
                      href={`https://sepolia.starkscan.co/tx/${txHash}`}
                      target="_blank"
                      style={{ color: AMBER, marginLeft: '6px' }}
                    >
                      View transaction
                    </a>
                  )}
                </p>
              )}

              {status === 'failed' && (
                <p style={{ marginTop: '12px', color: '#F87171' }}>
                  Payment failed
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}