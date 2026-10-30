import React, { useState, useEffect } from 'react';
import { 
  CoffeeCard 
} from './components/CoffeeCard';
import { 
  Sidebar, 
  NavView 
} from './components/Sidebar';
import { 
  Header 
} from './components/Header';
import { 
  BrewConfiguratorModal 
} from './components/BrewConfiguratorModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  TelemetryTracker 
} from './components/TelemetryTracker';
import { 
  SensoryRadarModal 
} from './components/SensoryRadarModal';
import { 
  CommandPalette 
} from './components/CommandPalette';
import { 
  SubscriptionClub 
} from './components/SubscriptionClub';
import { 
  ProvenanceView 
} from './components/ProvenanceView';
import { 
  SensoryLabView 
} from './components/SensoryLabView';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  UserProfileModal 
} from './components/UserProfileModal';
import { 
  SystemeSubscriptionForm 
} from './components/SystemeSubscriptionForm';
import { 
  AuthProvider, 
  useAuth 
} from './context/AuthContext';
import { 
  COFFEE_MENU, 
  CoffeeItem, 
  BrewCustomization, 
  CartItem 
} from './data/coffeeData';
import { 
  playTactileClick, 
  playCremaChime, 
  setSoundEnabled, 
  getSoundEnabled 
} from './utils/audio';
import { 
  Flame, 
  Activity, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Coffee, 
  Award, 
  Check, 
  Zap, 
  Clock,
  SlidersHorizontal,
  Send,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

function ObsidianAppContent() {
  const { currentUser, isAuthenticated } = useAuth();

  const [currentView, setCurrentView] = useState<NavView>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roastFilter, setRoastFilter] = useState<number | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'seed-1',
      coffee: COFFEE_MENU[0], // Obsidian Nitro Cold Brew
      customization: {
        grind: 'Cold Extraction Ultra-Fine',
        milk: 'None (Black Terroir)',
        sweetener: 'None / Pure',
        temperature: 'Nitro Chilled (2°C)',
        extraShots: 0,
        nitrogenBoost: true,
        notes: '',
        quantity: 1,
      },
      calculatedPrice: 6.85,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals
  const [activeCoffeeForConfig, setActiveCoffeeForConfig] = useState<CoffeeItem | null>(null);
  const [activeCoffeeForRadar, setActiveCoffeeForRadar] = useState<CoffeeItem | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Audio Toggle
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Live order telemetry state
  const [activeOrderId, setActiveOrderId] = useState<string>('OBS-7294-X');
  const [hasActiveOrder, setHasActiveOrder] = useState<boolean>(true);
  const [orderStageName, setOrderStageName] = useState<string>('Hydro-Pressure Extraction (9.2 Bar)');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Keyboard shortcut for Command Palette (⌘K)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Filter Categories chips
  const categories = [
    { id: 'ALL', label: 'All Collections', color: '#FF9F43' },
    { id: 'FLASH_CHILL', label: 'Flash Chill & Nitro', color: '#00F2FE' },
    { id: 'SINGLE_ORIGIN', label: 'Single-Origin Pour Over', color: '#A78BFA' },
    { id: 'AEROPRESS', label: 'Aeropress Micro-lots', color: '#10B981' },
    { id: 'SIGNATURE_TONIC', label: 'Signature Tonics & Espressos', color: '#FBBF24' },
    { id: 'WHOLE_BEAN', label: 'Whole Bean Reserves', color: '#FF9F43' },
  ];

  // Filtering Coffee
  const filteredCoffees = COFFEE_MENU.filter((coffee) => {
    if (selectedCategory !== 'ALL' && coffee.category !== selectedCategory) {
      return false;
    }
    if (roastFilter !== null && coffee.roastIntensity !== roastFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = coffee.name.toLowerCase().includes(q);
      const matchSub = coffee.subname.toLowerCase().includes(q);
      const matchOrigin = coffee.origin.toLowerCase().includes(q);
      const matchTag = coffee.tag.toLowerCase().includes(q);
      const matchNotes = coffee.tastingNotes.some((n) => n.toLowerCase().includes(q));
      if (!matchName && !matchSub && !matchOrigin && !matchTag && !matchNotes) {
        return false;
      }
    }
    return true;
  });

  // Cart operations
  const handleAddToCart = (
    coffee: CoffeeItem,
    customization: BrewCustomization,
    calculatedPrice: number
  ) => {
    const newCartItem: CartItem = {
      cartItemId: `${coffee.id}-${Date.now()}`,
      coffee,
      customization,
      calculatedPrice,
    };
    setCartItems((prev) => [...prev, newCartItem]);
    showToast(`Added ${coffee.name} to order tray`);
  };

  const handleQuickAdd = (coffee: CoffeeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    playCremaChime();
    const defaultCustomization: BrewCustomization = {
      grind: coffee.category === 'WHOLE_BEAN' ? 'Whole Bean' : 'Espresso Fine (9 Bar)',
      milk: 'None (Black Terroir)',
      sweetener: 'None / Pure',
      temperature: coffee.defaultTemp,
      extraShots: 0,
      nitrogenBoost: coffee.category === 'FLASH_CHILL',
      notes: '',
      quantity: 1,
    };
    const newCartItem: CartItem = {
      cartItemId: `${coffee.id}-${Date.now()}`,
      coffee,
      customization: defaultCustomization,
      calculatedPrice: coffee.price,
    };
    setCartItems((prev) => [...prev, newCartItem]);
    showToast(`Quick added 1x ${coffee.name}`);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== id));
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === id) {
          const unitPrice = item.calculatedPrice / item.customization.quantity;
          return {
            ...item,
            customization: { ...item.customization, quantity: newQty },
            calculatedPrice: unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleCheckoutSuccess = (orderId: string) => {
    setActiveOrderId(orderId);
    setHasActiveOrder(true);
    setOrderStageName('Grinding & Saturated Infusion');
    setCartItems([]);
    setCurrentView('telemetry');
    showToast(`Order #${orderId} calibrated & dispatched to extraction bay!`);
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-[#e2e2eb] font-sans flex flex-col selection:bg-[#ff9f43]/30 selection:text-[#ffc697]">
      {/* Top Header with User Sign In / Profile */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        cartCount={cartItems.reduce((acc, i) => acc + i.customization.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentView={currentView}
        onSelectView={setCurrentView}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        user={currentUser}
        onOpenAuth={() => {
          setAuthModalMode('signin');
          setIsAuthModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main 12-Column Layout */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 md:px-6 py-4 flex gap-6">
        {/* Desktop Floating Sidebar Navigation (280px fixed width as specified) */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          cartCount={cartItems.reduce((acc, i) => acc + i.customization.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          activeOrderActive={hasActiveOrder}
          orderProgressStage={orderStageName}
          user={currentUser}
          onOpenAuth={() => {
            setAuthModalMode('signin');
            setIsAuthModalOpen(true);
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Central Ordering / Discovery Canvas */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-8">
          {/* VIEW 1: BARISTA EXTRACTION MENU */}
          {currentView === 'menu' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Feature Hero Specialty Highlight Card (Soft amber-to-rose & deep purple glass) */}
              <div className="relative rounded-[1.5rem] p-6 sm:p-8 bg-gradient-to-r from-[#181B24] via-[#202533] to-[#141721] border border-[#a78bfa]/40 overflow-hidden card-elevation group">
                {/* Ambient glow backdrop */}
                <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-[#ff9f43]/20 via-[#f43f5e]/15 to-[#a78bfa]/25 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="max-w-xl space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="tag-label px-3 py-1 rounded-full bg-[#ff9f43]/20 text-[#ffc697] border border-[#ff9f43]/40 font-bold">
                        FEATURED MICRO-LOT ALLOCATION
                      </span>
                      <span className="tag-label px-2.5 py-0.5 rounded-full bg-[#a78bfa]/20 text-[#d8caff] border border-[#a78bfa]/30">
                        94.8 PTS SQA
                      </span>
                    </div>

                    <h1 className="font-['Space_Grotesk'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      Panama Geisha & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9f43] via-[#ffc697] to-[#00f2fe]">Flash Nitrogen Extract</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-[#dac2b1]/90 font-['Plus_Jakarta_Sans'] leading-relaxed">
                      Sourced from Finca Deborah (1,950m MASL). Anaerobic cold maceration yields high floral frequencies of jasmine blossom, candied bergamot, and champagne acidity.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          playTactileClick();
                          setActiveCoffeeForConfig(COFFEE_MENU[3]); // Panama Geisha
                        }}
                        className="px-6 py-3 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider flex items-center gap-2"
                      >
                        <span>Configure Geisha Brew</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <button
                        onClick={(e) => {
                          playTactileClick();
                          setActiveCoffeeForRadar(COFFEE_MENU[3]);
                        }}
                        className="px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-['Space_Grotesk'] font-semibold text-[#dac2b1] hover:text-white flex items-center gap-1.5 transition-all"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#00f2fe]" />
                        <span>Inspect Sensory Radar</span>
                      </button>

                      {/* Quick jump to Systeme.io subscription form */}
                      <button
                        onClick={() => {
                          playTactileClick();
                          setCurrentView('subscriptions');
                        }}
                        className="px-4 py-3 rounded-full bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 border border-[#00f2fe]/30 text-xs font-['Space_Grotesk'] font-semibold text-[#00f2fe] flex items-center gap-1.5 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Systeme.io Subscription</span>
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Hero Visual */}
                  <div className="hidden sm:block relative w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden border border-white/20 shadow-2xl shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"
                      alt="Nitrogen Geisha Cold Extraction"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center text-[10px] font-['Space_Grotesk'] font-bold text-[#00f2fe] bg-black/60 backdrop-blur-md py-1 rounded-full border border-white/10">
                      CASCADE NITROGEN READY
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Pills Horizontal Scroller */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] text-sm font-bold text-white uppercase tracking-wider">
                      Extraction Categories
                    </span>
                    <span className="text-[11px] font-mono text-[#dac2b1]/60">
                      ({filteredCoffees.length} Available)
                    </span>
                  </div>

                  {/* Roast intensity filter selector */}
                  <div className="hidden sm:flex items-center gap-1.5 bg-[#141721] px-3 py-1.5 rounded-full border border-white/10 text-xs">
                    <span className="text-[10px] font-['Space_Grotesk'] uppercase text-white/50 font-bold mr-1">
                      Roast Level:
                    </span>
                    <button
                      onClick={() => setRoastFilter(null)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-['Space_Grotesk'] font-bold ${
                        roastFilter === null ? 'bg-[#ff9f43] text-[#0B0D13]' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          playTactileClick();
                          setRoastFilter(roastFilter === level ? null : level);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-['Space_Grotesk'] font-bold ${
                          roastFilter === level ? 'bg-[#FBBF24] text-[#0B0D13]' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        L{level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((cat, idx) => {
                    const isActive = selectedCategory === cat.id;
                    const activeColorClass =
                      idx % 3 === 0
                        ? 'bg-[#FF9F43] text-[#0B0D13]'
                        : idx % 3 === 1
                        ? 'bg-[#00F2FE] text-[#0B0D13]'
                        : 'bg-[#A78BFA] text-[#0B0D13]';

                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          playTactileClick();
                          setSelectedCategory(cat.id);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-['Space_Grotesk'] font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                          isActive
                            ? `${activeColorClass} shadow-md shadow-white/10 font-bold scale-[1.02]`
                            : 'bg-[#181B24] text-[#94A3B8] hover:text-white hover:bg-[#202533] border border-white/5'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coffee Cards Grid */}
              {filteredCoffees.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-[#141721] border border-white/10 space-y-3">
                  <Coffee className="w-10 h-10 text-white/30 mx-auto" />
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    No roasts match your current filter
                  </h3>
                  <p className="text-xs text-[#dac2b1]/70 max-w-sm mx-auto font-['Plus_Jakarta_Sans']">
                    Try clearing search query &ldquo;{searchQuery}&rdquo; or adjusting the roast intensity level.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                      setRoastFilter(null);
                    }}
                    className="px-4 py-2 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredCoffees.map((coffee) => (
                    <CoffeeCard
                      key={coffee.id}
                      coffee={coffee}
                      onOpenConfigurator={setActiveCoffeeForConfig}
                      onQuickAdd={handleQuickAdd}
                      onOpenRadar={(c) => setActiveCoffeeForRadar(c)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: TELEMETRY TRACKER */}
          {currentView === 'telemetry' && (
            <TelemetryTracker
              onBackToMenu={() => setCurrentView('menu')}
              orderId={activeOrderId}
              orderItemsCount={cartItems.length}
            />
          )}

          {/* VIEW 3: SUBSCRIPTIONS & MICRO-LOT RITUALS (with Systeme.io Form embedded) */}
          {currentView === 'subscriptions' && (
            <SubscriptionClub
              onSubscribeNotice={(tier) =>
                showToast(`Subscribed to ${tier} & synced with Systeme.io!`)
              }
              onOpenAuth={() => {
                setAuthModalMode('signin');
                setIsAuthModalOpen(true);
              }}
            />
          )}

          {/* VIEW 4: SENSORY LAB */}
          {currentView === 'sensory-lab' && (
            <SensoryLabView
              onSelectCoffee={(c) => setActiveCoffeeForConfig(c)}
              onOpenRadar={(c) => setActiveCoffeeForRadar(c)}
            />
          )}

          {/* VIEW 5: PROVENANCE & ROASTERY */}
          {currentView === 'provenance' && <ProvenanceView />}
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation Pill Bar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-[#141721]/95 backdrop-blur-2xl border border-white/15 rounded-full p-2 flex items-center justify-around shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
          <button
            onClick={() => {
              playTactileClick();
              setCurrentView('menu');
            }}
            className={`p-2.5 rounded-full flex flex-col items-center gap-1 transition-colors ${
              currentView === 'menu' ? 'text-[#ff9f43]' : 'text-white/50 hover:text-white'
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="text-[9px] font-['Space_Grotesk'] font-bold">Menu</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setCurrentView('telemetry');
            }}
            className={`p-2.5 rounded-full flex flex-col items-center gap-1 transition-colors relative ${
              currentView === 'telemetry' ? 'text-[#00f2fe]' : 'text-white/50 hover:text-white'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[9px] font-['Space_Grotesk'] font-bold">Telemetry</span>
            {hasActiveOrder && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setCurrentView('subscriptions');
            }}
            className={`p-2.5 rounded-full flex flex-col items-center gap-1 transition-colors ${
              currentView === 'subscriptions' ? 'text-[#a78bfa]' : 'text-white/50 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[9px] font-['Space_Grotesk'] font-bold">Reserves</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              if (currentUser) {
                setIsProfileModalOpen(true);
              } else {
                setAuthModalMode('signin');
                setIsAuthModalOpen(true);
              }
            }}
            className={`p-2.5 rounded-full flex flex-col items-center gap-1 transition-colors ${
              currentUser ? 'text-[#10B981]' : 'text-white/50 hover:text-white'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[9px] font-['Space_Grotesk'] font-bold">
              {currentUser ? 'Profile' : 'Sign In'}
            </span>
          </button>
        </div>
      </div>

      {/* Auth Modal (Sign In / Register / Demo Logins) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={showToast}
      />

      {/* Member Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenSystemeForm={() => setCurrentView('subscriptions')}
        onNotice={showToast}
      />

      {/* Brew Configurator Modal */}
      <BrewConfiguratorModal
        coffee={activeCoffeeForConfig}
        onClose={() => setActiveCoffeeForConfig(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Sensory Radar Modal */}
      <SensoryRadarModal
        coffee={activeCoffeeForRadar}
        onClose={() => setActiveCoffeeForRadar(null)}
        onOpenConfigurator={(c) => setActiveCoffeeForConfig(c)}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCoffee={(c) => setActiveCoffeeForConfig(c)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={handleCheckoutSuccess}
      />

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-[#181B24]/95 border border-[#00f2fe]/40 text-white text-xs font-['Space_Grotesk'] font-semibold shadow-[0_10px_28px_rgba(0,0,0,0.8)] flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ObsidianAppContent />
    </AuthProvider>
  );
}
