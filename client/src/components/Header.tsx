import { ShoppingBasket } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-card-border">
      <div className="flex items-center justify-between h-20 md:h-24 px-6 md:px-12 max-w-6xl mx-auto">
        <h1 
          className="text-xl md:text-2xl font-serif font-light tracking-widest uppercase text-foreground" 
          data-testid="text-brand-name"
        >
          The Nosh Co.
        </h1>
        <button 
          className="relative p-2 hover:opacity-70 transition-opacity"
          data-testid="button-basket"
          onClick={() => console.log('Basket clicked')}
        >
          <ShoppingBasket className="w-6 h-6 text-foreground" strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full font-sans">
            0
          </span>
        </button>
      </div>
    </header>
  );
}
