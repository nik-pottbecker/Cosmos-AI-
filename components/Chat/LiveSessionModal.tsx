import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, AudioWaveform } from 'lucide-react';
import { LiveSessionManager } from '../../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSessionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<LiveSessionManager | null>(null);
  const animationRef = useRef<number>();
  
  // Audio visualizer state
  const amplitudeRef = useRef(0); 

  useEffect(() => {
    if (isOpen) {
      const manager = new LiveSessionManager();
      managerRef.current = manager;
      
      manager.connect((amp) => {
        amplitudeRef.current = amp;
      }).then(() => {
        setIsConnected(true);
        draw();
      });
    } else {
      stopSession();
    }

    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const stopSession = () => {
    if (managerRef.current) {
      managerRef.current.disconnect();
      managerRef.current = null;
    }
    setIsConnected(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const draw = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    
    // Create a smooth wave effect
    const time = Date.now() / 1000;
    const amp = amplitudeRef.current; // Driven by mic input volume

    ctx.beginPath();
    ctx.moveTo(0, h / 2);

    for (let i = 0; i < w; i++) {
      // Multiple sine waves combined
      const y = h/2 + 
                Math.sin(i * 0.02 + time * 5) * (amp * 20 + 5) * Math.sin(time) +
                Math.sin(i * 0.05 + time * 2) * (amp * 10);
      ctx.lineTo(i, y);
    }
    
    ctx.strokeStyle = `rgba(99, 102, 241, ${0.5 + Math.min(amp, 0.5)})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Orb in the center that pulses
    const radius = 50 + amp * 50;
    const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, radius);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(w/2, h/2, radius, 0, Math.PI * 2);
    ctx.fill();

    // Decay amplitude slightly for smoothness if no input
    amplitudeRef.current = Math.max(0, amplitudeRef.current * 0.95);

    animationRef.current = requestAnimationFrame(draw);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg p-8 flex flex-col items-center">
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-light text-white mb-8 tracking-wide">
          Cosmos <span className="font-bold text-indigo-400">Live</span>
        </h2>

        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
          <canvas 
            ref={canvasRef} 
            width={300} 
            height={300} 
            className="absolute inset-0 w-full h-full"
          />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="animate-pulse text-indigo-300 text-sm">Connecting...</span>
            </div>
          )}
        </div>

        <p className="text-slate-400 text-center max-w-xs mb-8">
          Speak naturally. I'm listening to your math questions or just to chat.
        </p>

        <div className="flex gap-4">
          <button 
            className="p-4 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/50"
            onClick={onClose}
          >
            <Mic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
