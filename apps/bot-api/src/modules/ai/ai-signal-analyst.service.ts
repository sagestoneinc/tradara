import type { CreateSignalInputRequest, SignalAiEnrichment } from "@tradara/shared-types";

import { normalizeSignalAnalysis } from "./ai-output-normalizer";

export class AiSignalAnalystService {
  async analyze(input: CreateSignalInputRequest): Promise<SignalAiEnrichment> {
    return normalizeSignalAnalysis(input);
  }
}
