import AuthLayout from "../components/templates/AuthLayout";
import LoginForm from "../components/organisms/LoginForm";

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your account to continue planning your meals."
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
