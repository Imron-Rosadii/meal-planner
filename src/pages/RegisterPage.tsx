import AuthLayout from "../components/templates/AuthLayout";
import RegisterForm from "../components/organisms/RegisterForm";

function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      description="Create an account to start managing your meals and nutrition."
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
