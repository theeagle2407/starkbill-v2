import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StarkBill — Get Paid on Starknet',
  description: 'Create invoices and get paid in crypto. No fees. Instant settlement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}