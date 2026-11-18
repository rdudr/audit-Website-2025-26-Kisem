import type { Status } from '../data';

// vr / pa: the follow-up checks (implementation verified, post assessment): any, done or not yet.
export type Check = 'All' | 'done' | 'pending';
export interface Filters { q: string; sector: string; fy: string; status: Status | 'All'; vr: Check; pa: Check; sort: 'code' | 'save' | 'impl' | 'co2' }
export const NO_FILTERS: Filters = { q: '', sector: 'All sectors', fy: 'All', status: 'All', vr: 'All', pa: 'All', sort: 'code' };
/** Whether an audit passes a follow-up filter. */
export const checkOk = (want: Check, v: 0 | 1 | null | undefined) => want === 'All' || (want === 'done' ? v === 1 : v !== 1);
