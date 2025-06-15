
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

const FloatingHearts = ({ trigger }: { trigger: boolean }) => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    if (trigger) {
      const newHearts = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));

      setHearts(prev => [...prev, ...newHearts]);

      const timer = setTimeout(() => {
        setHearts(prev => prev.filter(heart => !newHearts.find(h => h.id === heart.id)));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-bounce"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            animationDuration: '2s',
            animationTimingFunction: 'ease-out',
          }}
        >
          <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
