import { useParams } from 'wouter';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import { toast } from 'sonner';

/**
 * Design Philosophy: Minimalist Sophisticated European
 * - Large product image with subtle shadow
 * - Clean typography hierarchy
 * - Generous whitespace
 */

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Produto não encontrado</h1>
          <Link href="/">
            <Button>Voltar para a loja</Button>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              {product.category}
            </p>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              {product.name}
            </h1>
            
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Preço</p>
              <p className="text-5xl font-bold text-accent">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </div>

            {/* Info */}
            <div className="mt-12 pt-8 border-t border-border space-y-4">
              <div>
                <h3 className="font-bold text-foreground mb-2">Sobre este produto</h3>
                <p className="text-foreground/60 text-sm">
                  Produto importado de qualidade premium, cuidadosamente selecionado para garantir a melhor experiência de compra.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Entrega</h3>
                <p className="text-foreground/60 text-sm">
                  Entrega em todo o país. Prazo de entrega será confirmado após o pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
