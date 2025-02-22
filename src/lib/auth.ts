// import { cookies } from "next/headers";
// import { AuthenticatedUser } from "@/types/auth";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret";

// export const decodeToken = (token: string): AuthenticatedUser | null => {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
//     return decoded;
//   } catch (error) {
//     console.error("Token decode error:", error);
//     return null;
//   }
// };

// export const getAuthUser = async (): Promise<AuthenticatedUser | null> => {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("auth-token");

//   if (!token) return null;

//   try {
//     const user = decodeToken(token.value);
//     return user;
//   } catch (error) {
//     return null;
//   }
// };

// export const isAuthenticated = async (): Promise<boolean> => {
//   const cookieStore = await cookies();
//   return !!cookieStore.get("auth-token");
// };

// export const hasRole = async (allowedRoles: string[]): Promise<boolean> => {
//   const cookieStore = await cookies();
//   const userRole = cookieStore.get("user-role")?.value;
//   return userRole ? allowedRoles.includes(userRole) : false;
// };

// Example of setting cookies during login
export const setAuthCookies = (accessToken: string, userRole: string) => {
  document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; secure; samesite=strict`;
  document.cookie = `userRole=${userRole}; path=/; max-age=86400; secure; samesite=strict`;
};

// Example of clearing cookies during logout
export const clearAuthCookies = () => {
  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
