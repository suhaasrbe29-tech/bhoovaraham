import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import Forbidden403 from '../pages/Forbidden403';

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAdmin = false,
  requireCitizen = false,
  requireOfficer = false
}) {
  const { currentUser, isAdmin, isCitizen, isGovOfficial } = useAuth();
  const location = useLocation();

  const isAuth = currentUser && currentUser.isAuthenticated;

  // 1. Unauthenticated Checks (Redirect to appropriate login page)
  if (!isAuth) {
    if (requireAdmin || location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (requireOfficer || location.pathname.startsWith('/gov') || location.pathname.startsWith('/editor')) {
      return <Navigate to="/editor/login" state={{ from: location }} replace />;
    }
    if (requireCitizen || location.pathname.startsWith('/user')) {
      return <Navigate to="/user/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Strict Role Checks: Require Admin
  if (requireAdmin || location.pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return (
        <Forbidden403
          requiredRole="SUPER_ADMIN"
          message="This administration gateway is strictly restricted to authorized State Land Commissioners and System Administrators. Your current role does not possess administrative monitoring privileges."
        />
      );
    }
  }

  // 3. Strict Role Checks: Require Officer / Editor
  if (requireOfficer || location.pathname.startsWith('/editor') || location.pathname.startsWith('/gov')) {
    const isAllowedOfficer = [
      ROLES.SUB_REGISTRAR,
      ROLES.REVENUE_OFFICER,
      ROLES.FIELD_SURVEYOR,
      ROLES.AUDITOR
    ].includes(currentUser?.role);

    if (!isAllowedOfficer) {
      return (
        <Forbidden403
          requiredRole="AUTHORIZED_OFFICER (SUB_REGISTRAR / REVENUE_OFFICER)"
          message="You are accessing an official land adjudication workstation. Only authorized government officers (Sub-Registrars, Tehsildars, Surveyors) can access this terminal."
        />
      );
    }
  }

  // 4. Strict Role Checks: Require Citizen
  if (requireCitizen || location.pathname.startsWith('/user')) {
    if (currentUser?.role !== ROLES.CITIZEN) {
      return (
        <Forbidden403
          requiredRole="CITIZEN / USER"
          message="The Citizen Dashboard is reserved for registered citizen applicants and landowners. Official and Administrative personnel should use their respective portals."
        />
      );
    }
  }

  // 5. Explicit Allowed Roles Array check
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    return (
      <Forbidden403
        requiredRole={allowedRoles.join(' / ')}
        message={`Your account role (${currentUser?.role}) is not authorized to access this specific statutory view.`}
      />
    );
  }

  return children;
}
