import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserRole, checkRoleAccess, DEMO_CREDENTIALS } from "../lib/auth";

interface LoginProps {
  onSuccess?: (role: UserRole) => void;
}

import logoImage from "../assets/logo.png";

export default function Login({ onSuccess }: LoginProps) {
  const { login, register, resetPassword, logout, isMockMode } = useAuth();

  // Role toggle: "recycler" or "admin"
  const [selectedRole, setSelectedRole] = useState<UserRole>("recycler");

  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Map errors to friendly user messages
  const getFriendlyErrorMessage = (code: string, fallbackMessage: string): string => {
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No registered account found with this email address.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password. Please verify your credentials.";
      case "auth/user-disabled":
        return "This account has been suspended. Please contact platform support.";
      case "auth/too-many-requests":
        return "Access temporarily locked due to failed attempts. Try again later or reset password.";
      case "auth/network-request-failed":
        return "Network connection error. Please check your connection.";
      default:
        return fallbackMessage || "Authentication failed. Please verify your credentials.";
    }
  };

  // Quick fill demo helper
  const fillCredentials = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Form submission & role check
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setLoading(true);
    try {
      const userInfo = await login(trimmedEmail, password, rememberMe);

      // Verify returned user's role against selected toggle
      const roleCheck = checkRoleAccess(userInfo.email, selectedRole, userInfo.role);

      if (!roleCheck.allowed) {
        // Role mismatch: clear session & show inline error without navigating
        await logout();
        setErrorMessage(roleCheck.errorMessage || `This account doesn't have ${selectedRole === "recycler" ? "Recycler" : "Admin"} access.`);
        setLoading(false);
        return;
      }

      // Role matched: proceed
      if (onSuccess) {
        onSuccess(selectedRole);
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Login attempt failed:", error);
      const friendlyMsg = getFriendlyErrorMessage(error.code || "", error.message || "");
      setErrorMessage(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password handler
  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address in the field above first, then click 'Forgot password?'.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setResetLoading(true);

    try {
      await resetPassword(trimmedEmail);
      setSuccessMessage(`Password reset link sent to ${trimmedEmail}. Please check your inbox.`);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      setErrorMessage(error.message || "Unable to send password reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#f8f7f4] font-sans antialiased selection:bg-[#133e29] selection:text-white">
      {/* Background Soft Texture / Subtle Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(#133e29_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Main Centered Card (max-width ~420px, 10-12px rounded, dark green accents) */}
      <div className="w-full max-w-[420px] bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#e7e2d9]/70 p-6 sm:p-8 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-[12px] bg-white flex items-center justify-center shadow-md shadow-[#133e29]/15 mb-3 overflow-hidden border border-gray-100">
            <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-1">
            <span>Eco</span>
            <span className="text-[#133e29] font-black">Setu</span>
          </h1>
          <p className="text-[11px] font-medium tracking-widest uppercase text-emerald-800/80 mt-0.5">
            Connect · Recycle · Reuse
          </p>
        </div>

        {/* Role Pill Toggle Buttons (Side-by-Side) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#f4f2ee] rounded-[10px] mb-6">
          <button
            type="button"
            onClick={() => {
              setSelectedRole("recycler");
              setErrorMessage(null);
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-[8px] transition-all cursor-pointer text-center ${
              selectedRole === "recycler"
                ? "bg-[#133e29] text-white shadow-xs"
                : "border border-transparent text-gray-600 hover:text-gray-900 bg-transparent"
            }`}
          >
            Sign in as Recycler
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRole("admin");
              setErrorMessage(null);
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-[8px] transition-all cursor-pointer text-center ${
              selectedRole === "admin"
                ? "bg-[#133e29] text-white shadow-xs"
                : "border border-transparent text-gray-600 hover:text-gray-900 bg-transparent"
            }`}
          >
            Sign in as Admin
          </button>
        </div>

        {/* Inline Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200/80 text-red-700 flex items-start gap-2.5 text-xs animate-fadeIn">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600 font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Inline Success Banner */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-[10px] bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-start gap-2.5 text-xs animate-fadeIn">
            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div className="flex-1 leading-relaxed">{successMessage}</div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-500 hover:text-emerald-700 font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={selectedRole === "admin" ? "admin@kabadiwalaconnect.in" : "facility.admin@recycler.com"}
              autoComplete="email"
              required
              className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-[#e2ddd5] rounded-[10px] text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#133e29] focus:ring-1 focus:ring-[#133e29] transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700" htmlFor="login-password">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#faf9f6] border border-[#e2ddd5] rounded-[10px] text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#133e29] focus:ring-1 focus:ring-[#133e29] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#133e29] border-gray-300 focus:ring-[#133e29] accent-[#133e29] cursor-pointer"
              />
              <span className="text-xs text-gray-600">Remember session</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-xs text-gray-500 hover:text-[#133e29] font-medium hover:underline cursor-pointer disabled:opacity-50"
            >
              {resetLoading ? "Sending..." : "Forgot password?"}
            </button>
          </div>

          {/* Primary Submit Button (Full Width, Dark Green #133e29) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-[10px] text-sm font-semibold text-white bg-[#133e29] hover:bg-[#0f3221] shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo Mode Quick Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-[#f0ede6]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-center mb-2.5">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("recycler")}
              className="p-2 text-left rounded-[8px] bg-[#faf9f6] hover:bg-[#f4f2ee] border border-[#e7e2d9] transition-colors cursor-pointer"
            >
              <p className="text-[11px] font-bold text-gray-800">Recycler Staff</p>
              <p className="text-[10px] text-gray-500 truncate">admin@greenrecyclehub.in</p>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("admin")}
              className="p-2 text-left rounded-[8px] bg-[#faf9f6] hover:bg-[#f4f2ee] border border-[#e7e2d9] transition-colors cursor-pointer"
            >
              <p className="text-[11px] font-bold text-[#133e29]">Platform Admin</p>
              <p className="text-[10px] text-gray-500 truncate">admin@kabadiwalaconnect.in</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
