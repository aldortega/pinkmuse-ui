import LoginHero from "@/components/LoginHero";
import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-pink-100">
      <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden box-border pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <LoginHero />
        <LoginForm />
      </div>
    </div>
  );
}
