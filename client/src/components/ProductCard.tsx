import { type Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `R ${numPrice.toFixed(2)}`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-green-50 to-green-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid={`img-product-${product.id}`}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-6xl text-gray-400">
            🍎
          </div>
        )}
        {product.isSpecial && (
          <span
            className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm"
            data-testid={`badge-special-${product.id}`}
          >
            Special
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900" data-testid={`text-price-${product.id}`}>
              <span className="text-base font-normal text-gray-700">R</span> {parseFloat(product.price).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600" data-testid={`text-unit-${product.id}`}>
              {product.unit}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2" data-testid={`text-stock-${product.id}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>
    </div>
  );
}
