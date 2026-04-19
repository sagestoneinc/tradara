import type {
  MarketInsightSnapshot,
  ProviderName,
  SignalInputSnapshot,
  SignalReviewSnapshot,
  SignalSnapshot
} from "@tradara/shared-types";
import type {
  MarketInsight,
  Prisma,
  PrismaClient,
  Signal,
  SignalInput,
  SignalReview,
  WebhookProvider
} from "@prisma/client";

import type {
  MarketInsightRepository,
  SignalInputRepository,
  SignalRepository,
  SignalReviewRepository
} from "./types";

function formatDate(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function parseDate(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null;
}

function parseJsonObject(
  value: Prisma.JsonValue | Prisma.InputJsonValue | null | undefined
): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function parseStringArray(
  value: Prisma.JsonValue | Prisma.InputJsonValue | null | undefined
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function parseConfidenceBreakdown(
  value: Prisma.JsonValue | Prisma.InputJsonValue | null | undefined
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

function webhookProviderOrNull(value: ProviderName | null | undefined): WebhookProvider | null {
  return (value ?? null) as WebhookProvider | null;
}

function signalInputUpsertData(
  input: SignalInputSnapshot
): Prisma.SignalInputUncheckedCreateInput {
  return {
    id: input.id,
    sourceType: input.sourceType,
    sourceProvider: webhookProviderOrNull(input.sourceProvider),
    sourceEventId: input.sourceEventId,
    symbol: input.symbol,
    timeframe: input.timeframe,
    direction: input.direction,
    entryZoneLow: input.entryZoneLow,
    entryZoneHigh: input.entryZoneHigh,
    stopLoss: input.stopLoss,
    takeProfit1: input.takeProfit1,
    takeProfit2: input.takeProfit2,
    takeProfit3: input.takeProfit3,
    marketPrice: input.marketPrice,
    trendAlignment: input.trendAlignment,
    structureQuality: input.structureQuality,
    volatilityQuality: input.volatilityQuality,
    liquidityQuality: input.liquidityQuality,
    riskRewardQuality: input.riskRewardQuality,
    conflictPenalty: input.conflictPenalty,
    note: input.note,
    strategyName: input.strategyName,
    detectedAt: parseDate(input.detectedAt),
    metadata: input.metadata as Prisma.InputJsonValue,
    createdAt: new Date(input.createdAt),
    updatedAt: new Date(input.updatedAt)
  };
}

function signalUpsertData(signal: SignalSnapshot): Prisma.SignalUncheckedCreateInput {
  return {
    id: signal.id,
    signalInputId: signal.signalInputId,
    status: signal.status,
    sourceType: signal.sourceType,
    confidenceScore: signal.confidenceScore,
    setupQualityScore: signal.setupQualityScore,
    riskLabel: signal.riskLabel,
    publishRecommendation: signal.publishRecommendation,
    invalidationSummary: signal.invalidationSummary,
    setupRationale: signal.setupRationale,
    marketContext: signal.marketContext,
    warnings: signal.warnings as Prisma.InputJsonValue,
    confidenceBreakdown: signal.confidenceBreakdown as Prisma.InputJsonValue,
    telegramDraft: signal.telegramDraft,
    expertReviewNotes: signal.expertReviewNotes,
    editedTelegramDraft: signal.editedTelegramDraft,
    publishedTelegramText: signal.publishedTelegramText,
    publishedTelegramChatId: signal.publishedTelegramChatId,
    publishedTelegramMessageId: signal.publishedTelegramMessageId,
    approvedBy: signal.approvedBy,
    approvedAt: parseDate(signal.approvedAt),
    rejectedBy: signal.rejectedBy,
    rejectedAt: parseDate(signal.rejectedAt),
    publishedBy: signal.publishedBy,
    publishedAt: parseDate(signal.publishedAt),
    canceledAt: parseDate(signal.canceledAt),
    metadata: signal.metadata as Prisma.InputJsonValue,
    createdAt: new Date(signal.createdAt),
    updatedAt: new Date(signal.updatedAt)
  };
}

function signalReviewUpsertData(
  review: SignalReviewSnapshot
): Prisma.SignalReviewUncheckedCreateInput {
  return {
    id: review.id,
    signalId: review.signalId,
    reviewerId: review.reviewerId,
    resultingStatus: review.resultingStatus,
    notes: review.notes,
    editedTelegramDraft: review.editedTelegramDraft,
    createdAt: new Date(review.createdAt)
  };
}

function marketInsightUpsertData(
  insight: MarketInsightSnapshot
): Prisma.MarketInsightUncheckedCreateInput {
  return {
    id: insight.id,
    status: insight.status,
    symbol: insight.symbol,
    timeframe: insight.timeframe,
    title: insight.title,
    summary: insight.summary,
    body: insight.body,
    btcBias: insight.btcBias,
    ethBias: insight.ethBias,
    altcoinBias: insight.altcoinBias,
    riskEnvironment: insight.riskEnvironment,
    executionPosture: insight.executionPosture,
    warnings: insight.warnings as Prisma.InputJsonValue,
    telegramDraft: insight.telegramDraft,
    approvedBy: insight.approvedBy,
    approvedAt: parseDate(insight.approvedAt),
    publishedBy: insight.publishedBy,
    publishedAt: parseDate(insight.publishedAt),
    rejectedBy: insight.rejectedBy,
    rejectedAt: parseDate(insight.rejectedAt),
    canceledAt: parseDate(insight.canceledAt),
    metadata: insight.metadata as Prisma.InputJsonValue,
    createdAt: new Date(insight.createdAt),
    updatedAt: new Date(insight.updatedAt)
  };
}

function mapSignalInput(record: SignalInput): SignalInputSnapshot {
  return {
    id: record.id,
    sourceType: record.sourceType,
    sourceProvider: (record.sourceProvider as ProviderName | null) ?? null,
    sourceEventId: record.sourceEventId,
    symbol: record.symbol,
    timeframe: record.timeframe,
    direction: record.direction,
    entryZoneLow: record.entryZoneLow?.toNumber() ?? null,
    entryZoneHigh: record.entryZoneHigh?.toNumber() ?? null,
    stopLoss: record.stopLoss?.toNumber() ?? null,
    takeProfit1: record.takeProfit1?.toNumber() ?? null,
    takeProfit2: record.takeProfit2?.toNumber() ?? null,
    takeProfit3: record.takeProfit3?.toNumber() ?? null,
    marketPrice: record.marketPrice?.toNumber() ?? null,
    trendAlignment: record.trendAlignment,
    structureQuality: record.structureQuality,
    volatilityQuality: record.volatilityQuality,
    liquidityQuality: record.liquidityQuality,
    riskRewardQuality: record.riskRewardQuality,
    conflictPenalty: record.conflictPenalty,
    note: record.note,
    strategyName: record.strategyName,
    detectedAt: formatDate(record.detectedAt),
    metadata: parseJsonObject(record.metadata),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

function mapSignal(record: Signal): SignalSnapshot {
  return {
    id: record.id,
    signalInputId: record.signalInputId,
    status: record.status,
    sourceType: record.sourceType,
    confidenceScore: record.confidenceScore,
    setupQualityScore: record.setupQualityScore,
    riskLabel: record.riskLabel,
    publishRecommendation: record.publishRecommendation,
    invalidationSummary: record.invalidationSummary,
    setupRationale: record.setupRationale,
    marketContext: record.marketContext,
    warnings: parseStringArray(record.warnings),
    confidenceBreakdown: parseConfidenceBreakdown(record.confidenceBreakdown),
    telegramDraft: record.telegramDraft,
    expertReviewNotes: record.expertReviewNotes,
    editedTelegramDraft: record.editedTelegramDraft,
    publishedTelegramText: record.publishedTelegramText,
    publishedTelegramChatId: record.publishedTelegramChatId,
    publishedTelegramMessageId: record.publishedTelegramMessageId,
    approvedBy: record.approvedBy,
    approvedAt: formatDate(record.approvedAt),
    rejectedBy: record.rejectedBy,
    rejectedAt: formatDate(record.rejectedAt),
    publishedBy: record.publishedBy,
    publishedAt: formatDate(record.publishedAt),
    canceledAt: formatDate(record.canceledAt),
    metadata: parseJsonObject(record.metadata),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

function mapSignalReview(record: SignalReview): SignalReviewSnapshot {
  return {
    id: record.id,
    signalId: record.signalId,
    reviewerId: record.reviewerId,
    resultingStatus: record.resultingStatus,
    notes: record.notes,
    editedTelegramDraft: record.editedTelegramDraft,
    createdAt: record.createdAt.toISOString()
  };
}

function mapMarketInsight(record: MarketInsight): MarketInsightSnapshot {
  return {
    id: record.id,
    status: record.status,
    symbol: record.symbol,
    timeframe: record.timeframe,
    title: record.title,
    summary: record.summary,
    body: record.body,
    btcBias: record.btcBias,
    ethBias: record.ethBias,
    altcoinBias: record.altcoinBias,
    riskEnvironment: record.riskEnvironment,
    executionPosture: record.executionPosture,
    warnings: parseStringArray(record.warnings),
    telegramDraft: record.telegramDraft,
    approvedBy: record.approvedBy,
    approvedAt: formatDate(record.approvedAt),
    publishedBy: record.publishedBy,
    publishedAt: formatDate(record.publishedAt),
    rejectedBy: record.rejectedBy,
    rejectedAt: formatDate(record.rejectedAt),
    canceledAt: formatDate(record.canceledAt),
    metadata: parseJsonObject(record.metadata),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

export class PrismaSignalRepository implements SignalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<SignalSnapshot | null> {
    const record = await this.prisma.signal.findUnique({ where: { id } });
    return record ? mapSignal(record) : null;
  }

  async findBySignalInputId(signalInputId: string): Promise<SignalSnapshot | null> {
    const record = await this.prisma.signal.findUnique({ where: { signalInputId } });
    return record ? mapSignal(record) : null;
  }

  async listAll(): Promise<SignalSnapshot[]> {
    const records = await this.prisma.signal.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return records.map((record) => mapSignal(record));
  }

  async save(signal: SignalSnapshot): Promise<void> {
    const data = signalUpsertData(signal);

    await this.prisma.signal.upsert({
      where: { id: signal.id },
      create: data,
      update: data
    });
  }
}

export class PrismaSignalInputRepository implements SignalInputRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<SignalInputSnapshot | null> {
    const record = await this.prisma.signalInput.findUnique({ where: { id } });
    return record ? mapSignalInput(record) : null;
  }

  async findBySourceEventId(
    sourceType: SignalInputSnapshot["sourceType"],
    sourceEventId: string
  ): Promise<SignalInputSnapshot | null> {
    const record = await this.prisma.signalInput.findFirst({
      where: {
        sourceType,
        sourceEventId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return record ? mapSignalInput(record) : null;
  }

  async listAll(): Promise<SignalInputSnapshot[]> {
    const records = await this.prisma.signalInput.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return records.map((record) => mapSignalInput(record));
  }

  async save(input: SignalInputSnapshot): Promise<void> {
    const data = signalInputUpsertData(input);

    await this.prisma.signalInput.upsert({
      where: { id: input.id },
      create: data,
      update: data
    });
  }
}

export class PrismaSignalReviewRepository implements SignalReviewRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listBySignalId(signalId: string): Promise<SignalReviewSnapshot[]> {
    const records = await this.prisma.signalReview.findMany({
      where: { signalId },
      orderBy: { createdAt: "desc" }
    });

    return records.map((record) => mapSignalReview(record));
  }

  async save(review: SignalReviewSnapshot): Promise<void> {
    const data = signalReviewUpsertData(review);

    await this.prisma.signalReview.upsert({
      where: { id: review.id },
      create: data,
      update: data
    });
  }
}

export class PrismaMarketInsightRepository implements MarketInsightRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<MarketInsightSnapshot | null> {
    const record = await this.prisma.marketInsight.findUnique({ where: { id } });
    return record ? mapMarketInsight(record) : null;
  }

  async listAll(): Promise<MarketInsightSnapshot[]> {
    const records = await this.prisma.marketInsight.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return records.map((record) => mapMarketInsight(record));
  }

  async save(insight: MarketInsightSnapshot): Promise<void> {
    const data = marketInsightUpsertData(insight);

    await this.prisma.marketInsight.upsert({
      where: { id: insight.id },
      create: data,
      update: data
    });
  }
}
