const PREFIX = "[progress-tube]";

export const isExtensionContextInvalidated = (error: unknown): boolean =>
  error instanceof Error && error.message.includes("Extension context invalidated");

export const logError = (message: string, error: unknown): void => {
  if (isExtensionContextInvalidated(error)) return;
  console.error(`${PREFIX} ${message}`, error);
};
