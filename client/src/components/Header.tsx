export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-bold text-gray-900" data-testid="text-brand-name">
          The Nosh Co.
        </h1>
      </div>
    </header>
  );
}
