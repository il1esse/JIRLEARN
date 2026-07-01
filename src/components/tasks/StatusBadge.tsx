import type { Status } from "../../types";
import { STATUSES } from "../../types";

const STYLES: Record<Status, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  obsolete: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: Status }) {
  const label = STATUSES.find((s) => s.value === status)?.label ?? status;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {label}
    </span>
  );
}
