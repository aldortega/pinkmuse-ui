import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import LoginHero from "@/components/auth/LoginHero";

export default function ForgotPasswordPage() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-pink-100 font-sans">
      <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden box-border">
        <LoginHero />
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
