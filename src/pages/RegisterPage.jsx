import RegisterForm from "@/components/RegisterForm";
import LoginHero from "../components/LoginHero";

export default function RegisterPage() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-pink-100 font-sans">
      <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden box-border pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <LoginHero />
        <RegisterForm />
      </div>
    </div>
  );
}
