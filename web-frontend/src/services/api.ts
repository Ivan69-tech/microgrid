import axios from 'axios';
import { SystemStatus, PVControlData, ConfigurationData, ControlData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const apiService = {
  // Récupérer le statut du système
  getStatus: async (): Promise<SystemStatus> => {
    const response = await api.get('/api/status');
    return response.data;
  },

  // Redémarrer l'EMS
  restartEMS: async (): Promise<{ status: string; message: string }> => {
    const response = await api.post('/api/restart');
    return response.data;
  },

  // Configurer PV et charge
  setPVLoad: async (data: PVControlData): Promise<any> => {
    const response = await api.post('/api/setpvp', data);
    return response.data;
  },

  // Configurer les paramètres du système
  setConfiguration: async (data: ConfigurationData): Promise<any> => {
    const response = await api.post('/api/setconf', data);
    return response.data;
  },

  // Contrôle PV automatique
  controlPV: async (data: ControlData): Promise<any> => {
    const response = await api.post('/api/controlpv', data);
    return response.data;
  },

  // Simulation PV ciel clair
  simulatePV: async (data: ControlData): Promise<any> => {
    const response = await api.post('/api/simulatepv', data);
    return response.data;
  },

  // Contrôle manuel
  manualControl: async (data: ControlData): Promise<any> => {
    const response = await api.post('/api/manual_control', data);
    return response.data;
  },
};
