import type * as React from "react";
import type { SignalSnapshot } from "@tradara/shared-types";
import { Button } from "@tradara/ui";

import { submitSignalReviewAction } from "../app/signals/actions";

export function SignalReviewActions({
  signal
}: {
  signal: SignalSnapshot;
}): React.JSX.Element {
  return (
    <form action={submitSignalReviewAction} className="space-y-3 rounded-2xl border border-slate-800 p-4">
      <input type="hidden" name="signalId" value={signal.id} />
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Review notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={signal.expertReviewNotes ?? ""}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
          placeholder="Add review context for this setup"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Edited Telegram draft</label>
        <textarea
          name="editedTelegramDraft"
          rows={5}
          defaultValue={signal.editedTelegramDraft ?? signal.telegramDraft ?? ""}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
          placeholder="Optional edited publish draft"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" type="submit" name="reviewAction" value="approve">
          Approve
        </Button>
        <Button size="sm" variant="secondary" type="submit" name="reviewAction" value="edit">
          Save Edit
        </Button>
        <Button size="sm" variant="secondary" type="submit" name="reviewAction" value="watchlist">
          Move to Watchlist
        </Button>
        <Button size="sm" variant="secondary" type="submit" name="reviewAction" value="reject">
          Reject
        </Button>
        <Button size="sm" variant="secondary" type="submit" name="reviewAction" value="cancel">
          Cancel
        </Button>
      </div>
    </form>
  );
}
