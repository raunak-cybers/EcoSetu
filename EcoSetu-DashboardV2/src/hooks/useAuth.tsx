import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { UserRole, getUserRole } from "../lib/auth";

export interface FacilityProfile {
  name: string;
  category?: string;
  location?: string;
  cpcbStatus?: string;
  cpcbNumber?: string;
  adminName?: string;
  phone?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  operatingHours?: string;
}

export interface AuthUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  facility?: FacilityProfile;
}

export interface AuthContextType {
  user: AuthUserInfo | null;
  facility: FacilityProfile | null;
  role: UserRole;
  loading: boolean;
  isMockMode: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<AuthUserInfo>;
  register: (email: string, pass: string, facilityData?: Partial<FacilityProfile>) => Promise<AuthUserInfo>;
  updateFacility: (facilityData: Partial<FacilityProfile>) => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const STORAGE_KEY = "kc_recycler_auth_user";
const FACILITIES_REGISTRY_KEY = "kc_registered_facilities_registry";

export const DEFAULT_DEMO_FACILITY: FacilityProfile = {
  name: "Green Recycle Hub",
  category: "EcoGreen E-Waste",
  location: "MIDC Andheri",
  cpcbStatus: "CPCB Auth. valid until 31 Mar 2027",
  cpcbNumber: "CPCB-EWM-MH-04421",
  adminName: "Ravi Kumar",
  phone: "+91 22 6812 4400",
  email: "admin@greenrecyclehub.in",
  address: "Plot 14-C, MIDC Andheri East, Mumbai 400093",
  gstNumber: "27AABCE1234F1Z5",
  operatingHours: "Mon–Sat, 08:00–18:00",
};

export const DEFAULT_ADMIN_PROFILE: FacilityProfile = {
  name: "KabadiwalaConnect Platform Administration",
  category: "Central Oversight & Verification",
  location: "Central HQ - Chennai / Mumbai",
  cpcbStatus: "National EPR & CPCB Regulatory Network",
  cpcbNumber: "CPCB-NAT-ADM-2026",
  adminName: "Super Admin",
  phone: "+91 44 2833 9000",
  email: "admin@kabadiwalaconnect.in",
  address: "KabadiwalaConnect Technology Hub, Chennai 600028",
  gstNumber: "33AAACK9876Q1Z2",
  operatingHours: "24/7 Platform Monitoring",
};

export function formatFacilitySubtext(facility?: FacilityProfile | null): string {
  if (!facility) return "Authorized Recycling Facility";
  const segments = [
    facility.category,
    facility.location,
    facility.cpcbStatus || (facility.cpcbNumber ? `CPCB Auth: ${facility.cpcbNumber}` : undefined),
  ].filter((s): s is string => Boolean(s && s.trim().length > 0));

  return segments.length > 0 ? segments.join(" - ") : "Authorized Recycling Facility";
}

const AuthContext = createContext<AuthContextType | null>(null);

function getFacilitiesRegistry(): Record<string, FacilityProfile> {
  try {
    const raw = localStorage.getItem(FACILITIES_REGISTRY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading facilities registry:", e);
  }
  return {
    "admin@greenrecyclehub.in": DEFAULT_DEMO_FACILITY,
    "admin@kabadiwalaconnect.in": DEFAULT_ADMIN_PROFILE,
  };
}

function saveFacilityToRegistry(email: string, profile: FacilityProfile) {
  try {
    const reg = getFacilitiesRegistry();
    reg[email.toLowerCase()] = profile;
    localStorage.setItem(FACILITIES_REGISTRY_KEY, JSON.stringify(reg));
  } catch (e) {
    console.error("Error saving facility to registry:", e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserInfo | null>(null);
  const [facility, setFacility] = useState<FacilityProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        handleAuthUser(session?.user || null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        handleAuthUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    } else {
      // Mock Mode
      try {
        const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: AuthUserInfo = JSON.parse(stored);
          const role = getUserRole(parsed.email, parsed.role);
          setUser({ ...parsed, role });
          setFacility(parsed.facility || (role === "admin" ? DEFAULT_ADMIN_PROFILE : DEFAULT_DEMO_FACILITY));
        }
      } catch (e) {}
      setLoading(false);
    }
  }, []);

  const handleAuthUser = (currentUser: any) => {
    if (currentUser) {
      const registry = getFacilitiesRegistry();
      const userEmail = currentUser.email?.toLowerCase() || "";
      const userRole = getUserRole(userEmail);
      
      const storedFacility = registry[userEmail] || (
        userRole === "admin" ? DEFAULT_ADMIN_PROFILE : {
          ...DEFAULT_DEMO_FACILITY,
          name: currentUser.user_metadata?.name || DEFAULT_DEMO_FACILITY.name,
          email: currentUser.email || DEFAULT_DEMO_FACILITY.email,
        }
      );

      const userInfo: AuthUserInfo = {
        uid: currentUser.id,
        email: currentUser.email,
        displayName: currentUser.user_metadata?.name || null,
        role: userRole,
        facility: storedFacility,
      };
      setUser(userInfo);
      setFacility(storedFacility);
    } else {
      setUser(null);
      setFacility(null);
    }
    setLoading(false);
  };

  const login = useCallback(async (loginEmail: string, pass: string, rememberMe = true): Promise<AuthUserInfo> => {
    const trimmedEmail = loginEmail.trim();
    const registry = getFacilitiesRegistry();
    const emailKey = trimmedEmail.toLowerCase();
    const detectedRole = getUserRole(emailKey);
    
    let matchedFacility = registry[emailKey];
    if (!matchedFacility) {
      if (detectedRole === "admin") {
        matchedFacility = { ...DEFAULT_ADMIN_PROFILE, email: trimmedEmail };
      } else {
        matchedFacility = {
          ...DEFAULT_DEMO_FACILITY,
          email: trimmedEmail,
          name: trimmedEmail === "admin@greenrecyclehub.in"
            ? DEFAULT_DEMO_FACILITY.name
            : `${trimmedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase())} Recycling`,
        };
      }
    }

    if (isSupabaseConfigured && supabase) {
      let data, error;
      
      const res = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: pass,
      });
      data = res.data;
      error = res.error;

      // Auto-register demo accounts if they don't exist yet
      if (error && error.message.toLowerCase().includes('invalid login credentials')) {
        const isDemo = trimmedEmail === 'admin@greenrecyclehub.in' || trimmedEmail === 'admin@kabadiwalaconnect.in';
        if (isDemo) {
          console.log("Demo account not found in Supabase. Auto-registering...");
          return await register(trimmedEmail, pass);
        }
      }

      if (error) throw error;
      if (!data.user) throw new Error("No user returned");

      const userInfo: AuthUserInfo = {
        uid: data.user.id,
        email: data.user.email || trimmedEmail,
        displayName: data.user.user_metadata?.name || null,
        role: detectedRole,
        facility: matchedFacility,
      };
      return userInfo;
    } else {
      await new Promise((res) => setTimeout(res, 300));
      const userInfo: AuthUserInfo = {
        uid: "mock-" + Math.random().toString(36).substring(2, 9),
        email: trimmedEmail,
        displayName: matchedFacility.adminName || trimmedEmail.split("@")[0].replace(/[._-]/g, " "),
        role: detectedRole,
        facility: matchedFacility,
      };
      if (rememberMe) localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
      else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
      setUser(userInfo);
      setFacility(matchedFacility);
      return userInfo;
    }
  }, []);

  const register = useCallback(async (regEmail: string, pass: string, facilityData?: Partial<FacilityProfile>): Promise<AuthUserInfo> => {
    const trimmedEmail = regEmail.trim();
    const emailKey = trimmedEmail.toLowerCase();
    const detectedRole: UserRole = "recycler";

    const createdFacility: FacilityProfile = {
      name: facilityData?.name?.trim() || "Authorized Recycler Facility",
      category: facilityData?.category || "E-Waste & Lithium Batteries",
      location: facilityData?.location || "Maharashtra",
      cpcbStatus: facilityData?.cpcbStatus || (facilityData?.cpcbNumber ? `CPCB Auth: ${facilityData.cpcbNumber}` : "CPCB Auth. Validated"),
      cpcbNumber: facilityData?.cpcbNumber || "",
      adminName: facilityData?.adminName || "Facility Manager",
      phone: facilityData?.phone || "+91 98201 44310",
      email: trimmedEmail,
      address: facilityData?.address || facilityData?.location || "MIDC Industrial Area, Maharashtra",
      gstNumber: facilityData?.gstNumber || "27AABCE1234F1Z5",
      operatingHours: facilityData?.operatingHours || "Mon–Sat, 08:00–18:00",
    };

    saveFacilityToRegistry(emailKey, createdFacility);
    const displayName = `${createdFacility.adminName} (${createdFacility.name})`;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: pass,
        options: {
          data: { name: displayName }
        }
      });
      if (error) throw error;
      if (!data.user) throw new Error("No user returned");

      // Also create a record in our custom 'recyclers' table
      await supabase.from('recyclers').insert([{
        id: data.user.id,
        name: createdFacility.name,
        email: createdFacility.email,
        phone: createdFacility.phone,
        location: createdFacility.location,
        category: createdFacility.category,
        cpcb_number: createdFacility.cpcbNumber,
        verified: false
      }]);

      const userInfo: AuthUserInfo = {
        uid: data.user.id,
        email: data.user.email || trimmedEmail,
        displayName: displayName,
        role: detectedRole,
        facility: createdFacility,
      };
      return userInfo;
    } else {
      await new Promise((res) => setTimeout(res, 350));
      const userInfo: AuthUserInfo = {
        uid: "mock-facility-" + Math.random().toString(36).substring(2, 9),
        email: trimmedEmail,
        displayName: createdFacility.adminName || null,
        role: detectedRole,
        facility: createdFacility,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
      setUser(userInfo);
      setFacility(createdFacility);
      return userInfo;
    }
  }, []);

  const updateFacility = useCallback((facilityData: Partial<FacilityProfile>) => {
    setFacility(prev => {
      if (!prev) return prev;
      const updated: FacilityProfile = { ...prev, ...facilityData };
      if (user?.email) saveFacilityToRegistry(user.email.toLowerCase(), updated);
      setUser(currUser => currUser ? { ...currUser, facility: updated } : null);
      return updated;
    });
  }, [user]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setUser(null);
    setFacility(null);
  }, []);

  const resetPassword = useCallback(async (targetEmail: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.resetPasswordForEmail(targetEmail);
    }
  }, []);

  const currentRole: UserRole = user?.role || (facility?.email ? getUserRole(facility.email) : "recycler");

  const value: AuthContextType = {
    user,
    facility,
    role: currentRole,
    loading,
    isMockMode: !isSupabaseConfigured,
    login,
    register,
    updateFacility,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export default useAuth;
