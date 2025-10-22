import React, { useState, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { apiService } from '../services/api';

interface ControlPanelProps {
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  systemStatus?: {
    controlPv: boolean;
    simulatePV: boolean;
    manual_control?: boolean;
  };
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onError, onSuccess, systemStatus }) => {
  const [pvControl, setPvControl] = useState(false);
  const [pvSimulation, setPvSimulation] = useState(false);
  const [manualControl, setManualControl] = useState(true);
  
  // États pour tracker les changements (comme Streamlit)
  const [pvControlLast, setPvControlLast] = useState(false);
  const [pvSimulationLast, setPvSimulationLast] = useState(false);
  const [manualControlLast, setManualControlLast] = useState(true);
  const [pvValue, setPvValue] = useState(200);
  const [loadValue, setLoadValue] = useState(1000);
  const [bessPMax, setBessPMax] = useState(1200);
  const [bessCap, setBessCap] = useState(20);
  const [gensetPMax, setGensetPMax] = useState(1000);
  const [pvPMax, setPvPMax] = useState(1500);

  // Les boutons radio sont uniquement contrôlés par les actions utilisateur
  // Pas de synchronisation avec le serveur

  // Logique des boutons radio - un seul peut être actif à la fois
  const handlePVControlChange = async () => {
    try {
      // Mettre à jour les états locaux d'abord (désactiver les autres)
      setPvControl(true);
      setPvSimulation(false);
      setManualControl(false);
      setPvControlLast(true);
      setPvSimulationLast(false);
      setManualControlLast(false);
      
      // Envoyer seulement l'activation du mode sélectionné
      await apiService.controlPV({ controlPv: true });
      
      onSuccess('PV Control activé');
    } catch (error) {
      onError(`Erreur HTTP (PV control): ${error}`);
    }
  };

  const handlePVSimulationChange = async () => {
    try {
      // Mettre à jour les états locaux d'abord (désactiver les autres)
      setPvControl(false);
      setPvSimulation(true);
      setManualControl(false);
      setPvControlLast(false);
      setPvSimulationLast(true);
      setManualControlLast(false);
      
      // Envoyer seulement l'activation du mode sélectionné
      await apiService.simulatePV({ simulatePv: true });
      
      onSuccess('PV Simulation activé');
    } catch (error) {
      onError(`Erreur HTTP (PV simulation): ${error}`);
    }
  };

  const handleManualControlChange = async () => {
    try {
      // Mettre à jour les états locaux d'abord (désactiver les autres)
      setPvControl(false);
      setPvSimulation(false);
      setManualControl(true);
      setPvControlLast(false);
      setPvSimulationLast(false);
      setManualControlLast(true);
      
      // Envoyer seulement l'activation du mode sélectionné
      await apiService.manualControl({ manual_control: true });
      
      onSuccess('Manual Control activé');
    } catch (error) {
      onError(`Erreur HTTP (Manual control): ${error}`);
    }
  };

  const handlePVLoadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.setPVLoad({ P_pv: pvValue, P_load: loadValue });
      onSuccess('Configuration PV et charge mise à jour');
    } catch (error) {
      onError(`Erreur lors de la configuration: ${error}`);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.setConfiguration({
        p_max_bess: bessPMax,
        cap_bess: bessCap,
        p_max_genset: gensetPMax,
        p_max_pv: pvPMax
      });
      onSuccess('Configuration système mise à jour');
    } catch (error) {
      onError(`Erreur lors de la configuration: ${error}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contrôles PV */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contrôles PV</h3>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Mode de contrôle PV :</h4>
          
          <div className="space-y-3">
            {/* Mode Manuel */}
            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              manualControl 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="pvMode"
                value="manual"
                checked={manualControl}
                onChange={handleManualControlChange}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                manualControl 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {manualControl && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Contrôle manuel</div>
                <div className="text-sm text-gray-600">Prend le contrôle du PV</div>
              </div>
            </label>

            {/* Mode Simulation ciel clair */}
            <div 
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                pvSimulation 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={handlePVSimulationChange}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                pvSimulation 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {pvSimulation && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Simulation ciel clair</div>
                <div className="text-sm text-gray-600">Production PV simulée en ciel clair</div>
              </div>
            </div>

            {/* Mode Maximisation PV */}
            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              pvControl 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="pvMode"
                value="control"
                checked={pvControl}
                onChange={handlePVControlChange}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                pvControl 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {pvControl && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Maximise la prod PV automatiquement</div>
                <div className="text-sm text-gray-600">Contrôle automatique du PV</div>
              </div>
            </label>
          </div>
        </div>

        <form onSubmit={handlePVLoadSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puissance PV (kW)
            </label>
            <input
              type="number"
              value={pvValue}
              onChange={(e) => setPvValue(Number(e.target.value))}
              min="0"
              step="50"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Charge (kW)
            </label>
            <input
              type="number"
              value={loadValue}
              onChange={(e) => setLoadValue(Number(e.target.value))}
              min="0"
              max="4000"
              step="50"
              className="input-field"
            />
          </div>
          
          <button type="submit" className="btn-primary w-full">
            Valider
          </button>
        </form>
      </div>

      {/* Configuration système */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuration Système</h3>
        
        <form onSubmit={handleConfigSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puissance max BESS (kW)
            </label>
            <input
              type="number"
              value={bessPMax}
              onChange={(e) => setBessPMax(Number(e.target.value))}
              min="100"
              step="50"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacité BESS (kWh)
            </label>
            <input
              type="number"
              value={bessCap}
              onChange={(e) => setBessCap(Number(e.target.value))}
              min="0"
              step="20"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puissance max Genset (kW)
            </label>
            <input
              type="number"
              value={gensetPMax}
              onChange={(e) => setGensetPMax(Number(e.target.value))}
              min="100"
              step="20"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puissance max PV (kW)
            </label>
            <input
              type="number"
              value={pvPMax}
              onChange={(e) => setPvPMax(Number(e.target.value))}
              min="0"
              step="50"
              className="input-field"
            />
          </div>
          
          <button type="submit" className="btn-primary w-full">
            Valider
          </button>
        </form>
      </div>
    </div>
  );
};

export default ControlPanel;
