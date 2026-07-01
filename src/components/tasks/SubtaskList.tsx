import { useState } from "react";
import type { Subtask, Status } from "../../types";
import { StatusSelect } from "./StatusSelect";

interface SubtaskListProps {
  subtasks: Subtask[];
  onAdd: (title: string) => void;
  onStatusChange: (subtaskId: string, status: Status) => void;
  onDelete: (subtaskId: string) => void;
}

export function SubtaskList({ subtasks, onAdd, onStatusChange, onDelete }: SubtaskListProps) {
  const [title, setTitle] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <div className="flex flex-col gap-2">
      {subtasks.length === 0 && <p className="text-xs text-gray-400">Aucune sous-tâche.</p>}
      <ul className="flex flex-col gap-1">
        {subtasks.map((subtask) => (
          <li
            key={subtask.id}
            className="flex items-center justify-between rounded-md border border-gray-200 px-2 py-1"
          >
            <span className="text-sm text-gray-800">{subtask.title}</span>
            <div className="flex items-center gap-2">
              <StatusSelect
                value={subtask.status}
                onChange={(status) => onStatusChange(subtask.id, status)}
              />
              <button
                type="button"
                onClick={() => onDelete(subtask.id)}
                className="text-xs text-gray-400 hover:text-red-600"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nouvelle sous-tâche"
          className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
