import { useState, useEffect, useRef } from 'react';
import { Search, Clock, X } from 'lucide-react';
import { products } from '@/data/products';
import { Link } from 'wouter';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Carregar histórico de busca do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Filtrar sugestões enquanto digita
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      // Adicionar ao histórico
      const updated = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 5);
      setSearchHistory(updated);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      
      setQuery(searchTerm);
      setIsOpen(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar produtos, marcas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-10 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-background rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-2xl border border-border z-50 max-h-96 overflow-y-auto">
          {/* Sugestões de produtos */}
          {suggestions.length > 0 && (
            <div className="border-b border-border">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Produtos
              </div>
              {suggestions.map((product) => (
                <Link key={product.id} href={`/produto/${product.id}`}>
                  <a
                    onClick={() => {
                      handleSearch(query);
                      onClose?.();
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.brand}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-accent whitespace-nowrap">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          )}

          {/* Histórico de busca */}
          {query.length === 0 && searchHistory.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Buscas Recentes
                </span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpar
                </button>
              </div>
              {searchHistory.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(term)}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Sem resultados */}
          {query.length > 0 && suggestions.length === 0 && (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <p className="text-sm">Nenhum produto encontrado para "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
