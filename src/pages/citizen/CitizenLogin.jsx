import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import { 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  FileText,
  Lock,
  Compass,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function CitizenLogin() {
  const [contactInput, setContactInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState('REQUEST_OTP'); // 'REQUEST_OTP' | 'VERIFY_OTP'
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { requestCitizenOtp, verifyCitizenOtp } = useAuth();
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = contactInput.trim();
    if (!clean) {
      setErrorMsg('Please enter your registered mobile number or email address.');
      return;
    }

    // Basic format validation
    const isEmail = clean.includes('@');
    const isPhone = /^[0-9+ ]{8,15}$/.test(clean);
    if (!isEmail && !isPhone) {
      setErrorMsg('Please enter a valid 10-digit mobile number or official email address.');
      return;
    }

    setIsLoading(true);
    try {
      const challenge = await requestCitizenOtp(clean);
      setActiveChallenge(challenge);
      setStep('VERIFY_OTP');
    } catch (err) {
      setErrorMsg(err.message || 'Unable to dispatch OTP at this time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (otpCode) => {
    if (!activeChallenge) return;
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await verifyCitizenOtp(activeChallenge.challengeId, otpCode);
      if (result && result.success) {
        navigate('/user');
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed. Please check the code and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!contactInput) return;
    setErrorMsg('');
    setIsLoading(true);
    try {
      const newChallenge = await requestCitizenOtp(contactInput);
      setActiveChallenge(newChallenge);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend OTP. Please wait before retrying.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900/5 selection:bg-blue-100">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg border border-blue-400/40 mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
          <Compass className="w-3 h-3" />
          <span>CITIZEN SERVICES GATEWAY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Citizen / User Login
        </h1>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          Secure, passwordless verification for property owners, applicants, and citizens via OTP.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {step === 'REQUEST_OTP' ? (
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-8 space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Registered Mobile Number or Email:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or citizen@gmail.com"
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    className="w-full p-3 pl-10 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  We will transmit a short-lived 6-digit cryptographic OTP to this contact.
                </p>
              </div>

              {/* Sample Quick Fill Buttons */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                  Quick Demo Mobile / Email:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setContactInput('9876543210')}
                    className="px-2 py-0.5 bg-white border border-blue-200 rounded text-[11px] font-mono text-blue-800 hover:bg-blue-100"
                  >
                    +91 9876543210
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactInput('applicant@bhoovaraham.gov.in')}
                    className="px-2 py-0.5 bg-white border border-blue-200 rounded text-[11px] font-mono text-blue-800 hover:bg-blue-100"
                  >
                    applicant@bhoovaraham.gov.in
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !contactInput.trim()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition-all text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Security Code...</span>
                  </>
                ) : (
                  <>
                    <span>REQUEST 6-DIGIT OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Assistance & Switch Portal Options */}
            <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Forgot contact / Need help?</span>
                </button>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 hover:underline">
                  Switch Portal →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <OtpVerificationModal
            role="CITIZEN"
            maskedContact={activeChallenge?.maskedContact}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onChangeContact={() => {
              setStep('REQUEST_OTP');
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

      {/* Help / Forgot Password Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Citizen Identity & Mobile Recovery Assistance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              BHOOVARAHAM operates on passwordless authentication linked to your registered mobile number or email address on the Bhu-Aadhaar ULPIN registry.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="font-semibold text-slate-900">Contact Update Procedure:</div>
              <p>1. If your phone number has changed, visit your local Sub-Registrar Office (SRO) or Taluk Revenue Office.</p>
              <p>2. Present your Aadhaar Card and property Patta/Sale Deed for biometric re-verification.</p>
              <p>3. Once updated, your new mobile will immediately receive login OTPs.</p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
            >
              Close & Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
