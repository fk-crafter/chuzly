import { LoginModal } from "@/components/LoginModal";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background">
      <LoginModal />
      <BackgroundBeams className="hidden md:block" />
    </div>
  );
}
