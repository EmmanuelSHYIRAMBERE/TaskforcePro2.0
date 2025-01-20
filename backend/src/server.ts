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

var corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://taskforcepro2-0-web-wallet-frontend.onrender.com",
  ],
  optionsSuccessStatus: 200, // For legacy browser support
};

const swaggerLetterHead = yaml.load(
  fs.readFileSync(path.join(__dirname, "config", "swagger.yaml"), "utf-8")
) as { info: any };

function configureApp(): express.Application {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsOptions));

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
          url: "https://taskforcepro2-0.onrender.com",
          description: "Production",
        },
        {
          url: "http://localhost:8000",
          description: "Localhost",
        },
      ],
    },
    apis: ["./src/docs/*.js", "./src/docs/*.yaml", "./src/routes/*.js"],
  };
  const specs = swaggerJSDoc(options);

  console.log("specs", specs);

  // serve and swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
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
