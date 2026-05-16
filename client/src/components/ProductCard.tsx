import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

/**
 * Design Philosophy: Minimalist Sophisticated European
 * - Subtle shadow on hover
 * - Smooth transitions (200-300ms)
 * - Clean typography hierarchy
 * - Generous whitespace
 */

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] flex flex-col h-full cursor-pointer">
      <Link href={`/produto/${product.id}`}>
        {/* Product Image */}
        <div className="relative overflow-hidden bg-muted h-64 md:h-72">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-foreground/60 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Price and Button */}
          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-accent">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          disabled={isAdding}
          className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium transition-all duration-200"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isAdding ? 'Adicionando...' : 'Adicionar'}
        </Button>
      </div>
    </div>
  );
}
