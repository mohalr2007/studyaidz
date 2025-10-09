
import { redirect } from 'next/navigation';

export default function HomePage() {
  // The root page now redirects to the main authentication page.
  // The actual landing page or dashboard logic will be handled
  // by a protected route component later.
  redirect('/auth');
}
