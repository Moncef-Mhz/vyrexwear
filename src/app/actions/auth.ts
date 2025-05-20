"use server";
import { RegisterSchemaType } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import { LoginType } from "@/types/auth";

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
