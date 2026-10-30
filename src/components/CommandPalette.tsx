import React, { useEffect, useState, useRef } from 'react';
import { Search, X, Flame, Compass, ChevronRight, Zap } from 'lucide-react';
import { COFFEE_MENU, CoffeeItem } from '../data/coffeeData';
import { playTactileClick } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoffee: (coffee: CoffeeItem) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCoffee,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown handler for Escape & ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COFFEE_MENU.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.subname.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q) ||
      item.tastingNotes.some((n) => n.toLowerCase().includes(q))
    );
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#141721] border border-white/12 rounded-[1.5rem] shadow-[0_24px_70px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Recessed Inset Search input */}
        <div className="p-4 bg-[#0E1118] border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#00f2fe]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type drink name, origin, process, or flavor note..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-base text-white placeholder:text-white/30 font-['Plus_Jakarta_Sans']"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white p-1 text-xs"
            >
              Clear
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-['Space_Grotesk'] text-white/50">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#dac2b1]/60 text-xs font-['Plus_Jakarta_Sans']">
              No artisanal roast matching &ldquo;{query}&rdquo;. Try &ldquo;Bergamot&rdquo;, &ldquo;Nitro&rdquo;, or &ldquo;Huila&rdquo;.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playTactileClick();
                  onSelectCoffee(item);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#1B202E] cursor-pointer transition-all border border-transparent hover:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Space_Grotesk'] text-sm font-bold text-white group-hover:text-[#ffc697]">
                        {item.name}
                      </span>
                      <span className="tag-label text-[9px] px-1.5 py-0.2 rounded-full bg-white/5 text-[#dac2b1]">
                        {item.tag}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#dac2b1]/70 line-clamp-1 font-['Plus_Jakarta_Sans']">
                      {item.origin} • {item.tastingNotes.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-['Space_Grotesk'] text-xs font-bold text-[#ff9f43]">
                    ${item.price.toFixed(2)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick filter suggestions footer */}
        <div className="p-3 bg-[#0B0D13] border-t border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] text-[#dac2b1]/70 font-['Space_Grotesk']">
          <span className="text-white/40 uppercase text-[9px] font-bold">Suggested:</span>
          {['Nitro Chilled', 'Yirgacheffe', 'Jasmine', 'Pink Bourbon', 'Whole Bean'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white shrink-0"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
