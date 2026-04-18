import { ZodError, type ZodType } from "zod";

import { DomainError } from "./domain-error";

export function parseInput<TOutput>(schema: ZodType<TOutput>, payload: unknown): TOutput {
  try {
    return schema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new DomainError("Validation failed.", 400, "validation_error", {
        issues: error.issues
      });
    }

    throw error;
  }
}

