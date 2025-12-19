import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { i18n, type Locale } from '@/i18n-config';

const faviconSvg = `
<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22>
  <path d=%22M21.42 10.72L12 16l-9.42-5.28A2 2 0 0 1 2 9.06V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.06a2 2 0 0 1-.58 1.66z%22/>
  <path d=%22M22 10v6%22/>
</svg>
`;

export const metadata: Metadata = {
  title: 'StudyAI DZ',
  description: 'منصة تعليمية ذكية لمساعدة الطلاب في الجزائر',
  icons: {
    icon: `data:image/svg+xml,${faviconSvg}`,
  },
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {

  return (
    <html
      lang={params.lang}
      dir={params.lang === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased',
          process.env.NODE_ENV === 'development' ? 'debug-screens' : undefined
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
