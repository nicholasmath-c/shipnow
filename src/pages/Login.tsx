import LoginForm from "../components/form/LoginForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import logo from "../assets/img/logo-shipnow-dark.png";
import bgLogin from "../assets/img/bg-login-2.png";

export default function Login() {
  return (
    <ProtectedRoute>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <img src={logo} alt="logo shipnow" width="150" />
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="items-center align-center bg-primary hidden rounded-l-[44px] justify-center lg:flex">
          <img
            src={bgLogin}
            alt="Image"
            className="h-full w-[80%] rounded-l-[44px] object-contain"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
