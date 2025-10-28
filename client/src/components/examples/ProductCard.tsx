import ProductCard from '../ProductCard';
import { type Product } from '@shared/schema';

export default function ProductCardExample() {
  const mockProduct: Product = {
    id: 1,
    name: "Premium Cashews",
    price500g: "110.00",
    price1kg: "220.00",
    imageUrl: null,
    isSpecial: true,
  };

  return (
    <div className="max-w-sm bg-background p-8">
      <ProductCard 
        product={mockProduct} 
        onAddToBasket={(id, size) => console.log(`Added product ${id} - ${size}`)} 
      />
    </div>
  );
}
