import { type Channel } from 'amqplib';

export interface TopicPublisherOptions {
  exchange: string;
  exchangeType?: 'topic' | 'direct' | 'fanout';
  onError?: (context: string, err: unknown) => void;
}

export class TopicPublisher {
  private readonly exchange: string;
  private readonly exchangeType: 'topic' | 'direct' | 'fanout';
  private readonly onError: (context: string, err: unknown) => void;
  private exchangeAsserted = false;

  constructor(options: TopicPublisherOptions) {
    this.exchange = options.exchange;
    this.exchangeType = options.exchangeType ?? 'topic';
    this.onError =
      options.onError ??
      ((context, err) => console.error(`[${this.exchange}] ${context}`, err));
  }

  /**
   * Declares the exchange once per channel. Safe to call repeatedly —
   * only actually asserts once per channel instance (cheap no-op after that).
   */
  private async ensureExchange(channel: Channel): Promise<void> {
    if (this.exchangeAsserted) return;
    await channel.assertExchange(this.exchange, this.exchangeType, {
      durable: true,
    });
    this.exchangeAsserted = true;
  }

  async publish(
    channel: Channel,
    routingKey: string,
    payload: unknown,
  ): Promise<boolean> {
    try {
      await this.ensureExchange(channel);

      const body = Buffer.from(JSON.stringify(payload));

      const ok = channel.publish(this.exchange, routingKey, body, {
        persistent: true,
      });

      if (!ok) {
        // channel.publish returns false when the internal write buffer is full
        // (backpressure) — message is still queued by amqplib, but worth logging
        this.onError(`Publish buffer full for ${routingKey}`, null);
      }

      return ok;
    } catch (err) {
      this.onError(`Failed to publish ${routingKey}`, err);
      throw err;
    }
  }
}
