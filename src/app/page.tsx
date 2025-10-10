import AuthGuard from '@/components/auth/auth-guard';

// The root page of the application handles the initial redirection logic.
// It uses the AuthGuard component to determine whether to show the dashboard,
// the profile completion page, or the authentication page based on the user's session state.
export default function Home() {
  return (
    <AuthGuard>
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    </AuthGuard>
  );
}
