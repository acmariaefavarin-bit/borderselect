import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Design Philosophy: Minimalist Sophisticated European
 * - Smooth slide-in animation from right (400ms ease-out)
 * - Clean layout with generous spacing
 * - Subtle shadows and borders
 */

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Format message for WhatsApp
    const itemsList = items
      .map(item => `• ${item.name} - Quantidade: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`)
      .join('%0A');
    
    const message = `Olá! Gostaria de fazer um pedido:%0A%0A${itemsList}%0A%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const whatsappUrl = `https://wa.me/595985919788?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Carrinho</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-foreground/60 text-lg mb-4">Seu carrinho está vazio</p>
              <p className="text-foreground/40 text-sm">Adicione produtos para começar suas compras</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-border last:border-0"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-muted"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-accent font-bold mb-3">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-foreground/60">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-accent">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 text-base"
              >
                Finalizar Compra via WhatsApp
              </Button>
              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full"
              >
                Limpar Carrinho
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full"
              >
                Continuar Comprando
              </Button>
            </div>

            {/* Info */}
            <p className="text-xs text-foreground/50 text-center">
              Você será redirecionado para o WhatsApp para confirmar seu pedido
            </p>
          </div>
        )}
      </div>
    </>
  );
}
