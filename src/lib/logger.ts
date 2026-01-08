import pino, { DestinationStream } from "pino";
import pinoHttp from "pino-http";

const redact = {
  paths: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "password",
    "*.password",
    "accessToken",
    "refreshToken",
  ],
  censor: "[Redacted]",
};

export function createLogger(destination?: DestinationStream) {
  return pino({ redact }, destination);
}

export function createHttpLogger(destination?: DestinationStream) {
  return pinoHttp({
    logger: createLogger(destination),
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          headers: req.headers,
        };
      },
    },
  });
}

export const logger = createLogger();
