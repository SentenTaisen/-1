import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Coffee,
  Check,
  Plus,
  Minus
} from 'lucide-react';
import { CartItem } from '../data/coffeeData';
import { playTactileClick, playCremaChime, playDispatchBeep } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onCheckout: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const [deliveryType, setDeliveryType] = useState<'courier' | 'counter'>('courier');
  const [tipPercent, setTipPercent] = useState<number>(20);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Subtotal
  const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice, 0);
  const deliveryFee = deliveryType === 'courier' && items.length > 0 ? 3.50 : 0;
  const tipAmount = subtotal * (tipPercent / 100);
  const total = subtotal + deliveryFee + tipAmount;

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    playCremaChime();
    playDispatchBeep();

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedOrderId = `OBS-${Math.floor(1000 + Math.random() * 9000)}-X`;
      onCheckout(generatedOrderId);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md h-full glass-floating border-l border-white/12 flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ff9f43]/20 flex items-center justify-center text-[#ff9f43]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white tracking-tight">
                Your Order Tray
              </h2>
              <span className="text-[11px] font-['Space_Grotesk'] text-[#dac2b1]/60">
                {items.length} {items.length === 1 ? 'curated brew' : 'curated brews'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                <Coffee className="w-7 h-7" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                Your tray is currently empty
              </h3>
              <p className="text-xs text-[#dac2b1]/60 font-['Plus_Jakarta_Sans'] max-w-xs">
                Select an artisanal single-origin roast, flash chill nitro, or Geisha micro-lot from the barista extraction menu.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="p-4 rounded-2xl bg-[#141721] border border-white/10 hover:border-white/20 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.coffee.image}
                      alt={item.coffee.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white group-hover:text-[#ffc697] transition-colors">
                        {item.coffee.name}
                      </h4>
                      <span className="text-[10px] text-[#dac2b1]/70 block font-['Space_Grotesk']">
                        {item.coffee.origin}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playTactileClick();
                      onRemoveItem(item.cartItemId);
                    }}
                    className="text-white/40 hover:text-[#f43f5e] p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Customized specifications chips */}
                <div className="flex flex-wrap gap-1 text-[10px] font-['Space_Grotesk'] text-[#dac2b1]/80">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                    {item.customization.grind.split(' (')[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                    {item.customization.temperature.split(' (')[0]}
                  </span>
                  {item.customization.milk !== 'None (Black Terroir)' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#a78bfa]/15 text-[#d8caff] border border-[#a78bfa]/30">
                      {item.customization.milk}
                    </span>
                  )}
                  {item.customization.sweetener !== 'None / Pure' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30">
                      {item.customization.sweetener}
                    </span>
                  )}
                  {item.customization.extraShots > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ff9f43]/15 text-[#ffc697]">
                      +{item.customization.extraShots} Shot
                    </span>
                  )}
                  {item.customization.nitrogenBoost && (
                    <span className="px-2 py-0.5 rounded-full bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/30">
                      Nitro Charged
                    </span>
                  )}
                </div>

                {/* Price & Quantity stepper */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 bg-[#0E1118] px-2 py-1 rounded-full border border-white/10">
                    <button
                      onClick={() => {
                        playTactileClick();
                        onUpdateQuantity(item.cartItemId, item.customization.quantity - 1);
                      }}
                      className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-['Space_Grotesk'] text-xs font-bold text-white px-1">
                      {item.customization.quantity}
                    </span>
                    <button
                      onClick={() => {
                        playTactileClick();
                        onUpdateQuantity(item.cartItemId, item.customization.quantity + 1);
                      }}
                      className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-['Space_Grotesk'] text-sm font-bold text-[#ff9f43]">
                    ${item.calculatedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details, Delivery Selection, and Crema Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 bg-[#0c0e14] border-t border-white/10 space-y-4">
            {/* Delivery Method Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#141721] rounded-2xl border border-white/10 text-xs font-['Space_Grotesk'] font-bold">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setDeliveryType('courier');
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  deliveryType === 'courier'
                    ? 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/40 shadow-sm'
                    : 'text-[#dac2b1]/60 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Rapid Courier</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setDeliveryType('counter');
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  deliveryType === 'counter'
                    ? 'bg-[#ff9f43]/15 text-[#ff9f43] border border-[#ff9f43]/40 shadow-sm'
                    : 'text-[#dac2b1]/60 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Counter (5m)</span>
              </button>
            </div>

            {/* Tip selector pills */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-white/50">
                Barista Craft Tip
              </span>
              <div className="flex items-center gap-1.5">
                {[15, 20, 25, 0].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      playTactileClick();
                      setTipPercent(pct);
                    }}
                    className={`px-2 py-0.5 rounded-full font-['Space_Grotesk'] text-[11px] font-bold transition-colors ${
                      tipPercent === pct
                        ? 'bg-[#ff9f43] text-[#0B0D13]'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary lines */}
            <div className="space-y-1.5 text-xs text-[#dac2b1]/70 font-['Plus_Jakarta_Sans'] border-t border-white/5 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-['Space_Grotesk'] font-bold text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {deliveryType === 'courier' && (
                <div className="flex justify-between">
                  <span>Zero-Emission Rapid Dispatch</span>
                  <span className="font-['Space_Grotesk'] font-bold text-[#00f2fe]">
                    ${deliveryFee.toFixed(2)}
                  </span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>Artisanal Tip ({tipPercent}%)</span>
                  <span className="font-['Space_Grotesk'] font-bold text-[#FBBF24]">
                    ${tipAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-['Space_Grotesk'] font-bold text-white pt-2 border-t border-white/10">
                <span>Total Due</span>
                <span className="text-lg text-[#ff9f43]">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Crema Pill Button with Amber Pulse */}
            <button
              onClick={handleCheckoutClick}
              disabled={isSubmitting}
              className="w-full py-4 rounded-full crema-btn text-sm font-['Space_Grotesk'] font-bold tracking-wider uppercase flex items-center justify-center gap-2 crema-glow transition-transform active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Calibrating Groupheads...</span>
              ) : (
                <>
                  <span>Initiate Precision Extraction</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/40 font-['Space_Grotesk'] uppercase tracking-widest text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>PID Temperature & Vacuum Seal Guaranteed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
