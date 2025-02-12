import { Toaster } from "@/components/ui/toaster";
import AuthPage from "@/views/auth";

export default function Auth() {

  return (
    <div className="bg-white-secondary">
      <Toaster />
      <AuthPage />
    </div>
  );
}