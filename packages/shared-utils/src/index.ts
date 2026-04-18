import crypto from "node:crypto";

export interface ApiEnvelope<TData> {
  success: boolean;
  data: TData;
  meta?: Record<string, unknown>;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export function ok<TData>(data: TData, meta?: Record<string, unknown>): ApiEnvelope<TData> {
  return { success: true, data, meta };
}

export function failure(
  code: string,
  message: string,
  details?: Record<string, unknown>
): ApiErrorEnvelope {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function isoNow(date = new Date()): string {
  return date.toISOString();
}

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
