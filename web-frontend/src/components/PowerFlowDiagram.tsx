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

  return (
    <div className="card p-8 mt-8">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
        🔄 Flux de Puissance du Microgrid
      </h3>
      
      <div className="relative">
        {/* Layout avec réseau au centre */}
        <div className="flex flex-col items-center space-y-8">
          
          {/* PV (en haut) */}
          <div className="text-center">
            <div className="text-6xl mb-2">🔆</div>
            <div className="text-lg font-semibold text-gray-800">PV</div>
            <div className="text-2xl font-bold text-yellow-500">{pv.toFixed(1)} kW</div>
          </div>

          {/* Ligne horizontale avec BESS, Réseau, Load */}
          <div className="flex items-center justify-center space-x-24">
            
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

        {/* Suppression des étiquettes de puissance */}

        {/* Légende améliorée */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Légende des Flux</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center space-x-3 bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="w-5 h-5 bg-green-500 rounded-full shadow-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
              <div>
                <div className="font-semibold text-green-800">Injection</div>
                <div className="text-green-600 text-xs">Production vers le réseau</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="w-5 h-5 bg-red-500 rounded-full shadow-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">-</span>
              </div>
              <div>
                <div className="font-semibold text-red-800">Soutirage</div>
                <div className="text-red-600 text-xs">Consommation depuis le réseau</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="w-5 h-5 bg-gray-400 rounded-full shadow-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">0</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Équilibre</div>
                <div className="text-gray-600 text-xs">Aucun échange réseau</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerFlowDiagram;
