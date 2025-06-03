import React, { useState, useEffect, Suspense } from "react";
import { Terminal, LogIn, LogOut } from "lucide-react";
import { getUsernameFromToken } from "@/lib/utils";

const ThemeToggle = React.lazy(() => import("@/components/ThemeToggle"));
const AuthModal = React.lazy(() => import("@/components/AuthModal"));

const TerminalHeader = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // On mount, check for token in sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("token");
    if (stored) {
      setToken(stored);
      setUsername("Welcome, " + getUsernameFromToken(stored));
    }
  }, []);

  // When login is successful, store token in sessionStorage
  const handleAuthSuccess = (token: string) => {
    setToken(token);
    sessionStorage.setItem("token", token);
    setUsername("Welcome, " + getUsernameFromToken(token));
  };

  // Logout handler
  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    sessionStorage.removeItem("token");
  };

  return (
    <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
      <div className="container mx-auto flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-8 w-8 text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-green-300">
              terminal.colors
            </h1>
            <p className="text-gray-400">
              Beautiful color schemes for your terminal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!token ? (
            <button
              className="p-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 transition h-10 w-10 flex items-center justify-center"
              onClick={() => setAuthOpen(true)}
              aria-label="Login or Sign Up"
            >
              <LogIn className="h-5 w-5" />
            </button>
          ) : (
            <>
              <span className="ml-2 text-green-300 font-semibold">
                {username}
              </span>
              <button
                className="p-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 transition h-10 w-10 flex items-center justify-center"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
          <Suspense fallback={<div className="h-10 w-10" />}>
            <ThemeToggle />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={null}>
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </Suspense>
    </header>
  );
};

export default TerminalHeader;
