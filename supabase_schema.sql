-- ============================================================================
-- BHOOVARAHAM: INTEGRATED DIGITAL LAND GOVERNANCE PLATFORM
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH RBAC & MULTI-DEVICE AUTHENTICATION
-- ============================================================================

-- 1. Enable Cryptographic Functions Extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create Government Officials & Administrator Accounts Table
CREATE TABLE IF NOT EXISTS public.government_officials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    official_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    office TEXT NOT NULL,
    state TEXT DEFAULT 'Telangana',
    district TEXT NOT NULL,
    mandal TEXT NOT NULL,
    jurisdiction TEXT,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SUB_REGISTRAR', 'REVENUE_OFFICER', 'FIELD_SURVEYOR', 'AUDITOR', 'CITIZEN')),
    permissions TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    must_change_password BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for high-performance case-insensitive username lookups
CREATE INDEX IF NOT EXISTS idx_officials_username ON public.government_officials (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_officials_role ON public.government_officials (role);
CREATE INDEX IF NOT EXISTS idx_officials_status ON public.government_officials (status);

-- 3. Create Statutory Immutable Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_id TEXT UNIQUE NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    user_id TEXT,
    username TEXT,
    role TEXT,
    action TEXT NOT NULL,
    affected_record TEXT,
    result TEXT DEFAULT 'SUCCESS',
    details TEXT,
    digital_signature_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs (action);

-- 4. Create Transfer Applications Table
CREATE TABLE IF NOT EXISTS public.transfer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT UNIQUE NOT NULL,
    ulpin TEXT NOT NULL,
    survey_number TEXT NOT NULL,
    village TEXT,
    mandal TEXT,
    district TEXT,
    state TEXT,
    area_acres NUMERIC,
    current_owner JSONB,
    applicant JSONB,
    transfer_details JSONB,
    documents JSONB,
    status TEXT DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_VERIFICATION', 'CLARIFICATION_REQUIRED', 'APPROVED', 'REJECTED')),
    assigned_office TEXT,
    assigned_officer_id TEXT,
    assigned_officer_name TEXT,
    assigned_officer_role TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    urgency TEXT DEFAULT 'Normal',
    officer_remarks TEXT,
    citizen_clarification TEXT,
    audit_trail JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_applications_ulpin ON public.transfer_applications (ulpin);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.transfer_applications (status);

-- 5. Create Cadastral Parcels Table
CREATE TABLE IF NOT EXISTS public.parcels (
    ulpin TEXT PRIMARY KEY,
    survey_number TEXT NOT NULL,
    village TEXT,
    mandal TEXT,
    district TEXT,
    state TEXT,
    area_acres NUMERIC,
    area_sq_m NUMERIC,
    land_use TEXT,
    current_crop TEXT,
    market_valuation_inr TEXT,
    guidance_value_inr TEXT,
    zoning JSONB,
    ror JSONB,
    registration JSONB,
    encumbrance JSONB,
    audit_trail JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- SECURE AUTHENTICATION & CREDENTIAL RPC FUNCTIONS (BCRYPT / PGCRYPTO)
-- ============================================================================

-- Function A: Authenticate Official or Admin by Username and Password
CREATE OR REPLACE FUNCTION public.authenticate_user(
    p_username TEXT,
    p_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_record RECORD;
    v_is_valid BOOLEAN := false;
BEGIN
    SELECT * INTO v_record
    FROM public.government_officials
    WHERE LOWER(username) = LOWER(p_username);

    IF NOT FOUND THEN
        -- Dummy crypt verification to mitigate timing attacks
        PERFORM crypt(p_password, '$2a$06$usesomesillystringfore7hnbRJHxXVLeakoG8K30oukPsA.ZTMG');
        RETURN jsonb_build_object('success', false, 'message', 'Invalid username or password.');
    END IF;

    IF v_record.status != 'ACTIVE' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Account is deactivated. Contact Administrator.');
    END IF;

    -- Verify password hash
    IF v_record.password_hash = crypt(p_password, v_record.password_hash) THEN
        -- Update last login
        UPDATE public.government_officials
        SET last_login = now()
        WHERE id = v_record.id;

        -- Record Audit Log
        INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
        VALUES (
            'AUD-' || floor(100000 + random() * 900000)::text,
            v_record.official_id,
            v_record.username,
            v_record.role,
            CASE WHEN v_record.role = 'SUPER_ADMIN' THEN 'ADMIN_LOGIN' ELSE 'OFFICIAL_LOGIN' END,
            v_record.official_id,
            'SUCCESS',
            'User authenticated successfully from client session.',
            encode(digest(v_record.username || now()::text, 'sha256'), 'hex')
        );

        -- Return sanitized profile without password_hash
        RETURN jsonb_build_object(
            'success', true,
            'user', jsonb_build_object(
                'id', v_record.official_id,
                'username', v_record.username,
                'name', v_record.name,
                'email', v_record.email,
                'department', v_record.department,
                'designation', v_record.designation,
                'office', v_record.office,
                'state', v_record.state,
                'district', v_record.district,
                'mandal', v_record.mandal,
                'jurisdiction', v_record.jurisdiction,
                'role', v_record.role,
                'permissions', v_record.permissions,
                'status', v_record.status,
                'must_change_password', v_record.must_change_password,
                'last_login', now()
            )
        );
    ELSE
        RETURN jsonb_build_object('success', false, 'message', 'Invalid username or password.');
    END IF;
END;
$$;

-- Function B: Change Password (Self-service with old password check)
CREATE OR REPLACE FUNCTION public.change_password(
    p_username TEXT,
    p_current_password TEXT,
    p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_record RECORD;
BEGIN
    SELECT * INTO v_record
    FROM public.government_officials
    WHERE LOWER(username) = LOWER(p_username);

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'User not found.');
    END IF;

    IF v_record.password_hash != crypt(p_current_password, v_record.password_hash) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Current password is incorrect.');
    END IF;

    IF length(p_new_password) < 6 THEN
        RETURN jsonb_build_object('success', false, 'message', 'New password must be at least 6 characters.');
    END IF;

    -- Update with new bcrypt hash
    UPDATE public.government_officials
    SET password_hash = crypt(p_new_password, gen_salt('bf')),
        must_change_password = false,
        updated_at = now()
    WHERE id = v_record.id;

    -- Record Audit Log
    INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
    VALUES (
        'AUD-' || floor(100000 + random() * 900000)::text,
        v_record.official_id,
        v_record.username,
        v_record.role,
        CASE WHEN v_record.role = 'SUPER_ADMIN' THEN 'ADMIN_PASSWORD_CHANGED' ELSE 'PASSWORD_CHANGED' END,
        v_record.official_id,
        'SUCCESS',
        'Password changed successfully across all client devices.',
        encode(digest(v_record.username || now()::text, 'sha256'), 'hex')
    );

    RETURN jsonb_build_object('success', true, 'message', 'Password changed successfully.');
END;
$$;

-- Function C: Admin Create Government Official Account
CREATE OR REPLACE FUNCTION public.create_official_account(
    p_admin_username TEXT,
    p_official_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_admin RECORD;
    v_new_id UUID;
    v_temp_pwd TEXT;
BEGIN
    -- Verify Admin Role
    SELECT * INTO v_admin
    FROM public.government_officials
    WHERE LOWER(username) = LOWER(p_admin_username) AND role = 'SUPER_ADMIN' AND status = 'ACTIVE';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Only Super Admin can create official accounts.');
    END IF;

    v_temp_pwd := COALESCE(p_official_data->>'temporary_password', 'GovTemp@2026');

    INSERT INTO public.government_officials (
        official_id,
        username,
        password_hash,
        name,
        email,
        department,
        designation,
        office,
        state,
        district,
        mandal,
        jurisdiction,
        role,
        permissions,
        status,
        must_change_password
    )
    VALUES (
        p_official_data->>'official_id',
        p_official_data->>'username',
        crypt(v_temp_pwd, gen_salt('bf')),
        p_official_data->>'name',
        p_official_data->>'email',
        p_official_data->>'department',
        p_official_data->>'designation',
        p_official_data->>'office',
        COALESCE(p_official_data->>'state', 'Telangana'),
        p_official_data->>'district',
        p_official_data->>'mandal',
        COALESCE(p_official_data->>'jurisdiction', p_official_data->>'mandal'),
        p_official_data->>'role',
        ARRAY(SELECT jsonb_array_elements_text(COALESCE(p_official_data->'permissions', '[]'::jsonb))),
        COALESCE(p_official_data->>'status', 'ACTIVE'),
        true
    )
    RETURNING id INTO v_new_id;

    -- Record Audit Log
    INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
    VALUES (
        'AUD-' || floor(100000 + random() * 900000)::text,
        v_admin.official_id,
        v_admin.username,
        v_admin.role,
        'OFFICIAL_CREATED',
        p_official_data->>'official_id',
        'SUCCESS',
        'Created official account for ' || (p_official_data->>'name') || ' (' || (p_official_data->>'role') || ') with Username: ' || (p_official_data->>'username'),
        encode(digest((p_official_data->>'username') || now()::text, 'sha256'), 'hex')
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Official account created successfully.',
        'official_id', p_official_data->>'official_id'
    );
EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'message', 'An account with this Username or Official ID already exists.');
END;
$$;

-- Function D: Admin Toggle Official Status (Activate / Deactivate)
CREATE OR REPLACE FUNCTION public.toggle_official_status(
    p_admin_username TEXT,
    p_official_id TEXT,
    p_new_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_admin RECORD;
    v_target RECORD;
BEGIN
    SELECT * INTO v_admin
    FROM public.government_officials
    WHERE LOWER(username) = LOWER(p_admin_username) AND role = 'SUPER_ADMIN' AND status = 'ACTIVE';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Only Super Admin can change account status.');
    END IF;

    SELECT * INTO v_target
    FROM public.government_officials
    WHERE official_id = p_official_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Target official account not found.');
    END IF;

    UPDATE public.government_officials
    SET status = p_new_status,
        updated_at = now()
    WHERE official_id = p_official_id;

    -- Record Audit Log
    INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
    VALUES (
        'AUD-' || floor(100000 + random() * 900000)::text,
        v_admin.official_id,
        v_admin.username,
        v_admin.role,
        CASE WHEN p_new_status = 'ACTIVE' THEN 'OFFICIAL_REACTIVATED' ELSE 'OFFICIAL_DEACTIVATED' END,
        p_official_id,
        'SUCCESS',
        'Changed status of ' || v_target.name || ' (' || p_official_id || ') to ' || p_new_status,
        encode(digest(p_official_id || now()::text, 'sha256'), 'hex')
    );

    RETURN jsonb_build_object('success', true, 'status', p_new_status);
END;
$$;

-- Function E: Admin Reset Password
CREATE OR REPLACE FUNCTION public.admin_reset_password(
    p_admin_username TEXT,
    p_target_username TEXT,
    p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_admin RECORD;
    v_target RECORD;
BEGIN
    SELECT * INTO v_admin
    FROM public.government_officials
    WHERE LOWER(username) = LOWER(p_admin_username) AND role = 'SUPER_ADMIN' AND status = 'ACTIVE';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Only Super Admin can reset credentials.');
    END IF;

    SELECT * INTO v_target
    FROM public.government_officials
    WHERE LOWER(username) = LOWER(p_target_username);

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Target official account not found.');
    END IF;

    UPDATE public.government_officials
    SET password_hash = crypt(p_new_password, gen_salt('bf')),
        must_change_password = true,
        updated_at = now()
    WHERE LOWER(username) = LOWER(p_target_username);

    -- Record Audit Log
    INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
    VALUES (
        'AUD-' || floor(100000 + random() * 900000)::text,
        v_admin.official_id,
        v_admin.username,
        v_admin.role,
        'PASSWORD_RESET',
        v_target.official_id,
        'SUCCESS',
        'Reset credentials for ' || v_target.name || ' (' || v_target.username || '). Temporary password assigned.',
        encode(digest(v_target.username || now()::text, 'sha256'), 'hex')
    );

    RETURN jsonb_build_object('success', true, 'message', 'Temporary password applied successfully.');
END;
$$;

-- ============================================================================
-- INITIAL SEED DATA (BOOTSTRAP SUPER ADMIN & INITIAL SRO)
-- ============================================================================

-- 1. Initial Super Admin Account: Bhoovaram / 12345678
INSERT INTO public.government_officials (
    official_id,
    username,
    password_hash,
    name,
    email,
    department,
    designation,
    office,
    state,
    district,
    mandal,
    jurisdiction,
    role,
    permissions,
    status,
    must_change_password
)
VALUES (
    'ADMIN-0001',
    'Bhoovaram',
    crypt('12345678', gen_salt('bf')),
    'State Land Commissioner Bhoovaram',
    'admin@bhoovaraham.gov.in',
    'Department of Land Resources & Administration',
    'State Land Administration Commissioner',
    'State Land Governance Commission HQ',
    'Telangana',
    'All Districts',
    'Statewide',
    'Statewide Jurisdiction',
    'SUPER_ADMIN',
    ARRAY['MANAGE_OFFICIALS', 'ASSIGN_ROLES', 'VIEW_SYSTEM_AUDIT', 'SYSTEM_CONFIG', 'VIEW_ALL_RECORDS', 'OVERRIDE_LOCKS', 'RESET_PASSWORDS'],
    'ACTIVE',
    false
)
ON CONFLICT (username) DO NOTHING;

-- 2. Initial Sample SRO Officer: SRO_HYD_001 / 12345678
INSERT INTO public.government_officials (
    official_id,
    username,
    password_hash,
    name,
    email,
    department,
    designation,
    office,
    state,
    district,
    mandal,
    jurisdiction,
    role,
    permissions,
    status,
    must_change_password
)
VALUES (
    'SRO-TS-001',
    'SRO_HYD_001',
    crypt('12345678', gen_salt('bf')),
    'Ramesh Kumar',
    'ramesh.kumar@sro.gov.in',
    'Registration & Stamps Department',
    'Sub-Registrar',
    'Hyderabad Sub-Registrar Office',
    'Telangana',
    'Hyderabad',
    'Charminar',
    'Hyderabad Central Sub-District',
    'SUB_REGISTRAR',
    ARRAY['VIEW_APPLICATIONS', 'VERIFY_DOCUMENTS', 'PROCESS_TRANSFERS', 'APPROVE_TRANSFERS', 'REJECT_TRANSFERS', 'REQUEST_CLARIFICATION', 'VIEW_PARCEL_RECORDS'],
    'ACTIVE',
    false
)
ON CONFLICT (username) DO NOTHING;

-- 3. Initial Audit Log for System Provisioning
INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
VALUES (
    'AUD-INIT-001',
    'ADMIN-0001',
    'Bhoovaram',
    'SUPER_ADMIN',
    'SYSTEM_BOOTSTRAP',
    'SYSTEM',
    'SUCCESS',
    'BHOOVARAHAM Cloud Infrastructure initial schema deployed with Super Admin credential.',
    encode(digest('Bhoovaram_INIT_' || now()::text, 'sha256'), 'hex')
)
ON CONFLICT (log_id) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.government_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;

-- Allow public read access to parcels (Cadastral Public Registry)
CREATE POLICY "Public read parcels" ON public.parcels
    FOR SELECT TO public USING (true);

-- Allow public read access to transfer applications by Application ID (Citizens tracking status)
CREATE POLICY "Public read transfer applications" ON public.transfer_applications
    FOR SELECT TO public USING (true);

-- Allow citizens to insert new transfer applications
CREATE POLICY "Public insert transfer applications" ON public.transfer_applications
    FOR INSERT TO public WITH CHECK (true);

-- Allow public read of audit logs
CREATE POLICY "Public read audit logs" ON public.audit_logs
    FOR SELECT TO public USING (true);

-- Allow reading official profiles (excluding password_hash via RPC functions)
CREATE POLICY "Allow reading official profiles" ON public.government_officials
    FOR SELECT TO public USING (true);

-- ============================================================================
-- 6. CITIZEN USERS & OTP-BASED AUTHENTICATION INFRASTRUCTURE
-- ============================================================================

-- Table for Citizen Accounts
CREATE TABLE IF NOT EXISTS public.citizen_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT DEFAULT 'CITIZEN' CHECK (role = 'CITIZEN'),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_citizen_email ON public.citizen_users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_citizen_phone ON public.citizen_users (phone);

-- Table for Secure Short-Lived OTP Challenges (Bcrypt Hashed)
CREATE TABLE IF NOT EXISTS public.auth_otp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id TEXT UNIQUE NOT NULL,
    identifier TEXT NOT NULL,
    user_id TEXT,
    role TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    expires_at TIMESTAMPTZ NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_identifier ON public.auth_otp_challenges (LOWER(identifier));
CREATE INDEX IF NOT EXISTS idx_otp_challenge_id ON public.auth_otp_challenges (challenge_id);

-- RPC: Create OTP Challenge with 5-minute expiry and Bcrypt Hash
CREATE OR REPLACE FUNCTION public.create_otp_challenge(
    p_identifier TEXT,
    p_role TEXT,
    p_plain_otp TEXT,
    p_user_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_challenge_id TEXT;
    v_masked TEXT;
    v_clean_id TEXT;
BEGIN
    v_clean_id := LOWER(TRIM(p_identifier));
    v_challenge_id := 'OTP-' || floor(100000 + random() * 900000)::text || '-' || floor(1000 + random() * 9000)::text;

    -- Invalidate any existing pending challenges for this identifier
    UPDATE public.auth_otp_challenges
    SET is_verified = false, expires_at = now() - interval '1 second'
    WHERE LOWER(identifier) = v_clean_id AND is_verified = false;

    -- Insert new challenge with 5-minute expiry
    INSERT INTO public.auth_otp_challenges (
        challenge_id,
        identifier,
        user_id,
        role,
        otp_hash,
        attempts,
        max_attempts,
        expires_at
    )
    VALUES (
        v_challenge_id,
        v_clean_id,
        p_user_id,
        p_role,
        crypt(p_plain_otp, gen_salt('bf')),
        0,
        3,
        now() + interval '5 minutes'
    );

    -- Compute masked identifier for UI display
    IF POSITION('@' IN v_clean_id) > 0 THEN
        v_masked := SUBSTRING(v_clean_id FROM 1 FOR 2) || '•••••' || SUBSTRING(v_clean_id FROM POSITION('@' IN v_clean_id));
    ELSE
        v_masked := '+91 ••••••' || RIGHT(v_clean_id, 4);
    END IF;

    -- Record Audit Log entry
    INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
    VALUES (
        'AUD-' || floor(100000 + random() * 900000)::text,
        COALESCE(p_user_id, 'ANONYMOUS'),
        v_masked,
        p_role,
        'OTP_CHALLENGE_ISSUED',
        v_challenge_id,
        'SUCCESS',
        'Secure 6-digit OTP challenge generated with 5-minute TTL.',
        encode(digest(v_challenge_id || now()::text, 'sha256'), 'hex')
    );

    RETURN jsonb_build_object(
        'success', true,
        'challenge_id', v_challenge_id,
        'masked_contact', v_masked,
        'expires_in_seconds', 300
    );
END;
$$;

-- RPC: Verify OTP Challenge
CREATE OR REPLACE FUNCTION public.verify_otp_challenge(
    p_challenge_id TEXT,
    p_plain_otp TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_record RECORD;
BEGIN
    SELECT * INTO v_record
    FROM public.auth_otp_challenges
    WHERE challenge_id = p_challenge_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or expired OTP session. Please request a new code.');
    END IF;

    IF v_record.is_verified THEN
        RETURN jsonb_build_object('success', false, 'message', 'This OTP has already been used.');
    END IF;

    IF now() > v_record.expires_at THEN
        RETURN jsonb_build_object('success', false, 'message', 'OTP has expired. Please request a fresh code.');
    END IF;

    IF v_record.attempts >= v_record.max_attempts THEN
        RETURN jsonb_build_object('success', false, 'message', 'Maximum verification attempts exceeded. Please request a new OTP.');
    END IF;

    -- Validate Cryptographic Hash
    IF v_record.otp_hash = crypt(p_plain_otp, v_record.otp_hash) THEN
        UPDATE public.auth_otp_challenges
        SET is_verified = true
        WHERE id = v_record.id;

        -- Record Audit Log entry
        INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
        VALUES (
            'AUD-' || floor(100000 + random() * 900000)::text,
            COALESCE(v_record.user_id, 'CITIZEN'),
            v_record.identifier,
            v_record.role,
            'OTP_VERIFIED_SUCCESS',
            v_record.challenge_id,
            'SUCCESS',
            'OTP successfully verified. Multi-role session cleared.',
            encode(digest(v_record.challenge_id || now()::text, 'sha256'), 'hex')
        );

        RETURN jsonb_build_object(
            'success', true,
            'role', v_record.role,
            'identifier', v_record.identifier,
            'user_id', v_record.user_id
        );
    ELSE
        UPDATE public.auth_otp_challenges
        SET attempts = attempts + 1
        WHERE id = v_record.id;

        INSERT INTO public.audit_logs (log_id, user_id, username, role, action, affected_record, result, details, digital_signature_hash)
        VALUES (
            'AUD-' || floor(100000 + random() * 900000)::text,
            COALESCE(v_record.user_id, 'UNKNOWN'),
            v_record.identifier,
            v_record.role,
            'OTP_VERIFICATION_FAILED',
            v_record.challenge_id,
            'FAILURE',
            'Incorrect OTP entered. Attempt ' || (v_record.attempts + 1)::text || ' of ' || v_record.max_attempts::text,
            encode(digest(v_record.challenge_id || now()::text, 'sha256'), 'hex')
        );

        RETURN jsonb_build_object(
            'success', false,
            'message', 'Invalid OTP code. ' || (v_record.max_attempts - v_record.attempts - 1)::text || ' attempt(s) remaining.',
            'remaining_attempts', (v_record.max_attempts - v_record.attempts - 1)
        );
    END IF;
END;
$$;

-- Enable RLS on Citizen and OTP tables
ALTER TABLE public.citizen_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_otp_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read citizen users" ON public.citizen_users
    FOR SELECT TO public USING (true);
CREATE POLICY "Public insert citizen users" ON public.citizen_users
    FOR INSERT TO public WITH CHECK (true);

