export type UserRole = "customer" | "staff" | "admin" | "technician";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAtMs: number;
}
