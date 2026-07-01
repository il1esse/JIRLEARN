import { useState } from "react";
import type { Tag } from "../../types";

interface TagPickerProps {
  allTags: Tag[];
  selectedTagIds: string[];
  onAdd: (tagName: string) => void;
  onRemove: (tagId: string) => void;
}

export function TagPicker({ allTags, selectedTagIds, onAdd, onRemove }: TagPickerProps) {
  const [input, setInput] = useState("");
  const selectedTags = allTags.filter((tag) => selectedTagIds.includes(tag.id));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput("");
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => onRemove(tag.id)}
              className="text-white/80 hover:text-white"
              aria-label={`Retirer le tag ${tag.name}`}
            >
              ×
            </button>
          </span>
        ))}
        {selectedTags.length === 0 && <span className="text-xs text-gray-400">Aucun tag</span>}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ajouter un tag (créé si inexistant)"
          list="existing-tags"
          className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
        <datalist id="existing-tags">
          {allTags.map((tag) => (
            <option key={tag.id} value={tag.name} />
          ))}
        </datalist>
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
