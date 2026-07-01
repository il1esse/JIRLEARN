import { STATUSES } from "../../types";
import { useTaskStore } from "../../store/useTaskStore";

export function BacklogFilters() {
  const filters = useTaskStore((state) => state.filters);
  const setFilters = useTaskStore((state) => state.setFilters);
  const tags = useTaskStore((state) => state.tags);

  return (
    <div className="flex gap-3">
      <select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      >
        <option value="all">Tous les statuts</option>
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <select
        value={filters.tagId}
        onChange={(e) => setFilters({ tagId: e.target.value })}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      >
        <option value="all">Tous les tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
}
