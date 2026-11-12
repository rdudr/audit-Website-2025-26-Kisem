import type { Status } from '../data';

export interface Filters { q: string; sector: string; fy: string; status: Status | 'All'; sort: 'code' | 'save' | 'impl' | 'co2' }
export const NO_FILTERS: Filters = { q: '', sector: 'All sectors', fy: 'All', status: 'All', sort: 'code' };
