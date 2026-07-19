import type { DomainEventPayloads } from './domain-events';

type EmitDomainEvent = <E extends keyof DomainEventPayloads>(
  event: E,
  payload: DomainEventPayloads[E],
) => void;

let emit: EmitDomainEvent = () => {};

export const bindDomainEventEmitter = (handler: EmitDomainEvent): void => {
  emit = handler;
};

export const emitDomainEvent: EmitDomainEvent = (event, payload) => {
  emit(event, payload);
};
