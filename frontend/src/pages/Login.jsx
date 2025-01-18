import AuthPage from "@/components/AuthPage";

function Login() {
  return <AuthPage route="/api/token/" method="login" />;
}

export default Login;
