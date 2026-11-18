import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "../../contexts/AuthContext";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";
import PasswordInput from "../molecules/PasswordInput";
import Input from "../atoms/Input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");

    const { error } = await signIn(values.email, values.password);

    if (error) {
      setServerError(error.message);
      return;
    }

    navigate("/dashboard", { replace: true });
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

      <FormField
        label="Email Address"
        htmlFor="login-email"
        required
        error={errors.email?.message}
      >
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className="
            h-11 w-full rounded-lg border border-slate-300
            bg-white px-3 text-sm text-slate-800
            placeholder:text-slate-400
            focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-100
          "
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="login-password"
        required
        error={errors.password?.message}
      >
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          {...register("password")}
        />
      </FormField>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Sign In
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-green-700 hover:text-green-800"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
