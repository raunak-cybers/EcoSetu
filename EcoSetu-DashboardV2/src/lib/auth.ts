export type UserRole = "recycler" | "admin";

export interface RoleCheckResult {
  allowed: boolean;
  actualRole: UserRole;
  errorMessage?: string;
}

/**
 * Known admin email addresses or domain patterns.
 */
const KNOWN_ADMIN_EMAILS = new Set([
  "admin@kabadiwalaconnect.in",
  "superadmin@kabadiwalaconnect.in",
  "platform@kabadiwalaconnect.in",
  "admin@kabadiwala.com",
]);

/**
 * Determine the user role based on email and profile metadata.
 */
export function getUserRole(email?: string | null, customRole?: string): UserRole {
  if (customRole === "admin" || customRole === "recycler") {
    return customRole;
  }

  if (!email) return "recycler";
  const normalized = email.toLowerCase().trim();

  if (KNOWN_ADMIN_EMAILS.has(normalized) || (normalized.endsWith("@kabadiwalaconnect.in") && normalized.startsWith("admin"))) {
    return "admin";
  }

  return "recycler";
}

/**
 * Verify whether the authenticated user's actual role matches the selected role in the UI toggle.
 */
export function checkRoleAccess(
  userEmail: string | null | undefined,
  expectedRole: UserRole,
  userCustomRole?: string
): RoleCheckResult {
  const actualRole = getUserRole(userEmail, userCustomRole);

  if (actualRole === expectedRole) {
    return {
      allowed: true,
      actualRole,
    };
  }

  const roleName = expectedRole === "recycler" ? "Recycler" : "Admin";
  return {
    allowed: false,
    actualRole,
    errorMessage: `This account doesn't have ${roleName} access.`,
  };
}

/**
 * Demo login helper credentials
 */
export const DEMO_CREDENTIALS = {
  recycler: {
    email: "admin@greenrecyclehub.in",
    password: "password123",
    label: "Demo Recycler (Metro Recycling Solutions)",
    role: "recycler" as UserRole,
  },
  admin: {
    email: "admin@kabadiwalaconnect.in",
    password: "admin123",
    label: "Platform Admin (KabadiwalaConnect HQ)",
    role: "admin" as UserRole,
  },
};
