import type { Status } from "../../types";
import { STATUSES } from "../../types";

interface StatusSelectProps {
  value: Status;
  onChange: (status: Status) => void;
  className?: string;
}

export function StatusSelect({ value, onChange, className }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Status)}
      className={`rounded-md border border-gray-300 px-2 py-1 text-sm ${className ?? ""}`}
    >
      {STATUSES.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
