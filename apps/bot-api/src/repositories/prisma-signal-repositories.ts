import type {
  MarketInsightSnapshot,
  ProviderName,
  SignalInputSnapshot,
  SignalReviewSnapshot,
  SignalSnapshot
} from "@tradara/shared-types";
import { Prisma, type PrismaClient } from "@prisma/client";

import type {
  MarketInsightRepository,
  SignalInputRepository,
  SignalRepository,
  SignalReviewRepository
} from "./types";

type JsonValue = Prisma.JsonValue;

type SignalInputRow = {
  id: string;
  sourceType: SignalInputSnapshot["sourceType"];
  sourceProvider: ProviderName | null;
  sourceEventId: string | null;
  symbol: string;
  timeframe: string | null;
  direction: SignalInputSnapshot["direction"];
  entryZoneLow: Prisma.Decimal | number | string | null;
  entryZoneHigh: Prisma.Decimal | number | string | null;
  stopLoss: Prisma.Decimal | number | string | null;
  takeProfit1: Prisma.Decimal | number | string | null;
  takeProfit2: Prisma.Decimal | number | string | null;
  takeProfit3: Prisma.Decimal | number | string | null;
  marketPrice: Prisma.Decimal | number | string | null;
  trendAlignment: number | null;
  structureQuality: number | null;
  volatilityQuality: number | null;
  liquidityQuality: number | null;
  riskRewardQuality: number | null;
  conflictPenalty: number | null;
  note: string | null;
  strategyName: string | null;
  detectedAt: Date | null;
  metadata: JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

type SignalRow = {
  id: string;
  signalInputId: string;
  status: SignalSnapshot["status"];
  sourceType: SignalSnapshot["sourceType"];
  confidenceScore: number | null;
  setupQualityScore: number | null;
  riskLabel: SignalSnapshot["riskLabel"];
  publishRecommendation: SignalSnapshot["publishRecommendation"];
  invalidationSummary: string | null;
  setupRationale: string | null;
  marketContext: string | null;
  warnings: JsonValue;
  confidenceBreakdown: JsonValue;
  telegramDraft: string | null;
  expertReviewNotes: string | null;
  editedTelegramDraft: string | null;
  publishedTelegramText: string | null;
  publishedTelegramChatId: string | null;
  publishedTelegramMessageId: string | null;
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  publishedBy: string | null;
  publishedAt: Date | null;
  canceledAt: Date | null;
  metadata: JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

type SignalReviewRow = {
  id: string;
  signalId: string;
  reviewerId: string;
  resultingStatus: SignalReviewSnapshot["resultingStatus"];
  notes: string | null;
  editedTelegramDraft: string | null;
  createdAt: Date;
};

type MarketInsightRow = {
  id: string;
  status: MarketInsightSnapshot["status"];
  symbol: string;
  timeframe: string | null;
  title: string;
  summary: string;
  body: string;
  btcBias: MarketInsightSnapshot["btcBias"];
  ethBias: MarketInsightSnapshot["ethBias"];
  altcoinBias: MarketInsightSnapshot["altcoinBias"];
  riskEnvironment: MarketInsightSnapshot["riskEnvironment"];
  executionPosture: MarketInsightSnapshot["executionPosture"];
  warnings: JsonValue;
  telegramDraft: string | null;
  approvedBy: string | null;
  approvedAt: Date | null;
  publishedBy: string | null;
  publishedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  canceledAt: Date | null;
  metadata: JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

function formatDate(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function parseDate(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null;
}

function parseJsonObject(value: JsonValue | null | undefined): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function parseStringArray(value: JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function parseConfidenceBreakdown(
  value: JsonValue | null | undefined
): SignalSnapshot["confidenceBreakdown"] {
  const object = parseJsonObject(value);
  const readNumber = (key: keyof SignalSnapshot["confidenceBreakdown"]): number => {
    const candidate = object[key];
    return typeof candidate === "number" && Number.isFinite(candidate) ? candidate : 0;
  };

  return {
    trendAlignment: readNumber("trendAlignment"),
    structureQuality: readNumber("structureQuality"),
    volatilityQuality: readNumber("volatilityQuality"),
    liquidityQuality: readNumber("liquidityQuality"),
    riskRewardQuality: readNumber("riskRewardQuality"),
    conflictPenalty: readNumber("conflictPenalty"),
    weightedPositiveScore: readNumber("weightedPositiveScore"),
    finalScore: readNumber("finalScore")
  };
}

function decimalToNumber(value: Prisma.Decimal | number | string | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value.toNumber();
}

function jsonb(value: unknown): Prisma.Sql {
  return Prisma.sql`CAST(${JSON.stringify(value)} AS jsonb)`;
}

function mapSignalInput(row: SignalInputRow): SignalInputSnapshot {
  return {
    id: row.id,
    sourceType: row.sourceType,
    sourceProvider: row.sourceProvider,
    sourceEventId: row.sourceEventId,
    symbol: row.symbol,
    timeframe: row.timeframe,
    direction: row.direction,
    entryZoneLow: decimalToNumber(row.entryZoneLow),
    entryZoneHigh: decimalToNumber(row.entryZoneHigh),
    stopLoss: decimalToNumber(row.stopLoss),
    takeProfit1: decimalToNumber(row.takeProfit1),
    takeProfit2: decimalToNumber(row.takeProfit2),
    takeProfit3: decimalToNumber(row.takeProfit3),
    marketPrice: decimalToNumber(row.marketPrice),
    trendAlignment: row.trendAlignment,
    structureQuality: row.structureQuality,
    volatilityQuality: row.volatilityQuality,
    liquidityQuality: row.liquidityQuality,
    riskRewardQuality: row.riskRewardQuality,
    conflictPenalty: row.conflictPenalty,
    note: row.note,
    strategyName: row.strategyName,
    detectedAt: formatDate(row.detectedAt),
    metadata: parseJsonObject(row.metadata),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

function mapSignal(row: SignalRow): SignalSnapshot {
  return {
    id: row.id,
    signalInputId: row.signalInputId,
    status: row.status,
    sourceType: row.sourceType,
    confidenceScore: row.confidenceScore,
    setupQualityScore: row.setupQualityScore,
    riskLabel: row.riskLabel,
    publishRecommendation: row.publishRecommendation,
    invalidationSummary: row.invalidationSummary,
    setupRationale: row.setupRationale,
    marketContext: row.marketContext,
    warnings: parseStringArray(row.warnings),
    confidenceBreakdown: parseConfidenceBreakdown(row.confidenceBreakdown),
    telegramDraft: row.telegramDraft,
    expertReviewNotes: row.expertReviewNotes,
    editedTelegramDraft: row.editedTelegramDraft,
    publishedTelegramText: row.publishedTelegramText,
    publishedTelegramChatId: row.publishedTelegramChatId,
    publishedTelegramMessageId: row.publishedTelegramMessageId,
    approvedBy: row.approvedBy,
    approvedAt: formatDate(row.approvedAt),
    rejectedBy: row.rejectedBy,
    rejectedAt: formatDate(row.rejectedAt),
    publishedBy: row.publishedBy,
    publishedAt: formatDate(row.publishedAt),
    canceledAt: formatDate(row.canceledAt),
    metadata: parseJsonObject(row.metadata),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

function mapSignalReview(row: SignalReviewRow): SignalReviewSnapshot {
  return {
    id: row.id,
    signalId: row.signalId,
    reviewerId: row.reviewerId,
    resultingStatus: row.resultingStatus,
    notes: row.notes,
    editedTelegramDraft: row.editedTelegramDraft,
    createdAt: row.createdAt.toISOString()
  };
}

function mapMarketInsight(row: MarketInsightRow): MarketInsightSnapshot {
  return {
    id: row.id,
    status: row.status,
    symbol: row.symbol,
    timeframe: row.timeframe,
    title: row.title,
    summary: row.summary,
    body: row.body,
    btcBias: row.btcBias,
    ethBias: row.ethBias,
    altcoinBias: row.altcoinBias,
    riskEnvironment: row.riskEnvironment,
    executionPosture: row.executionPosture,
    warnings: parseStringArray(row.warnings),
    telegramDraft: row.telegramDraft,
    approvedBy: row.approvedBy,
    approvedAt: formatDate(row.approvedAt),
    publishedBy: row.publishedBy,
    publishedAt: formatDate(row.publishedAt),
    rejectedBy: row.rejectedBy,
    rejectedAt: formatDate(row.rejectedAt),
    canceledAt: formatDate(row.canceledAt),
    metadata: parseJsonObject(row.metadata),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

export class PrismaSignalRepository implements SignalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<SignalSnapshot | null> {
    const rows = await this.prisma.$queryRaw<SignalRow[]>`
      SELECT * FROM "Signal"
      WHERE "id" = ${id}
      LIMIT 1
    `;

    return rows[0] ? mapSignal(rows[0]) : null;
  }

  async findBySignalInputId(signalInputId: string): Promise<SignalSnapshot | null> {
    const rows = await this.prisma.$queryRaw<SignalRow[]>`
      SELECT * FROM "Signal"
      WHERE "signalInputId" = ${signalInputId}
      LIMIT 1
    `;

    return rows[0] ? mapSignal(rows[0]) : null;
  }

  async listAll(): Promise<SignalSnapshot[]> {
    const rows = await this.prisma.$queryRaw<SignalRow[]>`
      SELECT * FROM "Signal"
      ORDER BY "updatedAt" DESC, "createdAt" DESC
    `;

    return rows.map((row) => mapSignal(row));
  }

  async save(signal: SignalSnapshot): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO "Signal" (
        "id", "signalInputId", "status", "sourceType", "confidenceScore", "setupQualityScore",
        "riskLabel", "publishRecommendation", "invalidationSummary", "setupRationale", "marketContext",
        "warnings", "confidenceBreakdown", "telegramDraft", "expertReviewNotes", "editedTelegramDraft",
        "publishedTelegramText", "publishedTelegramChatId", "publishedTelegramMessageId",
        "approvedBy", "approvedAt", "rejectedBy", "rejectedAt", "publishedBy", "publishedAt",
        "canceledAt", "metadata", "createdAt", "updatedAt"
      ) VALUES (
        ${signal.id}, ${signal.signalInputId}, ${signal.status}, ${signal.sourceType},
        ${signal.confidenceScore}, ${signal.setupQualityScore}, ${signal.riskLabel},
        ${signal.publishRecommendation}, ${signal.invalidationSummary}, ${signal.setupRationale},
        ${signal.marketContext}, ${jsonb(signal.warnings)}, ${jsonb(signal.confidenceBreakdown)},
        ${signal.telegramDraft}, ${signal.expertReviewNotes}, ${signal.editedTelegramDraft},
        ${signal.publishedTelegramText}, ${signal.publishedTelegramChatId}, ${signal.publishedTelegramMessageId},
        ${signal.approvedBy}, ${parseDate(signal.approvedAt)}, ${signal.rejectedBy}, ${parseDate(signal.rejectedAt)},
        ${signal.publishedBy}, ${parseDate(signal.publishedAt)}, ${parseDate(signal.canceledAt)},
        ${jsonb(signal.metadata)}, ${new Date(signal.createdAt)}, ${new Date(signal.updatedAt)}
      )
      ON CONFLICT ("id") DO UPDATE SET
        "signalInputId" = EXCLUDED."signalInputId",
        "status" = EXCLUDED."status",
        "sourceType" = EXCLUDED."sourceType",
        "confidenceScore" = EXCLUDED."confidenceScore",
        "setupQualityScore" = EXCLUDED."setupQualityScore",
        "riskLabel" = EXCLUDED."riskLabel",
        "publishRecommendation" = EXCLUDED."publishRecommendation",
        "invalidationSummary" = EXCLUDED."invalidationSummary",
        "setupRationale" = EXCLUDED."setupRationale",
        "marketContext" = EXCLUDED."marketContext",
        "warnings" = EXCLUDED."warnings",
        "confidenceBreakdown" = EXCLUDED."confidenceBreakdown",
        "telegramDraft" = EXCLUDED."telegramDraft",
        "expertReviewNotes" = EXCLUDED."expertReviewNotes",
        "editedTelegramDraft" = EXCLUDED."editedTelegramDraft",
        "publishedTelegramText" = EXCLUDED."publishedTelegramText",
        "publishedTelegramChatId" = EXCLUDED."publishedTelegramChatId",
        "publishedTelegramMessageId" = EXCLUDED."publishedTelegramMessageId",
        "approvedBy" = EXCLUDED."approvedBy",
        "approvedAt" = EXCLUDED."approvedAt",
        "rejectedBy" = EXCLUDED."rejectedBy",
        "rejectedAt" = EXCLUDED."rejectedAt",
        "publishedBy" = EXCLUDED."publishedBy",
        "publishedAt" = EXCLUDED."publishedAt",
        "canceledAt" = EXCLUDED."canceledAt",
        "metadata" = EXCLUDED."metadata",
        "createdAt" = EXCLUDED."createdAt",
        "updatedAt" = EXCLUDED."updatedAt"
    `;
  }
}

export class PrismaSignalInputRepository implements SignalInputRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<SignalInputSnapshot | null> {
    const rows = await this.prisma.$queryRaw<SignalInputRow[]>`
      SELECT * FROM "SignalInput"
      WHERE "id" = ${id}
      LIMIT 1
    `;

    return rows[0] ? mapSignalInput(rows[0]) : null;
  }

  async findBySourceEventId(
    sourceType: SignalInputSnapshot["sourceType"],
    sourceEventId: string
  ): Promise<SignalInputSnapshot | null> {
    const rows = await this.prisma.$queryRaw<SignalInputRow[]>`
      SELECT * FROM "SignalInput"
      WHERE "sourceType" = ${sourceType}
        AND "sourceEventId" = ${sourceEventId}
      LIMIT 1
    `;

    return rows[0] ? mapSignalInput(rows[0]) : null;
  }

  async listAll(): Promise<SignalInputSnapshot[]> {
    const rows = await this.prisma.$queryRaw<SignalInputRow[]>`
      SELECT * FROM "SignalInput"
      ORDER BY "updatedAt" DESC, "createdAt" DESC
    `;

    return rows.map((row) => mapSignalInput(row));
  }

  async save(input: SignalInputSnapshot): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO "SignalInput" (
        "id", "sourceType", "sourceProvider", "sourceEventId", "symbol", "timeframe", "direction",
        "entryZoneLow", "entryZoneHigh", "stopLoss", "takeProfit1", "takeProfit2", "takeProfit3",
        "marketPrice", "trendAlignment", "structureQuality", "volatilityQuality", "liquidityQuality",
        "riskRewardQuality", "conflictPenalty", "note", "strategyName", "detectedAt", "metadata",
        "createdAt", "updatedAt"
      ) VALUES (
        ${input.id}, ${input.sourceType}, ${input.sourceProvider}, ${input.sourceEventId}, ${input.symbol},
        ${input.timeframe}, ${input.direction}, ${input.entryZoneLow}, ${input.entryZoneHigh},
        ${input.stopLoss}, ${input.takeProfit1}, ${input.takeProfit2}, ${input.takeProfit3},
        ${input.marketPrice}, ${input.trendAlignment}, ${input.structureQuality}, ${input.volatilityQuality},
        ${input.liquidityQuality}, ${input.riskRewardQuality}, ${input.conflictPenalty}, ${input.note},
        ${input.strategyName}, ${parseDate(input.detectedAt)}, ${jsonb(input.metadata)},
        ${new Date(input.createdAt)}, ${new Date(input.updatedAt)}
      )
      ON CONFLICT ("id") DO UPDATE SET
        "sourceType" = EXCLUDED."sourceType",
        "sourceProvider" = EXCLUDED."sourceProvider",
        "sourceEventId" = EXCLUDED."sourceEventId",
        "symbol" = EXCLUDED."symbol",
        "timeframe" = EXCLUDED."timeframe",
        "direction" = EXCLUDED."direction",
        "entryZoneLow" = EXCLUDED."entryZoneLow",
        "entryZoneHigh" = EXCLUDED."entryZoneHigh",
        "stopLoss" = EXCLUDED."stopLoss",
        "takeProfit1" = EXCLUDED."takeProfit1",
        "takeProfit2" = EXCLUDED."takeProfit2",
        "takeProfit3" = EXCLUDED."takeProfit3",
        "marketPrice" = EXCLUDED."marketPrice",
        "trendAlignment" = EXCLUDED."trendAlignment",
        "structureQuality" = EXCLUDED."structureQuality",
        "volatilityQuality" = EXCLUDED."volatilityQuality",
        "liquidityQuality" = EXCLUDED."liquidityQuality",
        "riskRewardQuality" = EXCLUDED."riskRewardQuality",
        "conflictPenalty" = EXCLUDED."conflictPenalty",
        "note" = EXCLUDED."note",
        "strategyName" = EXCLUDED."strategyName",
        "detectedAt" = EXCLUDED."detectedAt",
        "metadata" = EXCLUDED."metadata",
        "createdAt" = EXCLUDED."createdAt",
        "updatedAt" = EXCLUDED."updatedAt"
    `;
  }
}

export class PrismaSignalReviewRepository implements SignalReviewRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listBySignalId(signalId: string): Promise<SignalReviewSnapshot[]> {
    const rows = await this.prisma.$queryRaw<SignalReviewRow[]>`
      SELECT * FROM "SignalReview"
      WHERE "signalId" = ${signalId}
      ORDER BY "createdAt" DESC
    `;

    return rows.map((row) => mapSignalReview(row));
  }

  async save(review: SignalReviewSnapshot): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO "SignalReview" (
        "id", "signalId", "reviewerId", "resultingStatus", "notes", "editedTelegramDraft", "createdAt"
      ) VALUES (
        ${review.id}, ${review.signalId}, ${review.reviewerId}, ${review.resultingStatus},
        ${review.notes}, ${review.editedTelegramDraft}, ${new Date(review.createdAt)}
      )
      ON CONFLICT ("id") DO UPDATE SET
        "signalId" = EXCLUDED."signalId",
        "reviewerId" = EXCLUDED."reviewerId",
        "resultingStatus" = EXCLUDED."resultingStatus",
        "notes" = EXCLUDED."notes",
        "editedTelegramDraft" = EXCLUDED."editedTelegramDraft",
        "createdAt" = EXCLUDED."createdAt"
    `;
  }
}

export class PrismaMarketInsightRepository implements MarketInsightRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<MarketInsightSnapshot | null> {
    const rows = await this.prisma.$queryRaw<MarketInsightRow[]>`
      SELECT * FROM "MarketInsight"
      WHERE "id" = ${id}
      LIMIT 1
    `;

    return rows[0] ? mapMarketInsight(rows[0]) : null;
  }

  async listAll(): Promise<MarketInsightSnapshot[]> {
    const rows = await this.prisma.$queryRaw<MarketInsightRow[]>`
      SELECT * FROM "MarketInsight"
      ORDER BY "updatedAt" DESC, "createdAt" DESC
    `;

    return rows.map((row) => mapMarketInsight(row));
  }

  async save(insight: MarketInsightSnapshot): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO "MarketInsight" (
        "id", "status", "symbol", "timeframe", "title", "summary", "body",
        "btcBias", "ethBias", "altcoinBias", "riskEnvironment", "executionPosture",
        "warnings", "telegramDraft", "approvedBy", "approvedAt", "publishedBy",
        "publishedAt", "rejectedBy", "rejectedAt", "canceledAt", "metadata",
        "createdAt", "updatedAt"
      ) VALUES (
        ${insight.id}, ${insight.status}, ${insight.symbol}, ${insight.timeframe},
        ${insight.title}, ${insight.summary}, ${insight.body}, ${insight.btcBias},
        ${insight.ethBias}, ${insight.altcoinBias}, ${insight.riskEnvironment},
        ${insight.executionPosture}, ${jsonb(insight.warnings)}, ${insight.telegramDraft},
        ${insight.approvedBy}, ${parseDate(insight.approvedAt)}, ${insight.publishedBy},
        ${parseDate(insight.publishedAt)}, ${insight.rejectedBy}, ${parseDate(insight.rejectedAt)},
        ${parseDate(insight.canceledAt)}, ${jsonb(insight.metadata)},
        ${new Date(insight.createdAt)}, ${new Date(insight.updatedAt)}
      )
      ON CONFLICT ("id") DO UPDATE SET
        "status" = EXCLUDED."status",
        "symbol" = EXCLUDED."symbol",
        "timeframe" = EXCLUDED."timeframe",
        "title" = EXCLUDED."title",
        "summary" = EXCLUDED."summary",
        "body" = EXCLUDED."body",
        "btcBias" = EXCLUDED."btcBias",
        "ethBias" = EXCLUDED."ethBias",
        "altcoinBias" = EXCLUDED."altcoinBias",
        "riskEnvironment" = EXCLUDED."riskEnvironment",
        "executionPosture" = EXCLUDED."executionPosture",
        "warnings" = EXCLUDED."warnings",
        "telegramDraft" = EXCLUDED."telegramDraft",
        "approvedBy" = EXCLUDED."approvedBy",
        "approvedAt" = EXCLUDED."approvedAt",
        "publishedBy" = EXCLUDED."publishedBy",
        "publishedAt" = EXCLUDED."publishedAt",
        "rejectedBy" = EXCLUDED."rejectedBy",
        "rejectedAt" = EXCLUDED."rejectedAt",
        "canceledAt" = EXCLUDED."canceledAt",
        "metadata" = EXCLUDED."metadata",
        "createdAt" = EXCLUDED."createdAt",
        "updatedAt" = EXCLUDED."updatedAt"
    `;
  }
}
