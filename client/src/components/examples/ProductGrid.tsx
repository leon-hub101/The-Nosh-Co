import ProductGrid from '../ProductGrid';
import { type Product } from '@shared/schema';

export default function ProductGridExample() {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Premium Cashews",
      price: "220.00",
      unit: "/kg",
      stock: 50,
      imageUrl: null,
      isSpecial: true,
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      price: "85.00",
      unit: "/pack",
      stock: 30,
      imageUrl: null,
      isSpecial: false,
    },
    {
      id: 3,
      name: "Roasted Almonds",
      price: "180.00",
      unit: "/kg",
      stock: 25,
      imageUrl: null,
      isSpecial: false,
    },
  ];

  return (
    <div className="p-4">
      <ProductGrid 
        products={mockProducts} 
        onProductClick={(product) => console.log('Product clicked:', product.name)}
      />
    </div>
  );
}
