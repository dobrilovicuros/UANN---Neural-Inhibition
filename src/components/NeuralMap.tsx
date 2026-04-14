import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClusterType } from '../types';

interface NeuralMapProps {
  matrix: Record<ClusterType, Record<ClusterType, number>>;
  activeClusters: ClusterType[];
  clusters: { type: ClusterType; name: string; color: string }[];
}

export const NeuralMap: React.FC<NeuralMapProps> = ({ matrix, activeClusters, clusters }) => {
  // Define positions for nodes in a circle or pentagon
  const positions = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    const radius = 35;
    const pos: Record<string, { x: number; y: number }> = {};
    
    clusters.forEach((c, i) => {
      const angle = (i / clusters.length) * 2 * Math.PI - Math.PI / 2;
      pos[c.type] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    return pos;
  }, [clusters]);

  return (
    <div className="relative w-full aspect-square bg-black/40 rounded-xl border border-white/5 overflow-hidden">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Draw Connections (Edges) */}
        {clusters.map(source => 
          clusters.map(target => {
            if (source.type === target.type) return null;
            const weight = matrix[source.type][target.type];
            if (Math.abs(weight) < 0.01) return null;

            const start = positions[source.type];
            const end = positions[target.type];
            const isActive = activeClusters.includes(source.type);
            
            return (
              <motion.line
                key={`${source.type}-${target.type}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={weight > 0 ? '#10b981' : '#ef4444'}
                strokeWidth={Math.abs(weight) * 5}
                strokeOpacity={isActive ? 0.6 : 0.1}
                initial={false}
                animate={{
                  strokeDasharray: isActive ? [ "0, 10", "10, 0" ] : "none",
                  strokeOpacity: isActive ? 0.6 : 0.1,
                }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            );
          })
        )}

        {/* Draw Nodes */}
        {clusters.map(c => {
          const pos = positions[c.type];
          const isActive = activeClusters.includes(c.type);
          
          return (
            <g key={c.type}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 4 : 3}
                fill={isActive ? c.color : '#333'}
                initial={false}
                animate={{
                  r: isActive ? [4, 5, 4] : 3,
                  fill: isActive ? c.color : '#333',
                  filter: isActive ? `drop-shadow(0 0 4px ${c.color})` : 'none'
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text 
                x={pos.x} 
                y={pos.y + 6} 
                textAnchor="middle" 
                className="text-[3px] fill-zinc-500 font-bold uppercase pointer-events-none"
                style={{ fontSize: '3px' }}
              >
                {c.name.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-2 left-2 flex gap-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-0.5 bg-emerald-500"></div>
          <span className="text-[8px] text-zinc-500 uppercase">Excitation</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-0.5 bg-red-500"></div>
          <span className="text-[8px] text-zinc-500 uppercase">Inhibition</span>
        </div>
      </div>
    </div>
  );
};
