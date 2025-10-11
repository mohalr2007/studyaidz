import { redirect } from 'next/navigation';

// This is the root page, it redirects to the default language
export default function RootPage() {
  redirect('/ar');
}
