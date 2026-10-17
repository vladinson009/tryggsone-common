export type Log = {
  id: string;
  eventType: string;
  eventId: string;
  data: unknown;
  correlationId: string | null;
  occurredAt: Date;
  createdAt: Date;
};
