export enum ViewState {
  OVERVIEW = 'OVERVIEW',
  NETWORK = 'NETWORK',
  WORKFLOW = 'WORKFLOW',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS'
}

export interface NavNode {
  id: ViewState;
  label: string;
  icon: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}