// AI FIX: Developer test page for manual session and navigation testing.
'use client';

import Link from 'next/link';

export default function DevTest() {
  const clearSession = () => {
    localStorage.clear();
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    alert("Session cleared. Please refresh the page.");
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-4 bg-background text-foreground">
        <h1 className="text-2xl font-bold">Developer Test Page</h1>
        <div className="p-6 border rounded-lg bg-card space-y-4">
            <p className="text-center text-muted-foreground">Use these links to manually test navigation:</p>
            <div className="flex gap-4">
                <Link href="/" className="text-blue-500 underline hover:text-blue-700">Go to Home/Login</Link>
                <Link href="/complete-profile" className="text-blue-500 underline hover:text-blue-700">Go to Complete Profile</Link>
                <Link href="/dashboard" className="text-blue-500 underline hover:text-blue-700">Go to Dashboard</Link>
            </div>
            <button onClick={clearSession} className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                Clear Session & Cookies
            </button>
        </div>
    </div>
  );
}
