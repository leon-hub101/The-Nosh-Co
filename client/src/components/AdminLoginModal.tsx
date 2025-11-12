import { useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call backend login endpoint
      const response = await apiRequest('POST', '/api/auth/login', {
        email,
        password,
      });

      // Parse JSON response
      const data = await response.json();

      // Check if response indicates admin role
      if (data.role === 'admin') {
        onLoginSuccess();
        onClose();
        setEmail("");
        setPassword("");
      } else {
        setError("Admin access required");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
              data-testid="input-admin-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-8 text-sm font-sans tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            data-testid="button-admin-login-submit"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
