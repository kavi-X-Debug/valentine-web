import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function FloatingHearts() {
  const hearts = [...Array(15)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    delay: `${Math.random() * 5}s`,
    scale: Math.random() * 0.5 + 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.8, 0],
            x: [0, Math.random() * 100 - 50, 0] // Swaying motion
          }}
          transition={{ 
            duration: parseFloat(heart.animationDuration), 
            repeat: Infinity, 
            delay: parseFloat(heart.delay),
            ease: "linear"
          }}
          style={{ 
            left: heart.left,
            position: 'absolute',
          }}
        >
          <Heart 
            className="text-love-pink/30 fill-current" 
            style={{ 
              width: `${heart.scale * 40}px`, 
              height: `${heart.scale * 40}px` 
            }} 
          />
        </motion.div>
      ))}
    </div>
  );
}
