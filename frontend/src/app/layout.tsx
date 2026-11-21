import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillSync – Connected Recruitment Intelligence & Analytics',
  description: 'Connected recruitment intelligence powered by multi-dimensional AI screening',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-charcoal antialiased selection:bg-lavender selection:text-plum-900">
        {children}
      </body>
    </html>
  );
}
