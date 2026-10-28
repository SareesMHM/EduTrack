const fmt = (level: string, msg: string, meta?: unknown) =>
  JSON.stringify({ level, time: new Date().toISOString(), msg, ...(meta ? { meta } : {}) });

export const logger = {
  info: (m: string, meta?: unknown) => console.log(fmt('info', m, meta)),
  warn: (m: string, meta?: unknown) => console.warn(fmt('warn', m, meta)),
  error: (m: string, meta?: unknown) => console.error(fmt('error', m, meta)),
};
