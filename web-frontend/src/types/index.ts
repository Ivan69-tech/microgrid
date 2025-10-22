export interface SystemStatus {
  P_bess: number;
  SOC: number;
  P_genset: number;
  P_pv: number;
  load: number;
  count: number;
  blackout: boolean;
  P_max_bess: number;
  Cap_bess: number;
  P_max_genset: number;
  P_max_pv: number;
  controlPv: boolean;
  simulatePV: boolean;
  hour?: number;
}

export interface PowerData {
  time: number;
  bess: number;
  genset: number;
  pv: number;
  load: number;
  soc: number;
}

export interface PVControlData {
  P_pv: number;
  P_load: number;
}

export interface ConfigurationData {
  p_max_bess: number;
  cap_bess: number;
  p_max_genset: number;
  p_max_pv: number;
}

export interface ControlData {
  controlPv?: boolean;
  simulatePv?: boolean;
  manual_control?: boolean;
}
