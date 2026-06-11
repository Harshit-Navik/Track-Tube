const PREFIX = "[progress-tube]";

export const logError = (message: string, error: unknown): void => {
  console.error(`${PREFIX} ${message}`, error);
};
