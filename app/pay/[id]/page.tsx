'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getInvoice } from '@/lib/invoices-store';
import { payWithStarkzap } from '@/lib/starkzap';

const CORAL = '#EC796B';
const AMBER = '#F9A84D';
const MUTED = '#8888A8';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#F0F0F5';
const CARD = 'rgba(255,255,255,0.04)';

type Invoice = {
  id: string;
  invoiceNumber: string;
  senderName: string;
  senderEmail: string;
  senderWallet: string;
  clientName: string;
  clientEmail: string;
  items: any[];
  currency: string;
  total: number;
  dueDate: string;
  notes?: string;
  status: string;
  tx_hash?: string;
};

export default function PayPage() {
  const { id } = useParams<{ id: string }>();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(true);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] =
    useState<'idle' | 'success' | 'failed'>('idle');

  const [txHash, setTxHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ✅ LOAD INVOICE (NO SUPABASE)
  useEffect(() => {
    const load = async () => {
      setLoadingInvoice(true);

      const data = getInvoice(id as string);

      if (!data) {
        setInvoice(null);
        setLoadingInvoice(false);
        return;
      }

      setInvoice(data as any);
      setLoadingInvoice(false);
    };

    load();
  }, [id]);

  const paymentLink =
    typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ PAYMENT HANDLER
  const handlePay = async () => {
    if (!invoice) return;

    setLoading(true);
    setStatus('idle');

    const result = await payWithStarkzap({
      amount: String(invoice.total),
      tokenAddress: invoice.senderWallet, // adjust if you later store token separately
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

      {/* MAIN */}
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

          {/* LOADING */}
          {loadingInvoice && (
            <p style={{ color: MUTED, marginTop: '12px' }}>
              Loading invoice...
            </p>
          )}

          {/* NOT FOUND */}
          {!loadingInvoice && !invoice && (
            <p style={{ color: '#F87171', marginTop: '12px' }}>
              Invoice not found
            </p>
          )}

          {/* INVOICE */}
          {!loadingInvoice && invoice && (
            <>
              <div style={{ marginTop: '16px', color: MUTED, fontSize: '13px' }}>
                Amount
              </div>

              <div style={{ fontSize: '22px', fontWeight: 800 }}>
                {invoice.total} {invoice.currency}
              </div>

              <div style={{ marginTop: '10px', fontSize: '12px', color: MUTED }}>
                Status: {invoice.status}
              </div>

              {/* COPY LINK */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px' }}>
                  Payment link
                </div>

                <div style={{
                  fontSize: '12px',
                  padding: '10px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  wordBreak: 'break-all'
                }}>
                  {paymentLink}
                </div>

                <button
                  onClick={copyLink}
                  style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    background: copied
                      ? 'rgba(74,222,128,0.15)'
                      : `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>

              {/* PAY BUTTON */}
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

              {/* STATUS */}
              {status === 'success' && (
                <p style={{ marginTop: '12px', color: '#4ADE80' }}>
                  Payment successful
                  <br />
                  {txHash && (
                    <a
                      href={`https://sepolia.starkscan.co/tx/${txHash}`}
                      target="_blank"
                      style={{ color: '#60A5FA' }}
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