import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Correct import for Inter
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ // Use Inter
  variable: '--font-inter', // Update CSS variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AlgoTrade Insights',
  description: 'High-frequency trading application with AI-driven insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Force dark mode */}
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
