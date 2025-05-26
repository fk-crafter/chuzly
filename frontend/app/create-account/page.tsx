import { CreateAccountModal } from "@/components/CreateAccountModal";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function CreatePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background">
      <CreateAccountModal />
      <BackgroundBeams />
    </div>
  );
}
