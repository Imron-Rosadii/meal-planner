import type { ReactNode } from "react";
import { Utensils } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20">
            <Utensils size={28} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Meal Planner
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Plan your meals, track your nutrition.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>

            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </div>

          {children}
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Meal Planner. All rights reserved.
        </p>
      </div>
    </main>
  );
}

export default AuthLayout;
