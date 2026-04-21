'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const CORAL = '#EC796B';
const AMBER = '#F9A84D';
const MUTED = '#8888A8';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#F0F0F5';
const CARD = 'rgba(255,255,255,0.04)';

export default function PayPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isCreated = searchParams.get('created') === 'true';
  const [copied, setCopied] = useState(false);

  const paymentLink = typeof window !== 'undefined' ? window.location.href.replace('?created=true', '') : '';

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: TEXT, fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 40px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,15,0.95)' }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: '18px', fontWeight: '800', color: TEXT }}>
          Stark<span style={{ background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bill</span>
        </Link>
        <Link href="/dashboard" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}>Dashboard</Link>
      </header>

      <main style={{ maxWidth: '520px', margin: '60px auto', padding: '0 24px' }}>
        {isCreated ? (
          <div style={{ background: CARD, borderRadius: '20px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <div style={{ height: '3px', background: `linear-gradient(90deg, ${CORAL}, #8B5CF6, ${AMBER})` }} />
            <div style={{ padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>✓</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Invoice created!</h2>
              <p style={{ fontSize: '14px', color: MUTED, marginBottom: '28px', lineHeight: '1.6' }}>
                Share this payment link with your client. They can pay directly from this page.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${BORDER}`, padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, fontSize: '12px', color: MUTED, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                  {paymentLink}
                </div>
                <button onClick={copyLink} style={{ padding: '7px 14px', background: copied ? 'rgba(74,222,128,0.1)' : `linear-gradient(135deg, ${CORAL}, ${AMBER})`, color: copied ? '#4ADE80' : '#fff', border: copied ? '1px solid rgba(74,222,128,0.3)' : 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Link href="/dashboard" style={{ padding: '9px 20px', background: CARD, color: TEXT, borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', border: `1px solid ${BORDER}` }}>
                  Dashboard
                </Link>
                <Link href="/invoice/new" style={{ padding: '9px 20px', background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                  New invoice
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: CARD, borderRadius: '20px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <div style={{ height: '3px', background: `linear-gradient(90deg, ${CORAL}, #8B5CF6, ${AMBER})` }} />
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Payment Page</h2>
              <p style={{ fontSize: '14px', color: MUTED, marginBottom: '20px' }}>Invoice ID: {id}</p>
              <p style={{ fontSize: '13px', color: MUTED, lineHeight: '1.6' }}>
                Starkzap payment integration is live. Connect your wallet to pay this invoice on Starknet.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}