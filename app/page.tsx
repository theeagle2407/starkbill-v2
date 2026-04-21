'use client';

import Link from 'next/link';

const CORAL = '#EC796B';
const AMBER = '#F9A84D';
const MUTED = '#8888A8';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#F0F0F5';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: TEXT }}>

      {/* Gradient orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,121,107,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', padding: '0 48px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Stark<span style={{ background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bill</span>
        </span>
        <Link href="/dashboard" style={{ padding: '8px 20px', background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          Get started
        </Link>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '100px 48px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '999px', marginBottom: '32px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B5CF6' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#A78BFA', letterSpacing: '0.3px' }}>BUILT ON STARKNET</span>
        </div>

        <h1 style={{ fontSize: '60px', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-3px', margin: '0 auto 24px', maxWidth: '800px' }}>
          Send invoices.{' '}
          <span style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${AMBER} 50%, #8B5CF6 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Get paid instantly.
          </span>
        </h1>

        <p style={{ fontSize: '18px', color: MUTED, lineHeight: '1.7', maxWidth: '500px', margin: '0 auto 40px' }}>
          Create professional invoices and collect payments in USDC or STRK on Starknet. Your clients pay with just an email — no wallet needed.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/dashboard" style={{ padding: '13px 30px', background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '700', boxShadow: '0 0 30px rgba(236,121,107,0.3)' }}>
            Create your first invoice
          </Link>
          <a href="#how-it-works" style={{ padding: '13px 30px', background: 'rgba(255,255,255,0.05)', color: TEXT, border: `1px solid ${BORDER}`, borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '480px', margin: '72px auto 0', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          {[
            { value: '0%', label: 'Payment fees' },
            { value: '<3s', label: 'Settlement' },
            { value: '100%', label: 'Non-custodial' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '20px', textAlign: 'center', borderLeft: i > 0 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: MUTED, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 1, padding: '80px 48px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '48px', textAlign: 'center' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { step: '01', title: 'Create an invoice', desc: 'Add client details, line items, choose USDC or STRK. Done in 60 seconds.' },
              { step: '02', title: 'Share the link', desc: 'Send your client a unique payment link. They pay with just their email.' },
              { step: '03', title: 'Get paid on-chain', desc: 'Payment settles directly to your Starknet wallet. Fully verifiable on-chain.' },
            ].map(item => (
              <div key={item.step} style={{ padding: '28px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${CORAL}, #8B5CF6)` }} />
                <div style={{ fontSize: '12px', fontWeight: '800', color: CORAL, marginBottom: '14px', letterSpacing: '1px' }}>{item.step}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: MUTED, lineHeight: '1.65', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 48px', borderTop: `1px solid ${BORDER}`, textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '14px' }}>Start getting paid today</h2>
        <p style={{ fontSize: '16px', color: MUTED, marginBottom: '32px' }}>Create your first invoice in under a minute. Free to use.</p>
        <Link href="/dashboard" style={{ padding: '14px 36px', background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: '700', boxShadow: '0 0 40px rgba(236,121,107,0.25)', display: 'inline-block' }}>
          Get started — it is free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '15px', fontWeight: '800' }}>
          Stark<span style={{ background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bill</span>
        </span>
        <span style={{ fontSize: '12px', color: MUTED }}>Built on Starknet · Powered by Starkzap</span>
      </footer>
    </div>
  );
}