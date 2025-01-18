export const constants = {
  JWT_EXPIRES_IN: "7d",
  SALT_ROUNDS: 10,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  SUPPORTED_CURRENCIES: ["USD", "EUR", "GBP"],
  ACCOUNT_TYPES: ["bank", "mobile-money", "cash", "credit-card"],
  TRANSACTION_TYPES: ["income", "expense"],
  BUDGET_PERIODS: ["daily", "weekly", "monthly", "yearly"],
} as const;
