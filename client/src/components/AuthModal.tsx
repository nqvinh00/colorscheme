import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/${mode === "login" ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );
      const data = await res.json();
      if (res.ok && (data.token || data.data)) {
        onAuthSuccess(data.token || data.data);
        onClose();
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gray-900 text-gray-100 rounded-lg shadow-lg p-6 w-80 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-green-500 hover:bg-green-400 text-gray-900 font-semibold transition"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                className="text-green-400 hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-green-400 hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
