import type { SourceStatus, DataType } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

const STATUS_CLASS: Record<SourceStatus, string> = {
  complete: "bg-c-success-soft text-c-success",
  blocked: "bg-c-warn-soft text-c-warn",
  planned: "bg-c-surface-2 text-c-text-muted",
  needs_research: "bg-c-warn-soft text-c-warn",
  new: "bg-c-info-soft text-c-info",
};

export function StatusBadge({ status, lang }: { status: SourceStatus; lang: Lang }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[status]}`}>
      {STRINGS.status[status][lang]}
    </span>
  );
}

export function DataTypePill({ type, lang }: { type: DataType; lang: Lang }) {
  return (
    <span className="inline-flex items-center rounded-md border border-c-border bg-c-surface px-1.5 py-0.5 text-[10px] font-medium text-c-text-muted">
      {STRINGS.dataType[type][lang]}
    </span>
  );
}
