import { type Channel } from 'amqplib';

export interface TopicListenerOptions {
  exchange: string;
  exchangeType?: 'topic' | 'direct' | 'fanout';
  queuePrefix: string; // e.g. 'q.bikes' -> queues become 'q.bikes.created', 'q.bikes.updated', ...
  routingKeys: string[]; // e.g. ['bikes.created', 'bikes.updated', 'bikes.deleted']
  onMessage: (routingKey: string, payload: unknown) => void | Promise<void>;
  onError?: (context: string, err: unknown) => void;
}

export class TopicListener {
  private readonly exchange: string;
  private readonly exchangeType: 'topic' | 'direct' | 'fanout';
  private readonly queuePrefix: string;
  private readonly routingKeys: string[];
  private readonly onMessage: (
    routingKey: string,
    payload: unknown,
  ) => void | Promise<void>;
  private readonly onError: (context: string, err: unknown) => void;

  constructor(options: TopicListenerOptions) {
    this.exchange = options.exchange;
    this.exchangeType = options.exchangeType ?? 'topic';
    this.queuePrefix = options.queuePrefix;
    this.routingKeys = options.routingKeys;
    this.onMessage = options.onMessage;
    this.onError =
      options.onError ??
      ((context, err) => console.error(`[${this.exchange}] ${context}`, err));
  }

  async register(channel: Channel): Promise<void> {
    await channel.assertExchange(this.exchange, this.exchangeType, {
      durable: true,
    });

    for (const routingKey of this.routingKeys) {
      await this.registerOne(channel, routingKey);
    }
  }

  private async registerOne(channel: Channel, routingKey: string): Promise<void> {
    const eventSuffix = routingKey.split('.').pop(); // 'bikes.created' -> 'created'
    const queueName = `${this.queuePrefix}.${eventSuffix}`;

    const q = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(q.queue, this.exchange, routingKey);

    await channel.consume(q.queue, async (msg) => {
      if (!msg) {
        this.onError(`Consumer cancelled for ${queueName}`, null);
        return;
      }

      try {
        const payload = JSON.parse(msg.content.toString());
        await this.onMessage(routingKey, payload);
        channel.ack(msg);
      } catch (err) {
        this.onError(`Failed to process ${routingKey}`, err);
        channel.nack(msg, false, false);
      }
    });
  }
}
