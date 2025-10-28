import React from 'react';

interface PowerFlowDiagramProps {
  pv: number;
  load: number;
  bess: number;
  genset: number;
  soc: number;
  blackout: boolean;
}

const PowerFlowDiagram: React.FC<PowerFlowDiagramProps> = ({
  pv,
  load,
  bess,
  genset,
  soc,
  blackout
}) => {
  // Déterminer les flux selon les valeurs
  const pvToLoad = Math.min(pv, load);
  const pvToBess = Math.max(0, pv - load);
  const bessToLoad = Math.max(0, load - pv);
  const gensetToLoad = Math.max(0, load - pv - Math.abs(bess));
  
  // Calculer les flux avec le réseau
  const networkFlow = pv + genset - load - Math.abs(bess);
  
  // Couleurs selon l'état
  const getFlowColor = (power: number) => {
    if (power > 0) return 'text-green-500';
    if (power < 0) return 'text-blue-500';
    return 'text-gray-400';
  };

  const getBessColor = () => {
    if (bess > 0) return 'text-green-500'; // Charge
    if (bess < 0) return 'text-red-500'; // Décharge
    return 'text-gray-400';
  };

  const getBessIcon = () => {
    if (bess > 0) return '🔋'; // Charge
    if (bess < 0) return '⚡'; // Décharge
    return '🔋'; // Neutre
  };

  // Fonction pour déterminer la couleur des flèches réseau
  const getNetworkArrowColor = (power: number) => {
    if (power > 0) return 'text-green-500'; // Injection (vert)
    if (power < 0) return 'text-red-500'; // Soutirage (rouge)
    return 'text-gray-400'; // Neutre
  };

  // Fonction pour déterminer la direction des flèches
  const getArrowDirection = (power: number) => {
    if (power > 0) return '→'; // Vers le réseau (injection)
    if (power < 0) return '←'; // Depuis le réseau (soutirage)
    return '↔'; // Bidirectionnel
  };

  // Fonction pour déterminer si une flèche doit être affichée
  const shouldShowArrow = (power: number) => {
    return Math.abs(power) > 0.1; // Seuil minimal pour afficher la flèche
  };

  return (
    <div className="card p-8 mt-8">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
        🔄 Flux de Puissance du Microgrid
      </h3>
      
      <div className="relative">
        {/* Layout avec réseau au centre */}
        <div className="flex flex-col items-center space-y-12">
          
          {/* PV (en haut) */}
          <div className="text-center">
            <div className="text-6xl mb-2">🔆</div>
            <div className="text-lg font-semibold text-gray-800">PV</div>
            <div className="text-2xl font-bold text-yellow-500">{pv.toFixed(1)} kW</div>
          </div>

          {/* Ligne horizontale avec BESS, Réseau, Load */}
          <div className="flex items-center justify-center space-x-32">
            
            {/* BESS (à gauche) */}
            <div className="text-center">
              <div className="text-6xl mb-2">{getBessIcon()}</div>
              <div className="text-lg font-semibold text-gray-800">BESS</div>
              <div className={`text-2xl font-bold ${getBessColor()}`}>
                {Math.abs(bess).toFixed(1)} kW
              </div>
              <div className="text-sm text-gray-600">SOC: {soc.toFixed(1)}%</div>
            </div>

            {/* Réseau (au centre) */}
            <div className="text-center">
              <div className="text-6xl mb-2">
                {blackout ? '⚠️' : '⚡'}
              </div>
              <div className="text-lg font-semibold text-gray-800">Réseau</div>
              <div className={`text-xl font-bold ${blackout ? 'text-red-500' : 'text-green-500'}`}>
                {blackout ? 'Blackout' : 'Stable'}
              </div>
            </div>

            {/* Load (à droite) */}
            <div className="text-center">
              <div className="text-6xl mb-2">🏭</div>
              <div className="text-lg font-semibold text-gray-800">Load</div>
              <div className="text-2xl font-bold text-red-500">{load.toFixed(1)} kW</div>
            </div>
          </div>

          {/* Genset (en bas) */}
          <div className="text-center">
            <div className="text-6xl mb-2">⚡</div>
            <div className="text-lg font-semibold text-gray-800">Genset</div>
            <div className="text-2xl font-bold text-green-500">{genset.toFixed(1)} kW</div>
          </div>
        </div>

        {/* Flèches positionnées entre les composants et le réseau */}
        
        {/* Flèche PV vers Réseau */}
        {shouldShowArrow(pv) && (
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2">
            <div className={`text-4xl font-bold ${getNetworkArrowColor(pv)} drop-shadow-lg animate-pulse`}>
              {pv > 0 ? '↓' : '↑'}
            </div>
          </div>
        )}

        {/* Flèche BESS vers Réseau */}
        {shouldShowArrow(bess) && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-32 -translate-y-1/2">
            <div className={`text-4xl font-bold ${getNetworkArrowColor(bess)} drop-shadow-lg animate-pulse`}>
              {bess > 0 ? '→' : '←'}
            </div>
          </div>
        )}

        {/* Flèche Load vers Réseau */}
        {shouldShowArrow(load) && (
          <div className="absolute top-1/2 left-1/2 transform translate-x-32 -translate-y-1/2">
            <div className={`text-4xl font-bold ${getNetworkArrowColor(-load)} drop-shadow-lg animate-pulse`}>
              ←
            </div>
          </div>
        )}

        {/* Flèche Genset vers Réseau */}
        {shouldShowArrow(genset) && (
          <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2">
            <div className={`text-4xl font-bold ${getNetworkArrowColor(genset)} drop-shadow-lg animate-pulse`}>
              {genset > 0 ? '↑' : '↓'}
            </div>
          </div>
        )}

        {/* Suppression des étiquettes de puissance */}

      </div>
    </div>
  );
};

export default PowerFlowDiagram;
