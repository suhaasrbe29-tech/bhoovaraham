import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Multi-device persistent cloud authentication
 * Calls the secure PostgreSQL RPC `authenticate_user`
 */
export async function cloudAuthenticateUser(username, password) {
  if (!isSupabaseConfigured || !supabase) {
    return { 
      success: false, 
      configured: false, 
      message: 'Supabase credentials not configured in environment.' 
    };
  }

  try {
    const { data, error } = await supabase.rpc('authenticate_user', {
      p_username: username.trim(),
      p_password: password
    });

    if (error) {
      console.error('Supabase authentication RPC error:', error);
      return { success: false, message: error.message || 'Authentication error.' };
    }

    return data;
  } catch (err) {
    console.error('Error during cloud authentication:', err);
    return { success: false, message: 'Connection to cloud database failed.' };
  }
}

/**
 * Self-service password change
 */
export async function cloudChangePassword(username, currentPassword, newPassword) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cloud database not configured.' };
  }

  try {
    const { data, error } = await supabase.rpc('change_password', {
      p_username: username.trim(),
      p_current_password: currentPassword,
      p_new_password: newPassword
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message || 'Password update failed.' };
  }
}

/**
 * Administrator commissions new official account
 */
export async function cloudCreateOfficial(adminUsername, officialData) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cloud database not configured.' };
  }

  try {
    const { data, error } = await supabase.rpc('create_official_account', {
      p_admin_username: adminUsername,
      p_official_data: officialData
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message || 'Failed to create official.' };
  }
}

/**
 * Administrator toggles official status (ACTIVE / INACTIVE)
 */
export async function cloudToggleOfficialStatus(adminUsername, officialId, newStatus) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cloud database not configured.' };
  }

  try {
    const { data, error } = await supabase.rpc('toggle_official_status', {
      p_admin_username: adminUsername,
      p_official_id: officialId,
      p_new_status: newStatus
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Administrator resets official password
 */
export async function cloudResetPassword(adminUsername, targetUsername, newPassword) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cloud database not configured.' };
  }

  try {
    const { data, error } = await supabase.rpc('admin_reset_password', {
      p_admin_username: adminUsername,
      p_target_username: targetUsername,
      p_new_password: newPassword
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Fetch official accounts list from cloud
 */
export async function cloudFetchOfficials() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('government_officials')
      .select('official_id, username, name, email, department, designation, office, state, district, mandal, jurisdiction, role, permissions, status, must_change_password, last_login, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching officials from Supabase:', err);
    return null;
  }
}

/**
 * Fetch audit logs from cloud
 */
export async function cloudFetchAuditLogs() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching audit logs from Supabase:', err);
    return null;
  }
}

/**
 * Record an audit log entry in cloud
 */
export async function cloudRecordAuditLog(logEntry) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([{
        log_id: `AUD-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        ...logEntry
      }]);

    if (error) console.error('Error recording audit log in Supabase:', error);
    return data;
  } catch (err) {
    console.error('Failed to log audit entry to cloud:', err);
    return null;
  }
}

/**
 * Native Supabase Auth OTP Generation (Email or Phone)
 */
export async function cloudSendSupabaseOtp(contact) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cloud database not configured' };
  }

  try {
    const isEmail = contact.includes('@');
    const { data, error } = isEmail
      ? await supabase.auth.signInWithOtp({ email: contact.trim().toLowerCase() })
      : await supabase.auth.signInWithOtp({ phone: contact.trim() });

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Native Supabase Auth OTP Verification
 */
export async function cloudVerifySupabaseOtp(contact, otpToken) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cloud database not configured' };
  }

  try {
    const isEmail = contact.includes('@');
    const { data, error } = isEmail
      ? await supabase.auth.verifyOtp({ email: contact.trim().toLowerCase(), token: otpToken.trim(), type: 'email' })
      : await supabase.auth.verifyOtp({ phone: contact.trim(), token: otpToken.trim(), type: 'sms' });

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, user: data?.user, session: data?.session };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Cloud Database RPC OTP Challenge Generator (Bcrypt Hashed)
 */
export async function cloudCreateOtpChallenge(identifier, role, plainOtp, userId = null) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cloud database not configured' };
  }

  try {
    const { data, error } = await supabase.rpc('create_otp_challenge', {
      p_identifier: identifier.trim().toLowerCase(),
      p_role: role,
      p_plain_otp: plainOtp,
      p_user_id: userId
    });

    if (error) {
      return { success: false, message: error.message };
    }
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Cloud Database RPC OTP Challenge Verifier
 */
export async function cloudVerifyOtpChallenge(challengeId, plainOtp) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cloud database not configured' };
  }

  try {
    const { data, error } = await supabase.rpc('verify_otp_challenge', {
      p_challenge_id: challengeId,
      p_plain_otp: plainOtp.trim()
    });

    if (error) {
      return { success: false, message: error.message };
    }
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

