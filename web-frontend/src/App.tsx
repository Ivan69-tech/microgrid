import React, { useState, useEffect, useCallback } from 'react';
import { SystemStatus, PowerData } from './types';
import { apiService } from './services/api';
import StatusCard from './components/StatusCard';
import SystemInfoCard from './components/SystemInfoCard';
import PowerChart from './components/PowerChart';
import SOCChart from './components/SOCChart';
import PowerFlowDiagram from './components/PowerFlowDiagram';
import ControlPanel from './components/ControlPanel';

const App: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [powerHistory, setPowerHistory] = useState<PowerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const status = await apiService.getStatus();
      setSystemStatus(status);
      setError(null);
      
      // Ajouter les nouvelles données à l'historique
      const newData: PowerData = {
        time: Date.now(),
        bess: status.P_bess,
        genset: status.P_genset,
        pv: status.P_pv,
        load: status.load,
        soc: status.SOC
      };
      
      setPowerHistory(prev => {
        const updated = [...prev, newData];
        // Garder seulement les 10 dernières valeurs
        return updated.slice(-10);
      });
    } catch (err) {
      setError(`Erreur de connexion: ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRestart = async () => {
    try {
      await apiService.restartEMS();
      setSuccess('EMS redémarré avec succès');
    } catch (err) {
      setError(`Erreur lors du redémarrage: ${err}`);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const handleSuccess = (successMessage: string) => {
    setSuccess(successMessage);
    setTimeout(() => setSuccess(null), 3000);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!systemStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4">Impossible de se connecter au système EMS</p>
          <button 
            onClick={fetchStatus}
            className="btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Simulation d'un EMS off grid
          </h1>
          <div className="max-w-4xl mx-auto space-y-2 text-gray-600">
            <p>Le BESS est en isochrone, il assume les variations de charge et tient le réseau. L'EMS adapte le setpoint du genset en P/Q mais n'a pas la main sur PV</p>
            <p>Le BESS se décharge si le PV ne peut pas assumer toute la charge, si la batterie est complètement déchargée, le genset doit prendre la charge</p>
            <p>Si le genset ne parvient pas à assurer toute la charge, c'est blackout. Attention donc au niveau de la load et à la puissance maximale de chacun des actifs !</p>
            <p>Augmente le PV si tu veux recharger la batterie (mais attention à la limite de puissance du BESS!)</p>
          </div>
        </div>

        {/* Messages d'erreur/succès */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Bouton restart */}
        <div className="text-center mb-8">
          <button 
            onClick={handleRestart}
            className="btn-primary"
          >
            Restart EMS
          </button>
        </div>

        {/* Informations système */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SystemInfoCard
            title="🔋 BESS"
            line1={`Pmax = <b>${systemStatus.P_max_bess} kW</b>`}
            line2={`Capacité = <b>${systemStatus.Cap_bess} kWh</b>`}
          />
          <SystemInfoCard
            title="⚡ Genset"
            line1={`Pmax = <b>${systemStatus.P_max_genset} kW</b>`}
          />
          <SystemInfoCard
            title="🌞 PV"
            line1={`Pmax = <b>${systemStatus.P_max_pv || 'Illimité'} kW</b>`}
          />
        </div>

        {/* Contrôles */}
        <div className="mb-8">
          <ControlPanel 
            onError={handleError} 
            onSuccess={handleSuccess}
            systemStatus={systemStatus}
          />
        </div>

        {/* Status de la charge */}
        <div className="text-center mb-8">
          <StatusCard
            title="Load"
            value={`${systemStatus.load} kW`}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Status des composants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatusCard
            title="BESS"
            value={`SOC = ${systemStatus.SOC} % <br> ${systemStatus.P_bess.toFixed(1)} kW`}
            subtitle="Battery infos"
            icon="🔋"
          />
          <StatusCard
            title="Genset"
            value={`${systemStatus.P_genset} kW <br> &nbsp;`}
            subtitle="Genset infos"
            icon="⚡"
          />
          <StatusCard
            title="PV"
            value={`${systemStatus.P_pv} kW <br> Heure: ${systemStatus.hour}`}
            subtitle="PV infos"
            icon="🌞"
          />
        </div>

        {/* Status réseau */}
        <div className="text-center mb-8">
          <div className={`p-6 text-center rounded-2xl shadow-lg ${
            systemStatus.blackout 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            <div className="text-2xl font-bold">
              {systemStatus.blackout ? '⚠️ Blackout' : '✅ Réseau stable'}
            </div>
          </div>
        </div>

        {/* Graphiques */}
        {powerHistory.length > 0 && (
          <div className="space-y-8">
            <PowerChart 
              data={powerHistory.map((d, index) => ({
                time: index,
                bess: d.bess,
                genset: d.genset,
                pv: d.pv,
                load: d.load
              }))}
              title="Courbes Puissance (kW)"
            />
            
            <SOCChart 
              data={powerHistory.map((d, index) => ({
                time: index,
                soc: d.soc
              }))}
              title="SOC BESS (%)"
            />
          </div>
        )}

        {/* Diagramme de flux de puissance */}
        {systemStatus && (
          <PowerFlowDiagram
            pv={systemStatus.P_pv}
            load={systemStatus.load}
            bess={systemStatus.P_bess}
            genset={systemStatus.P_genset}
            soc={systemStatus.SOC}
            blackout={systemStatus.blackout}
          />
        )}
      </div>
    </div>
  );
};

export default App;
