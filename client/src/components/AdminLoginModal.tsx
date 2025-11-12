import { useState } from "react";
import { X } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Hardcoded credentials (TEMPORARY - replace with proper backend authentication before production)
    const ADMIN_EMAIL = "admin@thenoshco.co.za";
    const ADMIN_PASSWORD = "Nosh2025!";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLoginSuccess();
      onClose();
      setEmail("");
      setPassword("");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        data-testid="backdrop-admin-modal"
      />

      {/* Modal */}
      <div className="relative bg-white border border-card-border max-w-md w-full" data-testid="modal-admin-login">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <h2 className="text-2xl font-serif font-light tracking-wide text-foreground">
            Admin Login
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div 
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm"
              data-testid="text-error-message"
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <label 
              htmlFor="admin-email" 
              className="block text-sm font-sans tracking-wide uppercase text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-card-border bg-white text-foreground focus:outline-none focus:border-foreground transition-colors"
              placeholder="admin@thenoshco.co.za"
              required
              data-testid="input-admin-email"
            />
          </div>

          <div className="mb-6">
            <label 
              htmlFor="admin-password" 
              className="block text-sm font-sans tracking-wide uppercase text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-card-border bg-white text-foreground focus:outline-none focus:border-foreground transition-colors"
              placeholder="Enter password"
              required
              data-testid="input-admin-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-8 text-sm font-sans tracking-widest uppercase hover:bg-gray-900 transition-colors"
            data-testid="button-admin-login-submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
