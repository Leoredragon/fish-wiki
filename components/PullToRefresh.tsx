'use client';

import { useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { triggerHapticLight } from '@/lib/capacitorUtils';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
  disabled?: boolean;
}

export default function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
  const router = useRouter();
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);

  const startYRef = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);

  const PULL_THRESHOLD = 75;
  const MAX_PULL = 110;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;

    // Only trigger if page is scrolled to top
    if (window.scrollY <= 0) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
      setHasTriggeredHaptic(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !isPullingRef.current || isRefreshing) return;
    if (window.scrollY > 0) {
      isPullingRef.current = false;
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      // Resistance effect
      const distance = Math.min(diff * 0.45, MAX_PULL);
      setPullDistance(distance);

      if (distance >= PULL_THRESHOLD && !hasTriggeredHaptic) {
        triggerHapticLight();
        setHasTriggeredHaptic(true);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || !isPullingRef.current || isRefreshing) return;
    isPullingRef.current = false;

    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(55);

      try {
        if (onRefresh) {
          await onRefresh();
        } else {
          router.refresh();
        }
      } catch (err) {
        console.error('Pull to refresh failed:', err);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 400);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-full"
    >
      {/* Pull Indicator — sit fully below sticky header (incl. safe-area), above header z */}
      <AnimatePresence>
        {(pullDistance > 10 || isRefreshing) && (
          <div
            className="fixed left-0 right-0 z-[60] flex justify-center pointer-events-none"
            style={{
              top: 'calc(4rem + env(safe-area-inset-top, 0px) + 0.5rem)'
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: -12 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: isRefreshing ? 0 : Math.max(0, pullDistance * 0.25)
              }}
              exit={{ scale: 0.7, opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-[#0F172A] border border-emerald-500/40 text-emerald-400 p-2.5 rounded-full shadow-2xl flex items-center justify-center"
            >
              {isRefreshing ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              ) : (
                <ArrowDown
                  className="w-5 h-5 text-emerald-400 transition-transform duration-200"
                  style={{
                    transform: `rotate(${Math.min((pullDistance / PULL_THRESHOLD) * 180, 180)}deg)`
                  }}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container Content */}
      <div
        style={{
          transform: pullDistance > 0 ? `translate3d(0, ${pullDistance * 0.3}px, 0)` : 'none',
          transition: isPullingRef.current ? 'none' : 'transform 0.25s cubic-bezier(0,0,0.2,1)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
