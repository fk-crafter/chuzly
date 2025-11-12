export interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  hasOnboarded: boolean;
  plan: "TRIAL" | "FREE" | "PRO";
  trialEndsAt: string | null;
  isAdmin: boolean;
  createdAt: string;
}
