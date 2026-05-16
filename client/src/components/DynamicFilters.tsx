import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Product } from '@/data/products';

interface FilterOptions {
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  materials: string[];
}

interface DynamicFiltersProps {
  products: Product[];
  onFilterChange: (filters: FilterOptions) => void;
}

export default function DynamicFilters({ products, onFilterChange }: DynamicFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    price: true,
    color: true,
    size: true,
    material: false,
  });

  const [filters, setFilters] = useState<FilterOptions>({
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, Math.max(...products.map(p => p.price))],
    materials: [],
  });

  // Extrair valores únicos
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).sort();
  const uniqueColors = Array.from(new Set(products.filter(p => p.color).map(p => p.color!))).sort();
  const uniqueSizes = Array.from(new Set(products.filter(p => p.size).map(p => p.size!))).sort();
  const uniqueMaterials = Array.from(new Set(products.filter(p => p.material).map(p => p.material!))).sort();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBrandChange = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    const newFilters = { ...filters, brands: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorChange = (color: string) => {
    const updated = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    const newFilters = { ...filters, colors: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeChange = (size: string) => {
    const updated = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    const newFilters = { ...filters, sizes: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMaterialChange = (material: string) => {
    const updated = filters.materials.includes(material)
      ? filters.materials.filter(m => m !== material)
      : [...filters.materials, material];
    const newFilters = { ...filters, materials: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const maxPrice = Math.max(...products.map(p => p.price));
    const newFilters: FilterOptions = {
      brands: [],
      colors: [],
      sizes: [],
      priceRange: [0, maxPrice],
      materials: [],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFiltersCount =
    filters.brands.length +
    filters.colors.length +
    filters.sizes.length +
    filters.materials.length;

  return (
    <div className="w-full bg-card rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-lg">Filtros</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Limpar ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Marca */}
      <div className="border-b border-border pb-6">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between py-2 hover:text-accent transition-colors"
        >
          <span className="font-semibold text-foreground">Marca</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.brand ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.brand && (
          <div className="mt-4 space-y-3">
            {uniqueBrands.map(brand => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => handleBrandChange(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                  {brand}
                  <span className="text-muted-foreground ml-2">
                    ({products.filter(p => p.brand === brand).length})
                  </span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preço */}
      <div className="border-b border-border pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 hover:text-accent transition-colors"
        >
          <span className="font-semibold text-foreground">Preço</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.price && (
          <div className="mt-4 space-y-4">
            <Slider
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={handlePriceChange}
              min={0}
              max={Math.max(...products.map(p => p.price))}
              step={100}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">
                R$ {filters.priceRange[0].toFixed(0).replace('.', ',')}
              </span>
              <span className="text-foreground">
                R$ {filters.priceRange[1].toFixed(0).replace('.', ',')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cor */}
      {uniqueColors.length > 0 && (
        <div className="border-b border-border pb-6">
          <button
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between py-2 hover:text-accent transition-colors"
          >
            <span className="font-semibold text-foreground">Cor</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.color ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSections.color && (
            <div className="mt-4 space-y-3">
              {uniqueColors.map(color => (
                <div key={color} className="flex items-center gap-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={filters.colors.includes(color)}
                    onCheckedChange={() => handleColorChange(color)}
                  />
                  <Label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                    {color}
                    <span className="text-muted-foreground ml-2">
                      ({products.filter(p => p.color === color).length})
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tamanho */}
      {uniqueSizes.length > 0 && (
        <div className="border-b border-border pb-6">
          <button
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between py-2 hover:text-accent transition-colors"
          >
            <span className="font-semibold text-foreground">Tamanho</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.size ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSections.size && (
            <div className="mt-4 space-y-3">
              {uniqueSizes.map(size => (
                <div key={size} className="flex items-center gap-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={filters.sizes.includes(size)}
                    onCheckedChange={() => handleSizeChange(size)}
                  />
                  <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                    {size}
                    <span className="text-muted-foreground ml-2">
                      ({products.filter(p => p.size === size).length})
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Material */}
      {uniqueMaterials.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection('material')}
            className="w-full flex items-center justify-between py-2 hover:text-accent transition-colors"
          >
            <span className="font-semibold text-foreground">Material</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.material ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSections.material && (
            <div className="mt-4 space-y-3">
              {uniqueMaterials.map(material => (
                <div key={material} className="flex items-center gap-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={filters.materials.includes(material)}
                    onCheckedChange={() => handleMaterialChange(material)}
                  />
                  <Label htmlFor={`material-${material}`} className="text-sm cursor-pointer">
                    {material}
                    <span className="text-muted-foreground ml-2">
                      ({products.filter(p => p.material === material).length})
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
