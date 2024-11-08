import loggerConfig from './loggerConfig.json';

interface LogConfig {
  enabled: boolean;
  useHiddenContexts: boolean;
  ignoredContexts: string[];
  hiddenContexts: string[];
}

const config: LogConfig = {
  enabled: loggerConfig.enabled ?? true,
  useHiddenContexts: loggerConfig.useHiddenContexts ?? true,
  ignoredContexts: loggerConfig.ignoredContexts || [],
  hiddenContexts: loggerConfig.hiddenContexts || [],
};

type LogLevel =
  | 'LOG'
  | 'INFO'
  | 'START'
  | 'SUCCESS'
  | 'WARN'
  | 'ERROR'
  | 'MIDDLEWARE';

const logStyles: Record<LogLevel, { emoji: string; color: string }> = {
  LOG: { emoji: '📝', color: '\x1b[37m' }, // White (default)
  INFO: { emoji: '🔍', color: '\x1b[36m' }, // Cyan (process information)
  START: { emoji: '🚀', color: '\x1b[32m' }, // Green (start of expected operations)
  SUCCESS: { emoji: '✅', color: '\x1b[32m' }, // Green (completion of expected operations)
  WARN: { emoji: '🚧', color: '\x1b[33m' }, // Yellow
  ERROR: { emoji: '🚨', color: '\x1b[31m' }, // Red
  MIDDLEWARE: { emoji: '📡', color: '\x1b[35m' }, // Purple (middleware operations)
};

const stringifyArg = (arg: any): string => {
  if (typeof arg === 'object' && arg !== null) {
    return JSON.stringify(arg, null, 2);
  }
  return String(arg);
};

export const createLogger = (context: string) => {
  let lastLogTime: number | null = null;

  const getTimestamp = () => {
    const now = Date.now();
    const timePassed = lastLogTime ? now - lastLogTime : 0;
    const formattedTime =
      timePassed >= 1000
        ? `+${(timePassed / 1000).toFixed(2)}s`
        : `+${timePassed}ms`;

    lastLogTime = now;
    return formattedTime.padEnd(7);
  };

  const isContextIgnored = () => config.ignoredContexts.includes(context);
  const isContextHidden = () =>
    config.useHiddenContexts && config.hiddenContexts.includes(context);

  const logMessage = (level: LogLevel, ...args: any[]) => {
    if (config.enabled && !isContextIgnored()) {
      const timestamp = getTimestamp();
      const paddedContext = context.padEnd(15);
      const { emoji, color } = logStyles[level];

      const formattedArgs = args.map(stringifyArg);
      const message = `${color}${timestamp} | ${paddedContext} | ${emoji} | ${formattedArgs.join(
        ' '
      )}\x1b[0m`;

      if (isContextHidden()) {
        console.log('\x1b[90m%s\x1b[0m', message); // Grey color
      } else {
        console.log(message);
      }
    }
  };

  return {
    /**
     * General purpose logging (white).
     * Use this for temporary logs or when you haven't decided on a specific category yet.
     * @param args The message and any additional arguments to log
     */
    log: (...args: any[]) => logMessage('LOG', ...args),

    /**
     * Log the start of an expected operation (green).
     * Use this when beginning an operation that is expected to succeed.
     * Note: Write the message in continuous tense, ending with three dots (...).
     * @param args The message and any additional arguments to log
     * @example logger.start('Preventing auto-hide of splash screen...')
     */
    started: (...args: any[]) => logMessage('START', ...args),

    /**
     * Log process information (cyan).
     * Use this for logging paths, configurations, or other contextual information about the process.
     * @param args The message and any additional arguments to log
     */
    info: (...args: any[]) => logMessage('INFO', ...args),

    /**
     * Log the successful completion of an expected operation (green).
     * Use this when an operation completes as expected or to confirm that a process has completed successfully.
     * Note: Write the message in past tense, as a completed action, ending in "successfully.".
     * @param args The message and any additional arguments to log
     * @example logger.success('Fonts loaded successfully.')
     */
    success: (...args: any[]) => logMessage('SUCCESS', ...args),

    /**
     * Log warnings (yellow).
     * Use this for potential issues that don't prevent the app from functioning but might need attention.
     * @param args The message and any additional arguments to log
     */
    warn: (...args: any[]) => logMessage('WARN', ...args),

    /**
     * Log errors (red).
     * Use this for critical issues that prevent normal operation or require immediate attention.
     * @param args The message and any additional arguments to log
     */
    error: (...args: any[]) => logMessage('ERROR', ...args),

    /**
     * Log middleware operations (purple).
     * Use this for logging middleware-specific operations, such as request interception, data transformation, etc.
     * @param args The message and any additional arguments to log
     * @example logger.middleware('Intercepting API request...')
     */
    middleware: (...args: any[]) => logMessage('MIDDLEWARE', ...args),
  };
};
