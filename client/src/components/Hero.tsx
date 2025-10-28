export default function Hero() {
  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-stone-100">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          className="w-full h-full opacity-5" 
          viewBox="0 0 200 200" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5"
        >
          {/* Decorative botanical pattern */}
          <circle cx="100" cy="80" r="30" />
          <path d="M 100 50 Q 70 25, 50 50" />
          <path d="M 100 50 Q 130 25, 150 50" />
          <path d="M 50 50 Q 40 85, 60 110" />
          <path d="M 150 50 Q 160 85, 140 110" />
          <path d="M 60 110 Q 75 135, 100 145" />
          <path d="M 140 110 Q 125 135, 100 145" />
        </svg>
      </div>
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide text-foreground mb-4">
          Premium Fruits & Nuts
        </h1>
        <p className="text-lg md:text-xl font-sans text-gray-700 mb-8 max-w-2xl">
          Curated selections delivered to your door
        </p>
        <button 
          onClick={() => {
            console.log('Explore clicked');
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="backdrop-blur-md bg-white/90 text-black px-8 py-3 text-sm font-sans tracking-widest uppercase hover:bg-white transition-colors border border-stone-200"
          data-testid="button-explore"
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
}
