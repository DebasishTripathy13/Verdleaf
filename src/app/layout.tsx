import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoMon Guardian | Web3 AI Sustainability Companion',
  description: 'EcoMon Guardian is a Web3 AI companion that evolves through verified real-world eco-actions. Transform your sustainable lifestyle into rewards, community impact, and an emotionally bonded digital creature.',
  keywords: ['EcoMon', 'sustainability', 'Web3', 'AI companion', 'eco-friendly', 'NFT', 'blockchain', 'environmental'],
  authors: [{ name: 'EcoMon Team' }],
  openGraph: {
    title: 'EcoMon Guardian',
    description: 'Your AI companion that grows with your eco-actions',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} animated-bg min-h-screen`}>
        <Providers>
          <div className="noise-overlay" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
