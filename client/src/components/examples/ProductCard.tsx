import ProductCard from '../ProductCard';
import { type Product } from '@shared/schema';

export default function ProductCardExample() {
  const mockProduct: Product = {
    id: 1,
    name: "Premium Cashews",
    price: "220.00",
    unit: "/kg",
    stock: 50,
    imageUrl: null,
    isSpecial: true,
  };

  return (
    <div className="max-w-sm">
      <ProductCard product={mockProduct} onClick={() => console.log('Product clicked')} />
    </div>
  );
}
