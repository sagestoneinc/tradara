import { AppwriteException, Databases, Query } from "node-appwrite";
import type {
  MarketInsightSnapshot,
  SignalInputSnapshot,
  SignalReviewSnapshot,
  SignalSnapshot
} from "@tradara/shared-types";

import type {
  MarketInsightRepository,
  SignalInputRepository,
  SignalRepository,
  SignalReviewRepository
} from "./types";

const SIGNAL_COLLECTIONS = {
  signal_inputs: "signal_inputs",
  signals: "signals",
  signal_reviews: "signal_reviews",
  market_insights: "market_insights"
} as const;

function isConflict(error: unknown): boolean {
  return error instanceof AppwriteException && error.code === 409;
}

function isNotFound(error: unknown): boolean {
  return error instanceof AppwriteException && error.code === 404;
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // ignore
    }
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function parseStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      // ignore
    }
  }
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function parseConfidenceBreakdown(value: unknown): SignalSnapshot["confidenceBreakdown"] {
  const obj = parseJsonObject(value);
  const readNumber = (key: keyof SignalSnapshot["confidenceBreakdown"]): number => {
    const candidate = obj[key];
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

function docToSignalInput(doc: Record<string, unknown>): SignalInputSnapshot {
  return {
    id: doc.$id as string,
    sourceType: doc.sourceType as SignalInputSnapshot["sourceType"],
    sourceProvider: (doc.sourceProvider as SignalInputSnapshot["sourceProvider"]) ?? null,
    sourceEventId: (doc.sourceEventId as string | null) ?? null,
    symbol: doc.symbol as string,
    timeframe: (doc.timeframe as string | null) ?? null,
    direction: (doc.direction as SignalInputSnapshot["direction"]) ?? null,
    entryZoneLow: (doc.entryZoneLow as number | null) ?? null,
    entryZoneHigh: (doc.entryZoneHigh as number | null) ?? null,
    stopLoss: (doc.stopLoss as number | null) ?? null,
    takeProfit1: (doc.takeProfit1 as number | null) ?? null,
    takeProfit2: (doc.takeProfit2 as number | null) ?? null,
    takeProfit3: (doc.takeProfit3 as number | null) ?? null,
    marketPrice: (doc.marketPrice as number | null) ?? null,
    trendAlignment: (doc.trendAlignment as number | null) ?? null,
    structureQuality: (doc.structureQuality as number | null) ?? null,
    volatilityQuality: (doc.volatilityQuality as number | null) ?? null,
    liquidityQuality: (doc.liquidityQuality as number | null) ?? null,
    riskRewardQuality: (doc.riskRewardQuality as number | null) ?? null,
    conflictPenalty: (doc.conflictPenalty as number | null) ?? null,
    note: (doc.note as string | null) ?? null,
    strategyName: (doc.strategyName as string | null) ?? null,
    detectedAt: (doc.detectedAt as string | null) ?? null,
    metadata: parseJsonObject(doc.metadata),
    createdAt: (doc.createdAt as string) ?? (doc.$createdAt as string),
    updatedAt: (doc.updatedAt as string) ?? (doc.$updatedAt as string)
  };
}

function signalInputToDoc(input: SignalInputSnapshot): Record<string, unknown> {
  return {
    sourceType: input.sourceType,
    sourceProvider: input.sourceProvider ?? null,
    sourceEventId: input.sourceEventId ?? null,
    symbol: input.symbol,
    timeframe: input.timeframe ?? null,
    direction: input.direction ?? null,
    entryZoneLow: input.entryZoneLow ?? null,
    entryZoneHigh: input.entryZoneHigh ?? null,
    stopLoss: input.stopLoss ?? null,
    takeProfit1: input.takeProfit1 ?? null,
    takeProfit2: input.takeProfit2 ?? null,
    takeProfit3: input.takeProfit3 ?? null,
    marketPrice: input.marketPrice ?? null,
    trendAlignment: input.trendAlignment ?? null,
    structureQuality: input.structureQuality ?? null,
    volatilityQuality: input.volatilityQuality ?? null,
    liquidityQuality: input.liquidityQuality ?? null,
    riskRewardQuality: input.riskRewardQuality ?? null,
    conflictPenalty: input.conflictPenalty ?? null,
    note: input.note ?? null,
    strategyName: input.strategyName ?? null,
    detectedAt: input.detectedAt ?? null,
    metadata: JSON.stringify(input.metadata),
    createdAt: input.createdAt,
    updatedAt: input.updatedAt
  };
}

export class AppwriteSignalInputRepository implements SignalInputRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async findById(id: string): Promise<SignalInputSnapshot | null> {
    try {
      const doc = await this.db.getDocument(this.databaseId, SIGNAL_COLLECTIONS.signal_inputs, id);
      return docToSignalInput(doc as unknown as Record<string, unknown>);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async findBySourceEventId(
    sourceType: SignalInputSnapshot["sourceType"],
    sourceEventId: string
  ): Promise<SignalInputSnapshot | null> {
    const result = await this.db.listDocuments(
      this.databaseId,
      SIGNAL_COLLECTIONS.signal_inputs,
      [
        Query.equal("sourceType", sourceType),
        Query.equal("sourceEventId", sourceEventId),
        Query.orderDesc("$createdAt"),
        Query.limit(1)
      ]
    );

    if (result.documents.length === 0) return null;
    return docToSignalInput(result.documents[0] as unknown as Record<string, unknown>);
  }

  async listAll(): Promise<SignalInputSnapshot[]> {
    const result = await this.db.listDocuments(
      this.databaseId,
      SIGNAL_COLLECTIONS.signal_inputs,
      [Query.orderDesc("$updatedAt")]
    );
    return result.documents.map((doc) => docToSignalInput(doc as unknown as Record<string, unknown>));
  }

  async save(input: SignalInputSnapshot): Promise<void> {
    const data = signalInputToDoc(input);
    try {
      await this.db.createDocument(
        this.databaseId,
        SIGNAL_COLLECTIONS.signal_inputs,
        input.id,
        data
      );
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(
          this.databaseId,
          SIGNAL_COLLECTIONS.signal_inputs,
          input.id,
          data
        );
        return;
      }
      throw error;
    }
  }
}

function docToSignal(doc: Record<string, unknown>): SignalSnapshot {
  return {
    id: doc.$id as string,
    signalInputId: doc.signalInputId as string,
    status: doc.status as SignalSnapshot["status"],
    sourceType: doc.sourceType as SignalSnapshot["sourceType"],
    confidenceScore: (doc.confidenceScore as number | null) ?? null,
    setupQualityScore: (doc.setupQualityScore as number | null) ?? null,
    riskLabel: (doc.riskLabel as SignalSnapshot["riskLabel"]) ?? null,
    publishRecommendation:
      (doc.publishRecommendation as SignalSnapshot["publishRecommendation"]) ?? null,
    invalidationSummary: (doc.invalidationSummary as string | null) ?? null,
    setupRationale: (doc.setupRationale as string | null) ?? null,
    marketContext: (doc.marketContext as string | null) ?? null,
    warnings: parseStringArray(doc.warnings),
    confidenceBreakdown: parseConfidenceBreakdown(doc.confidenceBreakdown),
    telegramDraft: (doc.telegramDraft as string | null) ?? null,
    expertReviewNotes: (doc.expertReviewNotes as string | null) ?? null,
    editedTelegramDraft: (doc.editedTelegramDraft as string | null) ?? null,
    publishedTelegramText: (doc.publishedTelegramText as string | null) ?? null,
    publishedTelegramChatId: (doc.publishedTelegramChatId as string | null) ?? null,
    publishedTelegramMessageId: (doc.publishedTelegramMessageId as string | null) ?? null,
    approvedBy: (doc.approvedBy as string | null) ?? null,
    approvedAt: (doc.approvedAt as string | null) ?? null,
    rejectedBy: (doc.rejectedBy as string | null) ?? null,
    rejectedAt: (doc.rejectedAt as string | null) ?? null,
    publishedBy: (doc.publishedBy as string | null) ?? null,
    publishedAt: (doc.publishedAt as string | null) ?? null,
    canceledAt: (doc.canceledAt as string | null) ?? null,
    metadata: parseJsonObject(doc.metadata),
    createdAt: (doc.createdAt as string) ?? (doc.$createdAt as string),
    updatedAt: (doc.updatedAt as string) ?? (doc.$updatedAt as string)
  };
}

function signalToDoc(signal: SignalSnapshot): Record<string, unknown> {
  return {
    signalInputId: signal.signalInputId,
    status: signal.status,
    sourceType: signal.sourceType,
    confidenceScore: signal.confidenceScore ?? null,
    setupQualityScore: signal.setupQualityScore ?? null,
    riskLabel: signal.riskLabel ?? null,
    publishRecommendation: signal.publishRecommendation ?? null,
    invalidationSummary: signal.invalidationSummary ?? null,
    setupRationale: signal.setupRationale ?? null,
    marketContext: signal.marketContext ?? null,
    warnings: JSON.stringify(signal.warnings),
    confidenceBreakdown: JSON.stringify(signal.confidenceBreakdown),
    telegramDraft: signal.telegramDraft ?? null,
    expertReviewNotes: signal.expertReviewNotes ?? null,
    editedTelegramDraft: signal.editedTelegramDraft ?? null,
    publishedTelegramText: signal.publishedTelegramText ?? null,
    publishedTelegramChatId: signal.publishedTelegramChatId ?? null,
    publishedTelegramMessageId: signal.publishedTelegramMessageId ?? null,
    approvedBy: signal.approvedBy ?? null,
    approvedAt: signal.approvedAt ?? null,
    rejectedBy: signal.rejectedBy ?? null,
    rejectedAt: signal.rejectedAt ?? null,
    publishedBy: signal.publishedBy ?? null,
    publishedAt: signal.publishedAt ?? null,
    canceledAt: signal.canceledAt ?? null,
    metadata: JSON.stringify(signal.metadata),
    createdAt: signal.createdAt,
    updatedAt: signal.updatedAt
  };
}

export class AppwriteSignalRepository implements SignalRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async findById(id: string): Promise<SignalSnapshot | null> {
    try {
      const doc = await this.db.getDocument(this.databaseId, SIGNAL_COLLECTIONS.signals, id);
      return docToSignal(doc as unknown as Record<string, unknown>);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async findBySignalInputId(signalInputId: string): Promise<SignalSnapshot | null> {
    const result = await this.db.listDocuments(this.databaseId, SIGNAL_COLLECTIONS.signals, [
      Query.equal("signalInputId", signalInputId),
      Query.limit(1)
    ]);

    if (result.documents.length === 0) return null;
    return docToSignal(result.documents[0] as unknown as Record<string, unknown>);
  }

  async listAll(): Promise<SignalSnapshot[]> {
    const result = await this.db.listDocuments(this.databaseId, SIGNAL_COLLECTIONS.signals, [
      Query.orderDesc("$updatedAt")
    ]);
    return result.documents.map((doc) => docToSignal(doc as unknown as Record<string, unknown>));
  }

  async save(signal: SignalSnapshot): Promise<void> {
    const data = signalToDoc(signal);
    try {
      await this.db.createDocument(
        this.databaseId,
        SIGNAL_COLLECTIONS.signals,
        signal.id,
        data
      );
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(
          this.databaseId,
          SIGNAL_COLLECTIONS.signals,
          signal.id,
          data
        );
        return;
      }
      throw error;
    }
  }
}

function docToSignalReview(doc: Record<string, unknown>): SignalReviewSnapshot {
  return {
    id: doc.$id as string,
    signalId: doc.signalId as string,
    reviewerId: doc.reviewerId as string,
    resultingStatus: doc.resultingStatus as SignalReviewSnapshot["resultingStatus"],
    notes: (doc.notes as string | null) ?? null,
    editedTelegramDraft: (doc.editedTelegramDraft as string | null) ?? null,
    createdAt: (doc.createdAt as string) ?? (doc.$createdAt as string)
  };
}

export class AppwriteSignalReviewRepository implements SignalReviewRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async listBySignalId(signalId: string): Promise<SignalReviewSnapshot[]> {
    const result = await this.db.listDocuments(this.databaseId, SIGNAL_COLLECTIONS.signal_reviews, [
      Query.equal("signalId", signalId),
      Query.orderDesc("$createdAt")
    ]);
    return result.documents.map((doc) =>
      docToSignalReview(doc as unknown as Record<string, unknown>)
    );
  }

  async save(review: SignalReviewSnapshot): Promise<void> {
    const data: Record<string, unknown> = {
      signalId: review.signalId,
      reviewerId: review.reviewerId,
      resultingStatus: review.resultingStatus,
      notes: review.notes ?? null,
      editedTelegramDraft: review.editedTelegramDraft ?? null,
      createdAt: review.createdAt
    };
    try {
      await this.db.createDocument(
        this.databaseId,
        SIGNAL_COLLECTIONS.signal_reviews,
        review.id,
        data
      );
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(
          this.databaseId,
          SIGNAL_COLLECTIONS.signal_reviews,
          review.id,
          data
        );
        return;
      }
      throw error;
    }
  }
}

function docToMarketInsight(doc: Record<string, unknown>): MarketInsightSnapshot {
  return {
    id: doc.$id as string,
    status: doc.status as MarketInsightSnapshot["status"],
    symbol: doc.symbol as string,
    timeframe: (doc.timeframe as string | null) ?? null,
    title: doc.title as string,
    summary: doc.summary as string,
    body: doc.body as string,
    btcBias: doc.btcBias as MarketInsightSnapshot["btcBias"],
    ethBias: doc.ethBias as MarketInsightSnapshot["ethBias"],
    altcoinBias: doc.altcoinBias as MarketInsightSnapshot["altcoinBias"],
    riskEnvironment: doc.riskEnvironment as MarketInsightSnapshot["riskEnvironment"],
    executionPosture: doc.executionPosture as MarketInsightSnapshot["executionPosture"],
    warnings: parseStringArray(doc.warnings),
    telegramDraft: (doc.telegramDraft as string | null) ?? null,
    approvedBy: (doc.approvedBy as string | null) ?? null,
    approvedAt: (doc.approvedAt as string | null) ?? null,
    publishedBy: (doc.publishedBy as string | null) ?? null,
    publishedAt: (doc.publishedAt as string | null) ?? null,
    rejectedBy: (doc.rejectedBy as string | null) ?? null,
    rejectedAt: (doc.rejectedAt as string | null) ?? null,
    canceledAt: (doc.canceledAt as string | null) ?? null,
    metadata: parseJsonObject(doc.metadata),
    createdAt: (doc.createdAt as string) ?? (doc.$createdAt as string),
    updatedAt: (doc.updatedAt as string) ?? (doc.$updatedAt as string)
  };
}

function marketInsightToDoc(insight: MarketInsightSnapshot): Record<string, unknown> {
  return {
    status: insight.status,
    symbol: insight.symbol,
    timeframe: insight.timeframe ?? null,
    title: insight.title,
    summary: insight.summary,
    body: insight.body,
    btcBias: insight.btcBias,
    ethBias: insight.ethBias,
    altcoinBias: insight.altcoinBias,
    riskEnvironment: insight.riskEnvironment,
    executionPosture: insight.executionPosture,
    warnings: JSON.stringify(insight.warnings),
    telegramDraft: insight.telegramDraft ?? null,
    approvedBy: insight.approvedBy ?? null,
    approvedAt: insight.approvedAt ?? null,
    publishedBy: insight.publishedBy ?? null,
    publishedAt: insight.publishedAt ?? null,
    rejectedBy: insight.rejectedBy ?? null,
    rejectedAt: insight.rejectedAt ?? null,
    canceledAt: insight.canceledAt ?? null,
    metadata: JSON.stringify(insight.metadata),
    createdAt: insight.createdAt,
    updatedAt: insight.updatedAt
  };
}

export class AppwriteMarketInsightRepository implements MarketInsightRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async findById(id: string): Promise<MarketInsightSnapshot | null> {
    try {
      const doc = await this.db.getDocument(
        this.databaseId,
        SIGNAL_COLLECTIONS.market_insights,
        id
      );
      return docToMarketInsight(doc as unknown as Record<string, unknown>);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async listAll(): Promise<MarketInsightSnapshot[]> {
    const result = await this.db.listDocuments(
      this.databaseId,
      SIGNAL_COLLECTIONS.market_insights,
      [Query.orderDesc("$updatedAt")]
    );
    return result.documents.map((doc) =>
      docToMarketInsight(doc as unknown as Record<string, unknown>)
    );
  }

  async save(insight: MarketInsightSnapshot): Promise<void> {
    const data = marketInsightToDoc(insight);
    try {
      await this.db.createDocument(
        this.databaseId,
        SIGNAL_COLLECTIONS.market_insights,
        insight.id,
        data
      );
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(
          this.databaseId,
          SIGNAL_COLLECTIONS.market_insights,
          insight.id,
          data
        );
        return;
      }
      throw error;
    }
  }
}
