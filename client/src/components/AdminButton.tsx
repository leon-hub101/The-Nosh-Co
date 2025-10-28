import { UserCog } from "lucide-react";

interface AdminButtonProps {
  onClick?: () => void;
}

export default function AdminButton({ onClick }: AdminButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-105"
      data-testid="button-admin"
      aria-label="Admin"
    >
      <UserCog className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}
