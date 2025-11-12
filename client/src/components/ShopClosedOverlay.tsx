import { Flower2 } from "lucide-react";
import { format } from "date-fns";

interface ShopClosedOverlayProps {
  closedMessage?: string | null;
  reopenDate?: Date | string | null;
}

export function ShopClosedOverlay({ closedMessage, reopenDate }: ShopClosedOverlayProps) {
  const formattedReopenDate = reopenDate 
    ? format(new Date(reopenDate), "EEEE, MMMM do, yyyy 'at' h:mm a")
    : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F3EE] px-6"
      data-testid="overlay-shop-closed"
    >
      <div className="max-w-2xl w-full text-center">
        {/* Decorative top border */}
        <div className="flex items-center justify-center mb-8 gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-black/20" />
          <Flower2 className="w-8 h-8 text-[#8B9F8D]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-black/20 to-black/20" />
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <h1 
            className="font-serif text-5xl md:text-6xl font-light tracking-widest text-black"
            data-testid="text-shop-closed-title"
          >
            SHOP CLOSED
          </h1>

          {closedMessage && (
            <p 
              className="font-sans text-lg md:text-xl text-black/70 leading-relaxed max-w-xl mx-auto"
              data-testid="text-closed-message"
            >
              {closedMessage}
            </p>
          )}

          {formattedReopenDate && (
            <div className="mt-8 pt-6 border-t border-black/10">
              <p className="font-sans text-sm uppercase tracking-widest text-black/50 mb-2">
                Reopening
              </p>
              <p 
                className="font-serif text-2xl font-light text-black"
                data-testid="text-reopen-date"
              >
                {formattedReopenDate}
              </p>
            </div>
          )}

          {/* Contact information */}
          <div className="mt-12 pt-8 border-t border-black/10">
            <p className="font-sans text-sm text-black/50">
              For urgent enquiries, please contact us at{" "}
              <a 
                href="mailto:info@thenosh.co" 
                className="text-[#8B9F8D] hover-elevate"
                data-testid="link-contact-email"
              >
                info@thenosh.co
              </a>
            </p>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="flex items-center justify-center mt-12 gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-black/20" />
          <Flower2 className="w-6 h-6 text-[#8B9F8D]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-black/20 to-black/20" />
        </div>
      </div>
    </div>
  );
}
