// event-bus.ts — the shared package
import amqplib, { type Channel, type ChannelModel } from 'amqplib';

export interface EventBusOptions {
  serviceName: string; // used for log prefixing, e.g. "bikes", "scooters"
  url: string; // full amqp:// connection string
  maxRetryDelayMs?: number; // defaults to 30_000
  initialRetryDelayMs?: number; // defaults to 1_000
}

export abstract class EventBus {
  private channelPromise: Promise<Channel> | undefined;
  private connection: ChannelModel | undefined;

  private readonly serviceName: string;
  private readonly url: string;
  private readonly maxRetryDelayMs: number;
  private readonly initialRetryDelayMs: number;

  constructor(options: EventBusOptions) {
    this.serviceName = options.serviceName;
    this.url = options.url;
    this.maxRetryDelayMs = options.maxRetryDelayMs ?? 30_000;
    this.initialRetryDelayMs = options.initialRetryDelayMs ?? 1_000;
  }

  /**
   * Subclasses implement this to declare their own exchanges, queues,
   * bindings, and (if it's a consumer) call channel.consume(...) here.
   * Called exactly once, right after a channel is successfully created
   * (and again after every reconnect).
   */
  // protected abstract setup(channel: Channel): Promise<void>;

  /** Override to customize error logging/reporting (e.g. send to Sentry). */
  protected onError(context: string, err: unknown): void {
    console.error(`[${this.serviceName}-rabbitmq] ${context}`, err);
  }

  getChannel(): Promise<Channel> {
    if (!this.channelPromise) {
      this.channelPromise = this.connectWithRetry();
    }
    return this.channelPromise;
  }

  private async connectWithRetry(attempt = 1): Promise<Channel> {
    try {
      const conn = await this.establishConnection();
      const channel = await this.establishChannel(conn);
      return channel;
    } catch (err) {
      const delay = Math.min(
        this.maxRetryDelayMs,
        this.initialRetryDelayMs * 2 ** attempt,
      );
      this.onError(`connect attempt ${attempt} failed, retrying in ${delay}ms`, err);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.connectWithRetry(attempt + 1);
    }
  }

  private async establishConnection(): Promise<ChannelModel> {
    if (this.connection) return this.connection;

    const conn = await amqplib.connect(this.url);
    this.connection = conn;

    conn.on('error', (err) => this.onError('Connection error', err));
    conn.on('close', () => {
      this.onError('Connection closed', 'resetting for reconnect');
      this.connection = undefined;
      this.channelPromise = undefined;
    });

    return conn;
  }

  private async establishChannel(conn: ChannelModel): Promise<Channel> {
    const channel = await conn.createChannel();
    channel.on('error', (err) => this.onError('Channel error', err));
    return channel;
  }

  async close(): Promise<void> {
    if (!this.connection) return;
    await this.connection.close();
    this.connection = undefined;
    this.channelPromise = undefined;
  }
}
