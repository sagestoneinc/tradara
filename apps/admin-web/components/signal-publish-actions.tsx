import type * as React from "react";
import type { SignalSnapshot } from "@tradara/shared-types";
import { Button } from "@tradara/ui";

import { publishApprovedSignalAction } from "../app/signals/actions";

export function SignalPublishActions({
  signal
}: {
  signal: SignalSnapshot;
}): React.JSX.Element {
  return (
    <form action={publishApprovedSignalAction} className="rounded-2xl border border-slate-800 p-4">
      <input type="hidden" name="signalId" value={signal.id} />
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-400">
          This will send the approved Tradara signal to the premium Telegram channel and persist the publish metadata.
        </p>
        <Button size="sm" type="submit">
          Publish to Telegram
        </Button>
      </div>
    </form>
  );
}
