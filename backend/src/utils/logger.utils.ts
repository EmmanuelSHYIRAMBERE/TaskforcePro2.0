import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

if (!process.env.BetterStackToken) {
  throw new Error("Wallet Web environment variable is not set");
}
const logtail = new Logtail(process.env.BetterStackToken);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "wallet-web-backend" },
  transports: [new winston.transports.Console(), new LogtailTransport(logtail)],
});

export default logger;
