import { ChatInputCommandInteraction } from "discord.js";

enum ErrorType {
  COMMAND = "COMMAND_ERROR",
  FETCH = "FETCH_ERROR",
  PARSE = "PARSE_ERROR",
  DATABASE = "DATABASE_ERROR",
  INTERNAL = "INTERNAL_ERROR",
}

interface ErrorContext {
  interaction?: ChatInputCommandInteraction;
  command?: string;
  userId?: string;
  username?: string;
  metadata?: Record<string, any>;
}

class AppError extends Error {
  public readonly type: ErrorType;
  public readonly context: ErrorContext;

  constructor(type: ErrorType, message: string, context: ErrorContext) {
    super(message);
    this.type = type;
    this.context = context;
  }

  log() {
    const { type, message, context } = this;
    console.error(this.message);
  }
}

export default AppError;
