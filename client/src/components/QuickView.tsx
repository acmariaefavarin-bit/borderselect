import { X, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';
import { toast } from 'sonner';
import { Link } from 'wouter';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Design Philosophy: Minimalist Sophisticated European
 * - Modal elegante com sombra suave
 * - Imagem grande do produto
 * - Informações organizadas e claras
 * - Botões de ação destacados
 */

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const { addItem } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-card rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-foreground">Visualização Rápida</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="flex items-center justify-center">
                <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between">
                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      {product.category}
                    </p>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      {product.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Marca: <span className="font-semibold text-foreground">{product.brand}</span>
                    </p>
                  </div>

                  <p className="text-foreground/70 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                    {product.color && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Cor</p>
                        <p className="font-semibold text-foreground">{product.color}</p>
                      </div>
                    )}
                    {product.size && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Tamanho</p>
                        <p className="font-semibold text-foreground">{product.size}</p>
                      </div>
                    )}
                    {product.material && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Material</p>
                        <p className="font-semibold text-foreground">{product.material}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Categoria</p>
                      <p className="font-semibold text-foreground">{product.subcategory}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-2">Preço</p>
                    <p className="text-4xl font-bold text-accent">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 text-base"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  <Link href={`/produto/${product.id}`}>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Ver Detalhes Completos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
