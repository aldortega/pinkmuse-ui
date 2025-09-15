import LoginHero from "@/components/LoginHero";
import LoginForm from "@/components/LoginForm";

export default function Loginn() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-pink-100 p-3 sm:p-4 lg:p-6 box-border">
      <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden box-border rounded-2xl border border-pink-200 bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <LoginHero />
        <LoginForm />
      </div>
    </div>
  );
}
