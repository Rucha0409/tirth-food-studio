import type { Metadata, Viewport } from 'next';
import { Outfit, Inter, Rozha_One, Yatra_One, Noto_Serif_Devanagari, Cinzel, Lora } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const rozhaOne = Rozha_One({
  subsets: ['devanagari', 'latin'],
  variable: '--font-rozha',
  weight: '400',
  display: 'swap',
});

const yatraOne = Yatra_One({
  subsets: ['devanagari', 'latin'],
  variable: '--font-yatra',
  weight: '400',
  display: 'swap',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-dev',
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '700', '900'],
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export const metadata: Metadata = {
  title: 'तीर्थ – The Food Studio | Premium Homely Maharashtrian Tiffin',
  description: 'घरसारखं प्रेम, सात्विक चव! Experience premium, hygienic, and authentic Maharashtrian homely dabba and tiffin service loaded with pure Sajuk Tup ghee.',
  keywords: 'Maharashtrian Food, Tiffin Service, Dabba Service, Satvik Food, Homemade Food, Puran Poli, Bharli Vangi, Tirth Food Studio',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${rozhaOne.variable} ${yatraOne.variable} ${notoSerifDevanagari.variable} ${cinzel.variable} ${lora.variable}`}>
      <body className="font-sans antialiased text-charcoal bg-background min-h-screen flex flex-col selection:bg-saffron/20 selection:text-saffron-dark">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
