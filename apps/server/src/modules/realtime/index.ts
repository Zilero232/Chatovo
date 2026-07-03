import { initRealtimeBroadcast } from './connection-store';
import { realtimeWsRoute } from './handlers/ws';

initRealtimeBroadcast();

export { realtimeWsRoute };
