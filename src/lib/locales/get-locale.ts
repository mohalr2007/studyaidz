
import { headers } from 'next/headers';
import { i18n, type Locale } from '@/i18n-config';

export async function getLocale(): Promise<Locale> {
  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || '';
  const lang = pathname.split('/')[1] as Locale;
  
  if (i18n.locales.includes(lang)) {
    return lang;
  }
  
  return i18n.defaultLocale;
}
