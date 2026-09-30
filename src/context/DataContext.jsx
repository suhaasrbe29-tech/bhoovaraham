import React, { createContext, useContext, useState, useEffect } from 'react';
import initialParcels from '../data/parcels.json';
import defaultApplications from '../data/defaultApplications.json';
import defaultAccounts from '../data/defaultAccounts.json';
import defaultAuditLogs from '../data/defaultAuditLogs.json';
import { 
  isSupabaseConfigured,
  cloudFetchOfficials,
  cloudFetchAuditLogs,
  cloudRecordAuditLog,
  cloudCreateOfficial,
  cloudToggleOfficialStatus,
  cloudResetPassword
} from '../lib/supabaseClient';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  PARCELS: 'bhoovaraham_parcels_v2',
  APPLICATIONS: 'bhoovaraham_applications_v2',
  OFFICIALS: 'bhoovaraham_officials_v2',
  AUDIT_LOGS: 'bhoovaraham_audit_logs_v2'
};

export function DataProvider({ children }) {
  // 1. Parcels State
  const [parcels, setParcels] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARCELS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingUlpins = new Set(parsed.map(p => p.ulpin));
        const missing = initialParcels.filter(p => !existingUlpins.has(p.ulpin));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      return initialParcels;
    } catch (e) {
      return initialParcels;
    }
  });

  // 2. Transfer Applications State
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : defaultApplications;
    } catch (e) {
      return defaultApplications;
    }
  });

  // 3. Official Accounts State
  const [officials, setOfficials] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFICIALS);
      return saved ? JSON.parse(saved) : defaultAccounts;
    } catch (e) {
      return defaultAccounts;
    }
  });

  // 4. Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : defaultAuditLogs;
    } catch (e) {
      return defaultAuditLogs;
    }
  });

  // Hydrate from Supabase Cloud on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      cloudFetchOfficials().then(data => {
        if (data && data.length > 0) {
          // Normalize column names
          const normalized = data.map(o => ({
            officialId: o.official_id,
            username: o.username,
            name: o.name,
            email: o.email,
            department: o.department,
            designation: o.designation,
            office: o.office,
            state: o.state,
            district: o.district,
            mandal: o.mandal,
            jurisdiction: o.jurisdiction,
            role: o.role,
            permissions: o.permissions || [],
            isActive: o.status === 'ACTIVE',
            status: o.status,
            mustChangePassword: o.must_change_password,
            lastLogin: o.last_login,
            createdAt: o.created_at
          }));
          setOfficials(normalized);
        }
      });

      cloudFetchAuditLogs().then(data => {
        if (data && data.length > 0) {
          const normalized = data.map(l => ({
            logId: l.log_id,
            timestamp: l.timestamp,
            applicationId: l.affected_record,
            actorId: l.user_id,
            actorName: l.username,
            actorRole: l.role,
            action: l.action,
            details: l.details,
            digitalSignatureHash: l.digital_signature_hash
          }));
          setAuditLogs(normalized);
        }
      });
    }
  }, []);

  // Persist local cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(parcels));
    } catch (e) {}
  }, [parcels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (e) {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFICIALS, JSON.stringify(officials));
    } catch (e) {}
  }, [officials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {}
  }, [auditLogs]);

  // Synthetic cryptographic hash generator for audit trails
  const generateAuditHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 40; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Helper to add a system-wide audit log
  const addAuditLog = (logEntry) => {
    const newLog = {
      logId: `AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      digitalSignatureHash: generateAuditHash(),
      ...logEntry
    };
    setAuditLogs(prev => [newLog, ...prev]);

    if (isSupabaseConfigured) {
      cloudRecordAuditLog({
        user_id: logEntry.actorId,
        username: logEntry.actorName,
        role: logEntry.actorRole,
        action: logEntry.action,
        affected_record: logEntry.applicationId || logEntry.ulpin || 'SYSTEM',
        result: 'SUCCESS',
        details: logEntry.details,
        digital_signature_hash: newLog.digitalSignatureHash
      });
    }

    return newLog;
  };

  // --- CITIZEN ACTIONS ---

  // Submit a new ownership transfer application
  const submitTransferApplication = (formData) => {
    const nextNum = Math.floor(10000 + Math.random() * 90000);
    const appId = `TRF-2026-${nextNum}`;
    const timestamp = new Date().toISOString();

    const newApp = {
      applicationId: appId,
      ulpin: formData.ulpin,
      surveyNumber: formData.surveyNumber,
      village: formData.village || 'Varaha Nagar',
      mandal: formData.mandal || 'Rampur',
      district: formData.district || 'Ballari',
      state: formData.state || 'Karnataka',
      areaAcres: formData.areaAcres || 2.0,
      currentOwner: formData.currentOwner,
      applicant: {
        fullName: formData.applicantName,
        relation: formData.applicantRelation || 'Citizen',
        aadhaarHash: formData.applicantAadhaar || 'XXXX-XXXX-9912',
        email: formData.applicantEmail || 'applicant@example.com',
        phone: formData.applicantPhone || '+91 98450 00000',
        address: formData.applicantAddress || 'Rampur, Ballari',
        applicantType: formData.applicantType || 'BUYER'
      },
      transferDetails: {
        transferType: formData.transferType || 'Sale Deed',
        proposedShare: 100,
        considerationAmountINR: formData.considerationAmountINR || '₹ 45,00,000',
        guidanceValueINR: formData.guidanceValueINR || '₹ 40,00,000',
        stampDutyPaidINR: formData.stampDutyPaidINR || '₹ 2,47,500',
        registrationFeePaidINR: formData.registrationFeePaidINR || '₹ 45,000',
        challanNumber: formData.challanNumber || `KRN-E-CHALLAN-2026-${nextNum}`,
        reason: formData.reason || 'Conveyance of absolute title.'
      },
      documents: (formData.documents && formData.documents.length > 0) ? formData.documents : [
        {
          id: 'DOC-01',
          name: 'Registered Sale Deed Draft',
          fileType: 'PDF',
          fileSize: '3.1 MB',
          docNumber: `DEED-${nextNum}`,
          uploadedAt: timestamp,
          isVerified: false,
          verifiedBy: null,
          verifiedAt: null,
          remarks: null
        },
        {
          id: 'DOC-02',
          name: 'Record of Rights (RTC)',
          fileType: 'PDF',
          fileSize: '1.4 MB',
          docNumber: `RTC-${formData.surveyNumber || '14/1A'}`,
          uploadedAt: timestamp,
          isVerified: false,
          verifiedBy: null,
          verifiedAt: null,
          remarks: null
        },
        {
          id: 'DOC-03',
          name: 'Non-Encumbrance Certificate (NEC)',
          fileType: 'PDF',
          fileSize: '2.5 MB',
          docNumber: `NEC-2026-${nextNum}`,
          uploadedAt: timestamp,
          isVerified: false,
          verifiedBy: null,
          verifiedAt: null,
          remarks: null
        },
        {
          id: 'DOC-04',
          name: 'Buyer KYC (Aadhaar / PAN)',
          fileType: 'PDF',
          fileSize: '890 KB',
          docNumber: `KYC-${nextNum}`,
          uploadedAt: timestamp,
          isVerified: false,
          verifiedBy: null,
          verifiedAt: null,
          remarks: null
        }
      ],
      status: 'SUBMITTED',
      assignedOffice: 'Sub-Registrar Office, Rampur',
      assignedOfficerId: 'OFF-1024',
      assignedOfficerName: 'Smt. Sunitha Rao, KAS',
      assignedOfficerRole: 'Senior Sub-Registrar',
      submittedAt: timestamp,
      updatedAt: timestamp,
      urgency: 'Normal',
      officerRemarks: 'Application received and queued for Sub-Registrar preliminary verification.',
      citizenClarification: null,
      auditTrail: [
        {
          action: 'APPLICATION_SUBMITTED',
          actor: `${formData.applicantName} (Citizen)`,
          actorRole: 'CITIZEN',
          timestamp: timestamp,
          details: `Application submitted for parcel ULPIN ${formData.ulpin} (Survey ${formData.surveyNumber}). Ref: ${appId}`
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);

    addAuditLog({
      applicationId: appId,
      ulpin: formData.ulpin,
      surveyNumber: formData.surveyNumber,
      actorId: 'CITIZEN-PORTAL',
      actorName: formData.applicantName,
      actorRole: 'CITIZEN',
      department: 'Public Citizen Services',
      action: 'APPLICATION_SUBMITTED',
      details: `Citizen lodged transfer application ${appId} for Survey ${formData.surveyNumber}.`,
      jurisdiction: `${formData.district || 'Ballari'} / ${formData.mandal || 'Rampur'}`
    });

    return newApp;
  };

  // Citizen submits requested clarification or missing documents
  const submitCitizenClarification = (applicationId, clarificationText, additionalDocName = null) => {
    const timestamp = new Date().toISOString();

    setApplications(prev => prev.map(app => {
      if (app.applicationId !== applicationId) return app;

      const updatedDocs = [...app.documents];
      if (additionalDocName) {
        updatedDocs.push({
          id: `DOC-SUPP-${Date.now().toString().slice(-4)}`,
          name: additionalDocName,
          fileType: 'PDF',
          fileSize: '1.8 MB',
          docNumber: `SUPP-${Date.now().toString().slice(-5)}`,
          uploadedAt: timestamp,
          isVerified: false,
          verifiedBy: null,
          verifiedAt: null,
          remarks: 'Submitted as clarification supplement.'
        });
      }

      const updatedAudit = [
        ...app.auditTrail,
        {
          action: 'CLARIFICATION_SUBMITTED',
          actor: `${app.applicant.fullName} (Citizen)`,
          actorRole: 'CITIZEN',
          timestamp: timestamp,
          details: `Citizen provided clarification: "${clarificationText}". Status resumed to Under Verification.`
        }
      ];

      return {
        ...app,
        status: 'UNDER_VERIFICATION',
        citizenClarification: clarificationText,
        documents: updatedDocs,
        updatedAt: timestamp,
        auditTrail: updatedAudit
      };
    }));

    addAuditLog({
      applicationId: applicationId,
      actorId: 'CITIZEN-PORTAL',
      actorName: 'Applicant Citizen',
      actorRole: 'CITIZEN',
      department: 'Public Citizen Services',
      action: 'CLARIFICATION_SUBMITTED',
      details: `Citizen responded to clarification request on application ${applicationId}: "${clarificationText}".`,
      jurisdiction: 'Ballari / Rampur'
    });
  };

  // Document verification stamp
  const verifyApplicationDocument = (applicationId, docId, isVerified, remarks = '', officerUser = null) => {
    const timestamp = new Date().toISOString();
    const officerId = officerUser?.id || 'OFF-1024';

    setApplications(prev => prev.map(app => {
      if (app.applicationId !== applicationId) return app;

      const updatedDocs = app.documents.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            isVerified,
            verifiedBy: isVerified ? officerId : null,
            verifiedAt: isVerified ? timestamp : null,
            remarks: remarks || doc.remarks
          };
        }
        return doc;
      });

      return {
        ...app,
        documents: updatedDocs,
        updatedAt: timestamp
      };
    }));
  };

  // Official statutory decision: APPROVE, REJECT, or REQUEST_CLARIFICATION
  const updateApplicationStatus = (applicationId, newStatus, remarks, officerUser = null) => {
    const timestamp = new Date().toISOString();
    const officerId = officerUser?.id || 'OFF-1024';
    const officerName = officerUser?.name || 'Smt. Sunitha Rao, KAS';
    const officerRole = officerUser?.role || 'SUB_REGISTRAR';
    const department = officerUser?.department || 'Registration & Stamps Department';

    const targetApp = applications.find(a => a.applicationId === applicationId);
    if (!targetApp) return;

    let actionName = 'STATUS_UPDATED';
    if (newStatus === 'APPROVED') actionName = 'TRANSFER_APPROVED';
    if (newStatus === 'REJECTED') actionName = 'TRANSFER_REJECTED';
    if (newStatus === 'CLARIFICATION_REQUIRED') actionName = 'CLARIFICATION_REQUESTED';
    if (newStatus === 'UNDER_VERIFICATION') actionName = 'VERIFICATION_IN_PROGRESS';

    const auditActionEntry = {
      action: actionName,
      actor: `${officerName} (${officerId})`,
      actorRole: officerRole,
      timestamp: timestamp,
      details: remarks || `Application moved to ${newStatus}.`
    };

    setApplications(prev => prev.map(app => {
      if (app.applicationId !== applicationId) return app;
      return {
        ...app,
        status: newStatus,
        officerRemarks: remarks || app.officerRemarks,
        updatedAt: timestamp,
        auditTrail: [...app.auditTrail, auditActionEntry]
      };
    }));

    addAuditLog({
      applicationId: applicationId,
      ulpin: targetApp.ulpin,
      surveyNumber: targetApp.surveyNumber,
      actorId: officerId,
      actorName: officerName,
      actorRole: officerRole,
      department: department,
      action: actionName,
      details: remarks || `Officer ${officerName} changed status to ${newStatus} for ${applicationId}.`,
      jurisdiction: `${targetApp.district} / ${targetApp.mandal}`
    });

    if (newStatus === 'APPROVED') {
      const mutationNum = `MR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const dateFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      setParcels(prevParcels => prevParcels.map(parcel => {
        if (parcel.ulpin !== targetApp.ulpin) return parcel;

        const updatedOwners = [
          {
            name: targetApp.applicant.fullName,
            relation: targetApp.applicant.relation,
            share_percent: 100,
            aadhaar_hash: targetApp.applicant.aadhaarHash,
            extent_acres: parcel.area_acres
          }
        ];

        const parcelAuditEntry = {
          date: dateFormatted,
          actor: `${officerName} (${officerId})`,
          action: 'MUTATION_APPROVED',
          description: `Ownership mutated from ${targetApp.currentOwner?.name || 'Previous Owner'} to ${targetApp.applicant.fullName} under Mutation Order ${mutationNum} (Application ${applicationId}).`
        };

        return {
          ...parcel,
          ror: {
            ...parcel.ror,
            owners: updatedOwners,
            mutation_number: mutationNum,
            mutation_date: dateFormatted,
            status: 'Verified & Active (Mutated via BHOOVARAHAM)',
            dispute_status: 'Clear / Mutated'
          },
          registration: {
            ...parcel.registration,
            registered_deed_no: `BLR-REG-${mutationNum}`,
            registration_date: dateFormatted,
            sub_registrar_office: targetApp.assignedOffice,
            deed_type: targetApp.transferDetails?.transferType || 'Sale Deed',
            stamp_duty_paid: targetApp.transferDetails?.stampDutyPaidINR || '₹ 2,47,500',
            status: 'Registered & Mutated'
          },
          audit_trail: [parcelAuditEntry, ...(parcel.audit_trail || [])]
        };
      }));
    }
  };

  // --- ADMINISTRATOR ACTIONS ---

  // Create new government official account (Cloud + Local state)
  const createOfficialAccount = async (officialData, adminUser = null) => {
    const timestamp = new Date().toISOString();
    const adminUsername = adminUser?.username || 'Bhoovaram';

    if (isSupabaseConfigured) {
      const res = await cloudCreateOfficial(adminUsername, {
        official_id: officialData.officialId,
        username: officialData.username,
        name: officialData.name,
        email: officialData.email,
        department: officialData.department,
        designation: officialData.designation,
        office: officialData.office,
        state: officialData.state || 'Telangana',
        district: officialData.district || 'Hyderabad',
        mandal: officialData.mandal || 'Charminar',
        jurisdiction: officialData.jurisdiction || officialData.mandal,
        role: officialData.role || 'SUB_REGISTRAR',
        permissions: officialData.permissions || ['VIEW_APPLICATIONS'],
        temporary_password: officialData.temporaryPassword || '12345678',
        status: officialData.status || 'ACTIVE'
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to create official in cloud.');
      }
    }

    const newAccount = {
      officialId: officialData.officialId,
      username: officialData.username,
      name: officialData.name,
      email: officialData.email,
      department: officialData.department,
      designation: officialData.designation,
      office: officialData.office,
      state: officialData.state || 'Telangana',
      district: officialData.district || 'Hyderabad',
      mandal: officialData.mandal || 'Charminar',
      jurisdiction: officialData.jurisdiction || officialData.mandal,
      role: officialData.role || 'SUB_REGISTRAR',
      permissions: officialData.permissions || ['VIEW_APPLICATIONS'],
      temporaryPassword: officialData.temporaryPassword || '12345678',
      isActive: officialData.status !== 'INACTIVE',
      status: officialData.status || 'ACTIVE',
      createdAt: timestamp,
      lastLogin: null,
      loginHistory: []
    };

    setOfficials(prev => [newAccount, ...prev]);

    addAuditLog({
      applicationId: 'N/A',
      ulpin: 'N/A',
      surveyNumber: 'N/A',
      actorId: adminUser?.id || 'ADMIN-0001',
      actorName: adminUser?.name || 'Super Admin Bhoovaram',
      actorRole: 'SUPER_ADMIN',
      department: 'State Land Governance Commission',
      action: 'OFFICIAL_CREATED',
      details: `Commissioned official ${officialData.officialId} (${officialData.name}) with Username: ${officialData.username} and Role: ${officialData.role}.`,
      jurisdiction: `${officialData.district} / ${officialData.mandal}`
    });

    return newAccount;
  };

  // Toggle account active status (activate / deactivate)
  const toggleOfficialStatus = async (officialId, adminUser = null) => {
    const target = officials.find(o => o.officialId === officialId);
    if (!target) return;

    const newStatus = target.isActive || target.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const adminUsername = adminUser?.username || 'Bhoovaram';

    if (isSupabaseConfigured) {
      await cloudToggleOfficialStatus(adminUsername, officialId, newStatus);
    }

    setOfficials(prev => prev.map(o => {
      if (o.officialId === officialId) {
        return { 
          ...o, 
          isActive: newStatus === 'ACTIVE',
          status: newStatus
        };
      }
      return o;
    }));

    addAuditLog({
      applicationId: 'N/A',
      ulpin: 'N/A',
      surveyNumber: 'N/A',
      actorId: adminUser?.id || 'ADMIN-0001',
      actorName: adminUser?.name || 'Super Admin Bhoovaram',
      actorRole: 'SUPER_ADMIN',
      department: 'Administration',
      action: newStatus === 'ACTIVE' ? 'OFFICIAL_REACTIVATED' : 'OFFICIAL_DEACTIVATED',
      details: `Administrator toggled status of ${officialId} (${target.name}) to ${newStatus}.`,
      jurisdiction: target.district
    });
  };

  // Reset official credentials
  const resetOfficialCredentials = async (officialId, adminUser = null) => {
    const target = officials.find(o => o.officialId === officialId);
    if (!target) return;

    const tempToken = `GovTemp@${Math.floor(1000 + Math.random() * 9000)}`;
    const adminUsername = adminUser?.username || 'Bhoovaram';

    if (isSupabaseConfigured) {
      await cloudResetPassword(adminUsername, target.username, tempToken);
    }

    setOfficials(prev => prev.map(o => {
      if (o.officialId === officialId) {
        return { ...o, temporaryPassword: tempToken };
      }
      return o;
    }));

    addAuditLog({
      applicationId: 'N/A',
      ulpin: 'N/A',
      surveyNumber: 'N/A',
      actorId: adminUser?.id || 'ADMIN-0001',
      actorName: adminUser?.name || 'Super Admin Bhoovaram',
      actorRole: 'SUPER_ADMIN',
      department: 'Administration',
      action: 'PASSWORD_RESET',
      details: `Credential reset for ${officialId} (${target.name}). Temp Auth Code issued.`,
      jurisdiction: target.district
    });

    return tempToken;
  };

  // Reset entire application demo state to defaults
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.PARCELS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.OFFICIALS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    setParcels(initialParcels);
    setApplications(defaultApplications);
    setOfficials(defaultAccounts);
    setAuditLogs(defaultAuditLogs);
  };

  return (
    <DataContext.Provider
      value={{
        parcels,
        applications,
        officials,
        auditLogs,
        submitTransferApplication,
        submitCitizenClarification,
        verifyApplicationDocument,
        updateApplicationStatus,
        createOfficialAccount,
        toggleOfficialStatus,
        resetOfficialCredentials,
        addAuditLog,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
