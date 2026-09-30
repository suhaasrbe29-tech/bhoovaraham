import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  CheckCircle2,
  Building2,
  User,
  Shield
} from 'lucide-react';

/**
 * Professional Government DPI OTP Verification Interface
 */
export default function OtpVerificationModal({
  role = 'CITIZEN', // 'CITIZEN' | 'OFFICER' | 'ADMIN'
  maskedContact = '+91 ••••••1234',
  onVerify,
  onResend,
  onChangeContact,
  isLoading = false,
  errorMsg = '',
  remainingAttempts = 3,
  resendCooldownSeconds = 60,
  devHintOtp = null // Passed only in local prototype mode for testing
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(resendCooldownSeconds);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (timerSeconds <= 0) {
      setCanResend(true);
      return;
    }
    setCanResend(false);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const handleDigitChange = (index, value) => {
    // Only accept numeric inputs
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...digits];
    newDigits[index] = cleanVal ? cleanVal.slice(-1) : '';
    setDigits(newDigits);

    // Auto-advance to next input
    if (cleanVal && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);

    const nextFocusIndex = Math.min(pasteData.length, 5);
    if (inputRefs.current[nextFocusIndex]) {
      inputRefs.current[nextFocusIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleResendClick = () => {
    if (!canResend) return;
    setDigits(['', '', '', '', '', '']);
    setTimerSeconds(resendCooldownSeconds);
    if (inputRefs.current[0]) inputRefs.current[0].focus();
    onResend();
  };

  const isComplete = digits.every((d) => d !== '');

  // Role visual identity styling
  const theme = {
    CITIZEN: {
      accent: 'blue',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      btn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      icon: <User className="w-5 h-5 text-blue-600" />,
      title: 'Citizen Identity Verification'
    },
    OFFICER: {
      accent: 'indigo',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      btn: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
      icon: <Building2 className="w-5 h-5 text-indigo-600" />,
      title: 'Authorized Official MFA'
    },
    ADMIN: {
      accent: 'purple',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      btn: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      title: 'State Commission High-Security MFA'
    }
  }[role] || {
    accent: 'blue',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    btn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
    title: 'Identity Verification'
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6">
      {/* Brand Header & Emblem */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-md">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18" />
            <path d="M3 12h18" />
            <path d="m5.6 5.6 12.8 12.8" />
            <path d="m18.4 5.6-12.8 12.8" />
          </svg>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-2">
          {theme.icon}
          <span>{theme.title}</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Verify Your Identity
        </h2>
        <p className="text-xs text-slate-600 max-w-xs mx-auto">
          A secure 6-digit One-Time Password (OTP) has been dispatched to:
        </p>
        <p className="text-sm font-mono font-bold text-slate-900 bg-slate-50 py-1 px-3 rounded-lg border border-slate-200 inline-block">
          {maskedContact}
        </p>
      </div>

      {/* Prototype Testing Aid Toast (Visible during prototype mode) */}
      {devHintOtp && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-center justify-between">
          <div>
            <span className="font-semibold block">Prototype Simulation:</span>
            <span>Generated OTP: <strong className="font-mono text-slate-900 font-black text-xs">{devHintOtp}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => {
              const chars = String(devHintOtp).split('').slice(0, 6);
              setDigits(chars);
            }}
            className="px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded font-semibold text-[10px]"
          >
            Auto-Fill
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <span>{errorMsg}</span>
            {remainingAttempts < 3 && remainingAttempts > 0 && (
              <span className="block font-bold mt-0.5 text-rose-900">
                {remainingAttempts} attempt(s) remaining.
              </span>
            )}
          </div>
        </div>
      )}

      {/* 6-Digit Verification Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-center text-xs font-semibold text-slate-700 mb-3">
            Enter 6-Digit OTP:
          </label>
          <div className="flex justify-center items-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isLoading}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-black text-lg sm:text-xl text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 transition-all shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isComplete || isLoading}
          className={`w-full py-3 px-4 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${theme.btn} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Cryptographic Token...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>VERIFY OTP & AUTHENTICATE</span>
            </>
          )}
        </button>
      </form>

      {/* Countdown & Resend Option */}
      <div className="pt-2 text-center space-y-3 border-t border-slate-100">
        <div className="text-xs text-slate-600 flex items-center justify-center gap-1.5">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={isLoading}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend OTP Now</span>
            </button>
          ) : (
            <span className="text-slate-500 font-medium">
              Resend OTP in <strong className="font-mono text-slate-800">{formatTimer(timerSeconds)}</strong>
            </span>
          )}
        </div>

        {/* Change Contact / Back Link */}
        {onChangeContact && (
          <div>
            <button
              type="button"
              onClick={onChangeContact}
              disabled={isLoading}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center justify-center gap-1 mx-auto hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change contact number / Go back</span>
            </button>
          </div>
        )}
      </div>

      {/* Statutory Security Footer */}
      <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3 text-slate-400" />
        <span>End-to-End 256-Bit Encrypted Statutory Gate</span>
      </div>
    </div>
  );
}
