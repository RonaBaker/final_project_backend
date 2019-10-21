import mongoose from 'mongoose';

export class MongoConnection {
  private client: mongoose.Mongoose | undefined;
  private initialized = false;

  constructor(
    public readonly url: string,
  ) { }

  public async connect(): Promise<void> {
    this.client = await mongoose.connect(
      this.url,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    this.initialized = true;
  }

  public async close(): Promise<void> {
    if (!this.initialized) return;
    await this.client!.disconnect();
    this.initialized = false;
  }
}
