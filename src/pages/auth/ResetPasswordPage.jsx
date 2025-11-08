import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import LoginHero from "@/components/auth/LoginHero";

export default function ResetPasswordPage() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-pink-100 font-sans">
      <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden box-border">
        <LoginHero />
        <ResetPasswordForm />
      </div>
    </div>
  );
}
