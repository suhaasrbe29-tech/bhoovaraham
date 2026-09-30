import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import { 
  Shield, 
  Lock, 
  Key, 
  ArrowRight, 
  AlertCircle, 
  User, 
  Loader2,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('Bhoovaram');
  const [password, setPassword] = useState('12345678');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('CREDENTIALS'); // 'CREDENTIALS' | 'MFA_OTP'
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { initiateAdminLogin, verifyAdminOtp } = useAuth();
  const navigate = useNavigate();

  // Step 1: Validate Admin Credentials and Dispatch MFA Challenge
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const challengeResult = await initiateAdminLogin(username, password);
      setActiveChallenge(challengeResult);
      setStep('MFA_OTP');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify High-Security MFA OTP
  const handleVerifyMfaOtp = async (otpCode) => {
    if (!activeChallenge) return;
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await verifyAdminOtp(
        activeChallenge.challengeId, 
        otpCode, 
        activeChallenge.adminProfile
      );
      if (result && result.success) {
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg(err.message || 'MFA Token verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const challengeResult = await initiateAdminLogin(username, password);
      setActiveChallenge(challengeResult);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch MFA security token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950 selection:bg-purple-900 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-purple-950 flex items-center justify-center text-white font-bold shadow-2xl border border-purple-500/50 mx-auto">
          <Shield className="w-8 h-8 text-purple-200" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          ADMINISTRATOR LOGIN
        </h1>
        <p className="text-xs text-slate-400">
          State Land Governance Commission • High-Security MFA Terminal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {step === 'CREDENTIALS' ? (
          <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-2xl border border-purple-900/50 sm:px-8 space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCredentialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Administrator Username:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bhoovaram"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 pl-9 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Administrator Password:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter administrator password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 pl-9 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-colors text-xs mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials & Triggering MFA...</span>
                  </>
                ) : (
                  <>
                    <span>PROCEED TO MFA VERIFICATION</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bootstrap Hint */}
            <div className="p-3 bg-purple-950/40 rounded-lg border border-purple-900/60 text-[11px] text-purple-300 space-y-1">
              <span className="font-bold block text-purple-200">State Commissioner Bootstrap Credential:</span>
              <p className="text-purple-300/80 leading-relaxed">
                Username: <strong className="text-white font-mono">Bhoovaram</strong> • Password: <strong className="text-white font-mono">12345678</strong>
              </p>
            </div>

            <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-purple-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Forgot Password?</span>
              </button>
              <Link to="/login" className="text-slate-400 hover:text-white underline">
                Portal Selection →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl text-slate-900">
            <OtpVerificationModal
              role="ADMIN"
              maskedContact={activeChallenge?.maskedContact}
              onVerify={handleVerifyMfaOtp}
              onResend={handleResendOtp}
              onChangeContact={() => {
                setStep('CREDENTIALS');
                setErrorMsg('');
              }}
              isLoading={isLoading}
              errorMsg={errorMsg}
              remainingAttempts={3}
              resendCooldownSeconds={60}
              devHintOtp={activeChallenge?.devHintOtp}
            />
          </div>
        )}
      </div>

      {/* Recovery Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-purple-800">
            <div className="w-12 h-12 rounded-xl bg-purple-900/50 text-purple-300 flex items-center justify-center border border-purple-700">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Root Administrator Recovery Protocol
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              State Commissioner credentials can only be reset via secure console access or directly in the Supabase PostgreSQL environment.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300 font-mono">
              <div className="font-semibold text-purple-300">Supabase Master Reset Query:</div>
              <p className="text-[11px] text-slate-400">
                UPDATE public.government_officials SET password_hash = crypt('NewPass@2026', gen_salt('bf')) WHERE username = 'Bhoovaram';
              </p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
