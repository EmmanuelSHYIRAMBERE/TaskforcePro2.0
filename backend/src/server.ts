import express from "express";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import cookieParser from "cookie-parser";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";

import connectDB from "./config/db.config";
import mainRouter from "./routes";
import logger from "./utils/logger.utils";

declare global {
  interface NodeJS {
    globalThis: {
      __basedir: string;
    };
  }
}

(global as any).__basedir = __dirname;

const swaggerLetterHead = yaml.load(
  fs.readFileSync(path.join(__dirname, "config", "swagger.yaml"), "utf-8")
) as { info: any };

// expose static files

function configureApp(): express.Application {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: ["*"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    }`);
    next();
  });

  const options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: swaggerLetterHead.info,
      servers: [
        {
          url: "http://localhost:8000",
          description: "Localhost",
        },
      ],
    },
    apis: [
      "./config/*.js",
      "./config/*.yaml",
      "./docs/*.js",
      "./docs/*.yaml",
      "./routes/*.js",
    ],
  };
  const swaggerDocument = swaggerJSDoc(options);

  // serve and swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api/v1", mainRouter);
  // Welcome route
  app.get("/", (req, res) => {
    res.status(200).send("Welcome to Personal Wallet Management System");
  });

  app.all("*", (req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
      message: "Route not found",
    });
  });
  return app;
}

const app = configureApp();
const PORT = process.env.PORT || 8000;
const server = createServer(app);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to connect to database", { error: error.message });
  });
