import LoginHero from "@/components/LoginHero";
import LoginForm from "@/components/LoginForm";

export default function Loginn() {
  return (
    <div className="min-h-[100dvh] h-screen overflow-hidden bg-pink-100">
      <div className="h-full w-full flex overflow-hidden">
        <LoginHero />
        <LoginForm />
      </div>
    </div>
  );
}
