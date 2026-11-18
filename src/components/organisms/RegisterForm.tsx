import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "../../contexts/AuthContext";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";
import Input from "../atoms/Input";
import PasswordInput from "../molecules/PasswordInput";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const { signUp } = useAuth();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");
    setSuccessMessage("");

    const { error } = await signUp(
      values.email,
      values.password,
      values.fullName,
    );

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccessMessage(
      "Registration successful. If email confirmation is enabled, please check your inbox.",
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      {successMessage && (
        <div
          className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
          role="status"
        >
          {successMessage}
        </div>
      )}

      <FormField
        label="Full Name"
        htmlFor="register-name"
        required
        error={errors.fullName?.message}
      >
        <Input
          id="register-name"
          placeholder="Your full name"
          autoComplete="name"
          {...register("fullName")}
        />
      </FormField>

      <FormField
        label="Email Address"
        htmlFor="register-email"
        required
        error={errors.email?.message}
      >
        <Input
          id="register-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="register-password"
        required
        error={errors.password?.message}
        hint="Use at least 8 characters."
      >
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Confirm Password"
        htmlFor="confirm-password"
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Create Account
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-green-700 hover:text-green-800"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
