type LogOpts = {
  message: any;
};

type ErrorOpts = {
  message: any;
  error: Error;
  full?: boolean;
};

export class StdLogger {
  namespace: string;
  constructor(namespace: string) {
    this.namespace = namespace;
  }
  log({ message }: LogOpts) {
    console.log(`[${this.namespace}] ${message}`);
  }

  info({ message }: LogOpts) {
    console.info(`[${this.namespace}] ${message}`);
  }

  error({ message, error, full = false }: ErrorOpts) {
    console.error(
      `[${this.namespace}] ${message} ${error.message}`,
      full ? error : undefined,
    );
  }

  warn({ message }: LogOpts) {
    console.warn(`[${this.namespace}] ${message}`);
  }
}
