export type TransactionHandler = (() => Promise<void>) | null;

interface TransactionProps {
  execute: TransactionHandler;
  commit?: TransactionHandler;
  rollback?: TransactionHandler;
}

export default class Transaction {
  constructor(private readonly handlers: TransactionProps) {
    if (!handlers.execute) {
      throw new Error('Execute handler is required');
    }
  }

  async run() {
    try {
      await this.execute();
    } catch (error) {
      await this.rollback();
      throw error;
    }

    await this.commit();
  }

  async execute() {
    if (this.handlers.execute) {
      await this.handlers.execute();
    }
  }

  async commit() {
    if (this.handlers.commit) {
      await this.handlers.commit();
    }
  }

  async rollback() {
    if (this.handlers.rollback) {
      await this.handlers.rollback();
    }
  }
}
