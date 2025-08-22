"use server";
import { db } from "@/db";
import { RegisterSchemaType, user } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import { LoginType } from "@/types/auth";
import { desc, eq } from "drizzle-orm";

export const registerUser = async (data: RegisterSchemaType) => {
  const { email, firstName, lastName, password } = await data;
  console.log(data);
  try {
    const res = await auth.api.signUpEmail({
      body: {
        name: `${firstName} ${lastName}`,
        email,
        password,
        firstName,
        lastName,
      },
      asResponse: true,
    });

    if (res.ok) {
      return { success: "Sign up sucessfully!", ok: true };
    }
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (data: LoginType) => {
  const { email, password } = data;

  try {
    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    console.log(res);
    if (res.ok) {
      return { success: "Sign in sucessfully!", ok: true };
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async () => {
  try {
    const res = await db.select().from(user).orderBy(desc(user.createdAt));

    return { users: res };
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch users" };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await db.delete(user).where(eq(user.id, id));

    if (res.rowCount === 0) {
      return { error: "User not found or already deleted." };
    }

    return { success: "User deleted successfully." };
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return { error: "Internal server error." };
  }
};

export const updateUserRole = async (id: string, role: string) => {
  try {
    const updatedUser = await db
      .update(user)
      .set({ role })
      .where(eq(user.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return { error: "User not found or role not updated." };
    }

    console.log("Updated User:", updatedUser);
    return { success: "User role updated successfully.", user: updatedUser[0] };
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    return { error: "Internal server error." };
  }
};

export const banUser = async (id: string, reason: string, expiresAt?: Date) => {
  try {
    const updatedUser = await db
      .update(user)
      .set({
        banned: true,
        banReason: reason,
        banExpires: expiresAt ? expiresAt : null,
      })
      .where(eq(user.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return { error: "User not found or already banned." };
    }

    return { success: "User banned successfully.", user: updatedUser[0] };
  } catch (error) {
    console.error("❌ Error banning user:", error);
    return { error: "Internal server error." };
  }
};

export const unbanUser = async (id: string) => {
  try {
    const updatedUser = await db
      .update(user)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
      })
      .where(eq(user.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return { error: "User not found or not banned." };
    }

    return { success: "User unbanned successfully.", user: updatedUser[0] };
  } catch (error) {
    console.error("❌ Error unbanning user:", error);
    return { error: "Internal server error." };
  }
};
