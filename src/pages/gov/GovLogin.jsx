import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import { 
  Building2, 
  Lock, 
  Key, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  AlertCircle,
  User,
  Loader2,
  HelpCircle,
  Shield
} from 'lucide-react';

export default function GovLogin() {
  const [username, setUsername] = useState('SRO_HYD_001');
  const [password, setPassword] = useState('12345678');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('CREDENTIALS'); // 'CREDENTIALS' | 'OTP_MFA'
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { initiateOfficerLogin, verifyOfficerOtp } = useAuth();
  const navigate = useNavigate();

  // Step 1: Officer Credentials Validation & OTP Trigger
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const challengeResult = await initiateOfficerLogin(username, password);
      setActiveChallenge(challengeResult);
      setStep('OTP_MFA');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid Official ID or Password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Officer 2FA OTP Verification
  const handleVerifyOtp = async (otpCode) => {
    if (!activeChallenge) return;
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await verifyOfficerOtp(
        activeChallenge.challengeId, 
        otpCode, 
        activeChallenge.officerData
      );
      if (result && result.success) {
        navigate('/editor');
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const challengeResult = await initiateOfficerLogin(username, password);
      setActiveChallenge(challengeResult);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillSampleCredential = (sampleUser, samplePwd) => {
    setUsername(sampleUser);
    setPassword(samplePwd);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900/5 selection:bg-indigo-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-900 flex items-center justify-center text-white font-bold shadow-lg border border-indigo-500/40 mx-auto">
          <Building2 className="w-8 h-8" />
        </div>

        <h1 className="mt-4 text-center text-2xl font-black tracking-tight text-slate-900">
          GOVERNMENT OFFICIAL PORTAL
        </h1>
        <p className="mt-1 text-center text-xs text-slate-600">
          Authorized Sub-Registrar, Revenue Authority & Surveyor Terminal (2FA Protected)
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {step === 'CREDENTIALS' ? (
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-8 space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Officer Credentials Form */}
            <form onSubmit={handleCredentialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Username or ID:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. SRO_HYD_001 or OFF-1024"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 pl-9 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Officer Password:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter officer password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 pl-9 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white rounded-lg font-bold shadow-md flex items-center justify-center gap-2 transition-colors text-xs mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Official ID & Dispatching OTP...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>PROCEED TO 2-FACTOR OTP VERIFICATION</span>
                  </>
                )}
              </button>
            </form>

            {/* Testing Sample Credential Shortcuts */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-2">
              <span className="font-bold text-slate-800 block">Pre-Seeded Officer Credentials:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fillSampleCredential('SRO_HYD_001', '12345678')}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-[10px] font-mono hover:bg-slate-100 text-slate-800"
                >
                  SRO_HYD_001 (Sub-Registrar)
                </button>
                <button
                  type="button"
                  onClick={() => fillSampleCredential('OFF-1024', '12345678')}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-[10px] font-mono hover:bg-slate-100 text-slate-800"
                >
                  OFF-1024 (Rampur SRO)
                </button>
                <button
                  type="button"
                  onClick={() => fillSampleCredential('OFF-1088', '12345678')}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-[10px] font-mono hover:bg-slate-100 text-slate-800"
                >
                  OFF-1088 (Tehsildar)
                </button>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Forgot Password?</span>
              </button>
              <Link to="/login" className="text-slate-600 hover:underline">
                Portal Selection →
              </Link>
            </div>
          </div>
        ) : (
          <OtpVerificationModal
            role="OFFICER"
            maskedContact={activeChallenge?.maskedContact}
            onVerify={handleVerifyOtp}
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
        )}
      </div>

      {/* Forgot Password Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Official Credential Recovery Protocol
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with State Cyber Security Policy, officer credentials cannot be reset self-service without administrative authorization.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="font-semibold text-slate-900">Official Recovery Procedure:</div>
              <p>1. Contact your District Collectorate or State Land Commission Headquarters.</p>
              <p>2. Quote your Official ID (e.g. <strong>SRO-TS-001</strong> or <strong>OFF-1024</strong>).</p>
              <p>3. The Super Administrator can generate a secure One-Time Password reset token from the Admin Console.</p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
            >
              Return to Officer Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
