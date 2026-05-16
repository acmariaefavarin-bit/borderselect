import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'wouter';

interface MenuCategory {
  name: string;
  subcategories: string[];
}

const menuStructure: MenuCategory[] = [
  {
    name: "Eletrônicos",
    subcategories: ["Acessórios Apple", "Tablets", "Computadores", "Smartphones", "Wearables"],
  },
  {
    name: "Perfumaria",
    subcategories: ["Perfumes Femininos", "Perfumes Masculinos", "Fragrâncias Unissex"],
  },
  {
    name: "Cosméticos",
    subcategories: ["Blushes", "Corretivos", "Bases", "Sombras", "Batom"],
  },
  {
    name: "Eletroportáteis",
    subcategories: ["Aspiradores Robôs", "Eletrodomésticos", "Pequenos Eletros"],
  },
  {
    name: "Skincare",
    subcategories: ["Kits Skincare", "Cremes Faciais", "Séruns e Contornos", "Limpadores", "Protetores Solares"],
  },
  {
    name: "Cuidados Capilares",
    subcategories: ["Xampus", "Condicionadores", "Sprays Capilares", "Modeladores", "Tratamentos"],
  },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onClose}
        />
      )}

      {/* Megamenu */}
      <div
        className={`absolute top-full left-0 right-0 bg-card shadow-2xl z-40 transition-all duration-300 origin-top ${
          isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {menuStructure.map((category) => (
              <div key={category.name} className="space-y-4">
                <Link href={`/categoria/${category.name.toLowerCase()}`}>
                  <h3 className="font-bold text-foreground text-lg hover:text-accent transition-colors cursor-pointer">
                    {category.name}
                  </h3>
                </Link>
                <ul className="space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory}>
                      <Link href={`/categoria/${category.name.toLowerCase()}/${subcategory.toLowerCase()}`}>
                        <a className="text-foreground/60 hover:text-accent text-sm transition-colors">
                          {subcategory}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
