import ProductGrid from '../ProductGrid';
import { type Product } from '@shared/schema';

export default function ProductGridExample() {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Premium Cashews",
      price500g: "110.00",
      price1kg: "220.00",
      imageUrl: null,
      isSpecial: true,
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      price500g: "42.50",
      price1kg: "85.00",
      imageUrl: null,
      isSpecial: false,
    },
    {
      id: 3,
      name: "Roasted Almonds",
      price500g: "90.00",
      price1kg: "180.00",
      imageUrl: null,
      isSpecial: false,
    },
  ];

  return (
    <div className="p-8 bg-background">
      <ProductGrid 
        products={mockProducts} 
        onAddToBasket={(id, size) => console.log(`Added product ${id} - ${size}`)}
      />
    </div>
  );
}
