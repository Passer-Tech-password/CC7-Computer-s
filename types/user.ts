export type UserRole = "customer" | "staff" | "admin" | "technician";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  createdAtMs: number;
}
