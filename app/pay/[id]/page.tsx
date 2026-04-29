'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { payWithStarkzap } from '@/lib/starkzap';

const CORAL = '#EC796B';
const AMBER = '#F9A84D';
const MUTED = '#8888A8';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#F0F0F5';
const CARD = 'rgba(255,255,255,0.04)';

export default function PayPage() {
  const [invoice, setInvoice] = useState<any>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(true);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] =
    useState<'idle' | 'success' | 'failed'>('idle');

  const [txHash, setTxHash] = useState<string | null>(null);

  // ✅ REPLACED FETCH LOGIC WITH URLSearchParams
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');

    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setInvoice(parsed);
      } catch {
        setInvoice(null);
      }
    } else {
      setInvoice(null);
    }

    setLoadingInvoice(false);
  }, []);

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
            Invoice Payment
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
              <div style={{ marginTop: '16px', color: MUTED }}>
                Amount
              </div>

              <div style={{ fontSize: '22px', fontWeight: 800 }}>
                {invoice.total} {invoice.currency}
              </div>

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
                {loading ? 'Processing...' : 'Pay with Starkzap'}
              </button>

              {status === 'success' && (
                <p style={{ marginTop: '12px', color: '#4ADE80' }}>
                  Payment successful{' '}
                  {txHash && (
                    <a
                      href={`https://sepolia.starkscan.co/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginLeft: '6px', color: AMBER }}
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