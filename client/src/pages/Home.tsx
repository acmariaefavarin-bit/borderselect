import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { categories, products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import SearchBar from '@/components/SearchBar';
import MegaMenu from '@/components/MegaMenu';
import DynamicFilters from '@/components/DynamicFilters';
import QuickView from '@/components/QuickView';

/**
 * Design Philosophy: Minimalist Sophisticated European - Border Select
 * - Playfair Display para títulos (elegância premium)
 * - Inter para corpo (legibilidade)
 * - Paleta: Bege claro (#F5F1ED), preto sofisticado (#1A1A1A), ouro suave (#D4AF37)
 * - Megamenu com categorias e subcategorias
 * - Filtros dinâmicos na lateral
 * - Barra de busca inteligente
 * - Quick View para visualização rápida
 */

interface FilterOptions {
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  materials: string[];
}

export default function Home() {
  const { itemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, Math.max(...products.map(p => p.price))],
    materials: [],
  });
  const [quickViewProduct, setQuickViewProduct] = useState<typeof products[0] | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Filtro de categoria
      if (selectedCategory && p.category !== selectedCategory) return false;

      // Filtro de marca
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;

      // Filtro de preço
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;

      // Filtro de cor
      if (filters.colors.length > 0 && (!p.color || !filters.colors.includes(p.color))) return false;

      // Filtro de tamanho
      if (filters.sizes.length > 0 && (!p.size || !filters.sizes.includes(p.size))) return false;

      // Filtro de material
      if (filters.materials.length > 0 && (!p.material || !filters.materials.includes(p.material))) return false;

      return true;
    });
  }, [selectedCategory, filters]);

  const handleQuickView = (product: typeof products[0]) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground cursor-pointer">
                <span className="text-accent">Border</span> Select
              </h1>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 mx-8">
              <SearchBar onClose={() => setIsMegaMenuOpen(false)} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden pb-4">
            <SearchBar onClose={() => setIsMegaMenuOpen(false)} />
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8 py-4 border-t border-border">
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center gap-2 font-medium text-foreground hover:text-accent transition-colors relative"
            >
              Categorias
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isMegaMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setIsMegaMenuOpen(false);
              }}
              className={`font-medium transition-colors ${
                selectedCategory === null
                  ? 'text-accent'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Todos os Produtos
            </button>
          </div>

          {/* Megamenu */}
          <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setIsMobileMenuOpen(false);
                }}
                className="text-sm font-medium text-left py-2 hover:text-accent transition-colors"
              >
                Todos os Produtos
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-left py-2 hover:text-accent transition-colors"
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663557896325/hAjeyTTpeJMYwiyBWYdBLx/hero-banner-ejoJXSoyfpxzKgu26oUUSk.webp"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Border Select
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Produtos importados premium selecionados com excelência
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => setSelectedCategory(null)}
              >
                Explorar Coleção
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <DynamicFilters products={filteredProducts.length > 0 ? filteredProducts : products} onFilterChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {selectedCategory && (
                    <>
                      <h2 className="text-3xl font-bold text-foreground mb-2">{selectedCategory}</h2>
                      <div className="w-12 h-1 bg-accent"></div>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    {/* Quick View Button */}
                    <button
                      onClick={() => handleQuickView(product)}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white text-foreground p-2 rounded-lg shadow-lg transition-all opacity-0 hover:opacity-100 z-10"
                      title="Visualização Rápida"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg mb-4">Nenhum produto encontrado com os filtros selecionados.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory(null);
                    setFilters({
                      brands: [],
                      colors: [],
                      sizes: [],
                      priceRange: [0, Math.max(...products.map(p => p.price))],
                      materials: [],
                    });
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Border Select</h3>
              <p className="text-background/80 text-sm">
                Loja premium de produtos importados com seleção cuidadosa e qualidade garantida.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contato</h3>
              <p className="text-background/80 text-sm">
                WhatsApp: +595 985 919 788<br />
                Email: contato@borderselect.com
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Informações</h3>
              <p className="text-background/80 text-sm">
                Entrega em todo o país<br />
                Pagamento seguro<br />
                Garantia de qualidade
              </p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-background/60 text-sm">
            <p>&copy; 2026 Border Select. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
