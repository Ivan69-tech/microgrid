import React, { useState } from 'react';

interface PowerFlowDiagramProps {
  pv: number;
  load: number;
  bess: number;
  genset: number;
  soc: number;
  blackout: boolean;
}

// Composant pour les icônes SVG
const SVGIcon: React.FC<{ 
  name: string; 
  className?: string; 
  size?: number;
}> = ({ name, className = '', size = 48 }) => {
  const icons: { [key: string]: string } = {
    battery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="7" width="16" height="10" rx="2" ry="2"/>
      <line x1="6" y1="11" x2="6" y2="13"/>
      <line x1="10" y1="11" x2="10" y2="13"/>
      <line x1="14" y1="11" x2="14" y2="13"/>
      <line x1="18" y1="11" x2="18" y2="13"/>
    </svg>`,
    solar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`,
    generator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <circle cx="12" cy="10" r="2"/>
      <path d="M8 10h8"/>
    </svg>`,
    grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <circle cx="12" cy="12" r="1"/>
    </svg>`,
    load: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <path d="M7 7h10v4H7z"/>
      <path d="M7 11h10v4H7z"/>
    </svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    charging: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1"/>
      <path d="M6 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/>
      <line x1="12" y1="11" x2="12" y2="13"/>
      <line x1="12" y1="7" x2="12" y2="9"/>
      <line x1="12" y1="15" x2="12" y2="17"/>
    </svg>`,
    discharging: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 17h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6"/>
      <path d="M18 17h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1"/>
      <line x1="12" y1="11" x2="12" y2="13"/>
      <line x1="12" y1="7" x2="12" y2="9"/>
      <line x1="12" y1="15" x2="12" y2="17"/>
    </svg>`
  };

  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: icons[name] || '' }}
    />
  );
};

// Composant pour les lignes de flux animées
const AnimatedFlowLine: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  intensity: number;
  direction: 'forward' | 'backward' | 'bidirectional';
  label?: string;
}> = ({ from, to, color, intensity, direction, label }) => {
  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
  
  const animationDirection = direction === 'backward' ? 'reverse' : 'normal';
  const opacity = Math.min(100, Math.max(30, intensity * 15));
  
  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        left: from.x,
        top: from.y,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0'
      }}
    >
      <div 
        className="relative"
        style={{ width: length, height: 6 }}
      >
        {/* Ligne de fond */}
        <div 
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: '100%',
            background: `rgba(0,0,0,0.1)`,
            opacity: 0.3
          }}
        />
        
        {/* Flux animé */}
        <div 
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: '100%',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            animation: `flow-${direction} 2s linear infinite ${animationDirection}`,
            opacity: opacity / 100
          }}
        />
        
        {/* Particules animées */}
        <div 
          className="absolute top-1 w-2 h-2 rounded-full"
          style={{
            background: color,
            animation: `particle-flow-${direction} 2s linear infinite ${animationDirection}`,
            boxShadow: `0 0 12px ${color}`,
            opacity: opacity / 100
          }}
        />
        
        {/* Flèche de direction */}
        <div 
          className="absolute top-1 right-0 w-0 h-0"
          style={{
            borderLeft: `4px solid ${color}`,
            borderTop: '2px solid transparent',
            borderBottom: '2px solid transparent',
            opacity: opacity / 100
          }}
        />
        
        {/* Label du flux */}
        {label && (
          <div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium px-2 py-1 rounded"
            style={{
              background: 'rgba(255,255,255,0.9)',
              color: color,
              border: `1px solid ${color}`,
              opacity: opacity / 100
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

const PowerFlowDiagram: React.FC<PowerFlowDiagramProps> = ({
  pv,
  load,
  bess,
  genset,
  soc,
  blackout
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Calculer les flux (pour usage futur si nécessaire)
  // const pvToLoad = Math.min(pv, load);
  // const pvToBess = Math.max(0, pv - load);
  // const bessToLoad = Math.max(0, load - pv);
  // const gensetToLoad = Math.max(0, load - pv - Math.abs(bess));
  
  // Couleurs selon le mode
  const colors = {
    light: {
      background: 'bg-gradient-to-br from-slate-50 to-blue-50',
      card: 'bg-white',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      pv: 'text-yellow-600',
      bess: bess > 0 ? 'text-green-600' : bess < 0 ? 'text-red-600' : 'text-gray-500',
      genset: 'text-blue-600',
      load: 'text-orange-600',
      grid: blackout ? 'text-red-600' : 'text-green-600',
      flow: {
        pv: '#f59e0b',
        bess: bess > 0 ? '#10b981' : '#ef4444',
        genset: '#3b82f6',
        load: '#f97316'
      }
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-blue-900',
      card: 'bg-gray-800',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700',
      pv: 'text-yellow-400',
      bess: bess > 0 ? 'text-green-400' : bess < 0 ? 'text-red-400' : 'text-gray-400',
      genset: 'text-blue-400',
      load: 'text-orange-400',
      grid: blackout ? 'text-red-400' : 'text-green-400',
      flow: {
        pv: '#fbbf24',
        bess: bess > 0 ? '#34d399' : '#f87171',
        genset: '#60a5fa',
        load: '#fb923c'
      }
    }
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  // Fonction pour déterminer si une flèche doit être affichée
  const shouldShowFlow = (power: number) => {
    return Math.abs(power) > 0.1;
  };

  return (
    <>
      {/* Styles CSS pour les animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes flow-forward {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes flow-backward {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          @keyframes flow-bidirectional {
            0%, 100% { transform: translateX(-50%); }
            50% { transform: translateX(50%); }
          }
          @keyframes particle-flow-forward {
            0% { left: -8px; }
            100% { left: calc(100% + 8px); }
          }
          @keyframes particle-flow-backward {
            0% { left: calc(100% + 8px); }
            100% { left: -8px; }
          }
          @keyframes particle-flow-bidirectional {
            0%, 100% { left: 0%; }
            50% { left: calc(100% - 8px); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px currentColor; }
            50% { box-shadow: 0 0 40px currentColor; }
          }
          @keyframes rotate-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />

      <div className={`${theme.background} rounded-2xl shadow-2xl border ${theme.border} p-8 mt-8 transition-all duration-500`}>
        {/* Header avec toggle dark mode */}
        <div className="flex justify-between items-center mb-8">
          <h3 className={`text-3xl font-bold ${theme.text} flex items-center gap-3`}>
            <SVGIcon name="grid" size={32} className={theme.grid} />
            Flux de Puissance du Microgrid
      </h3>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-xl ${theme.card} border ${theme.border} hover:shadow-lg transition-all duration-300`}
            title="Basculer le mode clair/sombre"
          >
            <SVGIcon 
              name={isDarkMode ? "solar" : "battery"} 
              size={24} 
              className={theme.textSecondary} 
            />
          </button>
        </div>
        
        <div className="relative min-h-[600px] lg:min-h-[700px] w-full">
          {/* Layout principal */}
          <div className="flex flex-col items-center justify-center h-full space-y-8 lg:space-y-16">
          
          {/* PV (en haut) */}
            <div className={`text-center p-4 lg:p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-xs lg:max-w-sm`}>
              <div className="mb-3 lg:mb-4">
                <SVGIcon 
                  name="solar" 
                  size={48} 
                  className={`${theme.pv} animate-pulse lg:hidden`} 
                />
                <SVGIcon 
                  name="solar" 
                  size={64} 
                  className={`${theme.pv} animate-pulse hidden lg:block`} 
                />
              </div>
              <div className={`text-lg lg:text-xl font-bold ${theme.text}`}>Centrale Photovoltaïque</div>
              <div className={`text-2xl lg:text-3xl font-bold ${theme.pv} mb-2`}>{pv.toFixed(1)} kW</div>
              <div className={`text-xs lg:text-sm ${theme.textSecondary}`}>Production solaire</div>
          </div>

          {/* Ligne horizontale avec BESS, Réseau, Load */}
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8 xl:space-x-20 w-full">
            
            {/* BESS (à gauche) */}
              <div className={`text-center p-4 lg:p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-xs lg:max-w-sm`}>
                <div className="mb-3 lg:mb-4">
                  <SVGIcon 
                    name={bess > 0 ? "charging" : bess < 0 ? "discharging" : "battery"} 
                    size={48} 
                    className={`${theme.bess} ${bess !== 0 ? 'animate-pulse' : ''} lg:hidden`} 
                  />
                  <SVGIcon 
                    name={bess > 0 ? "charging" : bess < 0 ? "discharging" : "battery"} 
                    size={64} 
                    className={`${theme.bess} ${bess !== 0 ? 'animate-pulse' : ''} hidden lg:block`} 
                  />
                </div>
                <div className={`text-lg lg:text-xl font-bold ${theme.text}`}>BESS</div>
                <div className={`text-2xl lg:text-3xl font-bold ${theme.bess} mb-2`}>
                {Math.abs(bess).toFixed(1)} kW
                </div>
                <div className={`text-xs lg:text-sm ${theme.textSecondary}`}>
                  SOC: {soc.toFixed(1)}%
                </div>
                <div className={`text-xs ${theme.textSecondary} mt-1`}>
                  {bess > 0 ? 'Charge' : bess < 0 ? 'Décharge' : 'Neutre'}
                </div>
            </div>

            {/* Réseau (au centre) */}
              <div className={`text-center p-4 lg:p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-xs lg:max-w-sm ${blackout ? 'ring-2 ring-red-500' : 'ring-2 ring-green-500'}`}>
                <div className="mb-3 lg:mb-4">
                  <SVGIcon 
                    name={blackout ? "warning" : "grid"} 
                    size={48} 
                    className={`${theme.grid} ${blackout ? 'animate-pulse' : ''} lg:hidden`} 
                  />
                  <SVGIcon 
                    name={blackout ? "warning" : "grid"} 
                    size={64} 
                    className={`${theme.grid} ${blackout ? 'animate-pulse' : ''} hidden lg:block`} 
                  />
                </div>
                <div className={`text-lg lg:text-xl font-bold ${theme.text}`}>Réseau</div>
                <div className={`text-xl lg:text-2xl font-bold ${theme.grid} mb-2`}>
                  {blackout ? 'Blackout' : 'Stable'}
                </div>
                <div className={`text-xs lg:text-sm ${theme.textSecondary}`}>
                  {blackout ? 'Panne réseau' : 'Réseau connecté'}
                </div>
              </div>

              {/* Load (à droite) */}
              <div className={`text-center p-4 lg:p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-xs lg:max-w-sm`}>
                <div className="mb-3 lg:mb-4">
                  <SVGIcon 
                    name="load" 
                    size={48} 
                    className={`${theme.load} lg:hidden`} 
                  />
                  <SVGIcon 
                    name="load" 
                    size={64} 
                    className={`${theme.load} hidden lg:block`} 
                  />
                </div>
                <div className={`text-lg lg:text-xl font-bold ${theme.text}`}>Charge</div>
                <div className={`text-2xl lg:text-3xl font-bold ${theme.load} mb-2`}>{load.toFixed(1)} kW</div>
                <div className={`text-xs lg:text-sm ${theme.textSecondary}`}>Consommation</div>
              </div>
            </div>

            {/* Genset (en bas) */}
            <div className={`text-center p-4 lg:p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-xs lg:max-w-sm`}>
              <div className="mb-3 lg:mb-4">
                <SVGIcon 
                  name="generator" 
                  size={48} 
                  className={`${theme.genset} ${genset > 0 ? 'animate-pulse' : ''} lg:hidden`} 
                />
                <SVGIcon 
                  name="generator" 
                  size={64} 
                  className={`${theme.genset} ${genset > 0 ? 'animate-pulse' : ''} hidden lg:block`} 
                />
              </div>
              <div className={`text-lg lg:text-xl font-bold ${theme.text}`}>Groupe Électrogène</div>
              <div className={`text-2xl lg:text-3xl font-bold ${theme.genset} mb-2`}>{genset.toFixed(1)} kW</div>
              <div className={`text-xs lg:text-sm ${theme.textSecondary}`}>Production de secours</div>
            </div>
          </div>

          {/* Lignes de flux animées - Desktop */}
          <div className="hidden xl:block">
            {/* Flux PV vers Réseau (vertical, du haut vers le centre) */}
            {shouldShowFlow(pv) && (
              <AnimatedFlowLine
                from={{ x: 50, y: 200 }}   // Centre bas de la carte PV
                to={{ x: 50, y: 350 }}     // Centre haut de la carte Réseau
                color={theme.flow.pv}
                intensity={Math.abs(pv) / 10}
                direction="forward"
                label={`${pv.toFixed(1)} kW`}
              />
            )}

            {/* Flux BESS vers Réseau (horizontal, de gauche vers le centre) */}
            {shouldShowFlow(bess) && (
              <AnimatedFlowLine
                from={{ x: 200, y: 50 }}    // Centre droite de la carte BESS
                to={{ x: 300, y: 50 }}      // Centre gauche de la carte Réseau
                color={theme.flow.bess}
                intensity={Math.abs(bess) / 10}
                direction={bess > 0 ? "forward" : "backward"}
                label={`${Math.abs(bess).toFixed(1)} kW`}
              />
            )}

            {/* Flux Réseau vers Load (horizontal, du centre vers la droite) */}
            {shouldShowFlow(load) && (
              <AnimatedFlowLine
                from={{ x: 400, y: 50 }}    // Centre droite de la carte Réseau
                to={{ x: 500, y: 50 }}      // Centre gauche de la carte Load
                color={theme.flow.load}
                intensity={Math.abs(load) / 10}
                direction="backward"
                label={`${load.toFixed(1)} kW`}
              />
            )}

            {/* Flux Genset vers Réseau (vertical, du bas vers le centre) */}
            {shouldShowFlow(genset) && (
              <AnimatedFlowLine
                from={{ x: 50, y: 500 }}    // Centre haut de la carte Genset
                to={{ x: 50, y: 450 }}      // Centre bas de la carte Réseau
                color={theme.flow.genset}
                intensity={Math.abs(genset) / 10}
                direction="forward"
                label={`${genset.toFixed(1)} kW`}
              />
            )}
          </div>

          {/* Lignes de flux animées - Large screens */}
          <div className="hidden lg:block xl:hidden">
            {/* Flux PV vers Réseau (vertical, du haut vers le centre) */}
            {shouldShowFlow(pv) && (
              <AnimatedFlowLine
                from={{ x: 40, y: 180 }}    // Centre bas de la carte PV
                to={{ x: 40, y: 320 }}      // Centre haut de la carte Réseau
                color={theme.flow.pv}
                intensity={Math.abs(pv) / 10}
                direction="forward"
                label={`${pv.toFixed(1)} kW`}
              />
            )}

            {/* Flux BESS vers Réseau (horizontal, de gauche vers le centre) */}
            {shouldShowFlow(bess) && (
              <AnimatedFlowLine
                from={{ x: 180, y: 40 }}     // Centre droite de la carte BESS
                to={{ x: 260, y: 40 }}       // Centre gauche de la carte Réseau
                color={theme.flow.bess}
                intensity={Math.abs(bess) / 10}
                direction={bess > 0 ? "forward" : "backward"}
                label={`${Math.abs(bess).toFixed(1)} kW`}
              />
            )}

            {/* Flux Réseau vers Load (horizontal, du centre vers la droite) */}
            {shouldShowFlow(load) && (
              <AnimatedFlowLine
                from={{ x: 340, y: 40 }}     // Centre droite de la carte Réseau
                to={{ x: 420, y: 40 }}       // Centre gauche de la carte Load
                color={theme.flow.load}
                intensity={Math.abs(load) / 10}
                direction="backward"
                label={`${load.toFixed(1)} kW`}
              />
            )}

            {/* Flux Genset vers Réseau (vertical, du bas vers le centre) */}
            {shouldShowFlow(genset) && (
              <AnimatedFlowLine
                from={{ x: 40, y: 460 }}     // Centre haut de la carte Genset
                to={{ x: 40, y: 400 }}       // Centre bas de la carte Réseau
                color={theme.flow.genset}
                intensity={Math.abs(genset) / 10}
                direction="forward"
                label={`${genset.toFixed(1)} kW`}
              />
            )}
          </div>

          {/* Indicateurs de flux pour mobile */}
          <div className="lg:hidden flex flex-col items-center space-y-4 mt-4">
            {shouldShowFlow(pv) && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme.card} border ${theme.border}`}>
                <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: theme.flow.pv }}></div>
                <span className={`text-sm font-medium ${theme.text}`}>PV → Réseau: {pv.toFixed(1)} kW</span>
          </div>
        )}

            {shouldShowFlow(bess) && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme.card} border ${theme.border}`}>
                <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: theme.flow.bess }}></div>
                <span className={`text-sm font-medium ${theme.text}`}>
                  BESS {bess > 0 ? '→' : '←'} Réseau: {Math.abs(bess).toFixed(1)} kW
                </span>
          </div>
        )}

            {shouldShowFlow(load) && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme.card} border ${theme.border}`}>
                <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: theme.flow.load }}></div>
                <span className={`text-sm font-medium ${theme.text}`}>Charge ← Réseau: {load.toFixed(1)} kW</span>
          </div>
        )}

            {shouldShowFlow(genset) && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme.card} border ${theme.border}`}>
                <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: theme.flow.genset }}></div>
                <span className={`text-sm font-medium ${theme.text}`}>Genset → Réseau: {genset.toFixed(1)} kW</span>
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PowerFlowDiagram;
