import type { ReconciliationAction } from "@tradara/shared-types";

import type { ChannelAccessReconciliationService } from "../modules/channel-access/reconciliation.service";

export class ChannelAccessReconciliationJob {
  constructor(private readonly reconciliationService: ChannelAccessReconciliationService) {}

  async runOnce(reason: string): Promise<ReconciliationAction[]> {
    return this.reconciliationService.run(reason);
  }
}
