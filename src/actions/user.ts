"use server";

import { API_ROUTES } from "@/utils/api";

export async function fetchUserProfile() {
  try {
    const response = await fetch(`${API_ROUTES.USER}/profile`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    return { success: true, data: data.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch profile",
    };
  }
}

export async function updateUserProfile(data: {
  name?: string;
  email?: string;
}) {
  try {
    const response = await fetch(`${API_ROUTES.USER}/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    const responseData = await response.json();
    return { success: true, data: responseData.user };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
