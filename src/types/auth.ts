export type UserRole = "user" | "admin" | "super-admin";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
