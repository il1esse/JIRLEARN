import { useState } from "react";
import { Modal } from "../layout/Modal";
import { StatusSelect } from "./StatusSelect";
import { TagPicker } from "./TagPicker";
import { SubtaskList } from "./SubtaskList";
import { useTaskStore } from "../../store/useTaskStore";
import { useTaskProgress } from "../../hooks/useTaskProgress";
import type { Task } from "../../types";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const tags = useTaskStore((state) => state.tags);
  const updateTask = useTaskStore((state) => state.updateTask);
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);
  const addTagToTask = useTaskStore((state) => state.addTagToTask);
  const removeTagFromTask = useTaskStore((state) => state.removeTagFromTask);
  const addSubtask = useTaskStore((state) => state.addSubtask);
  const updateSubtaskStatus = useTaskStore((state) => state.updateSubtaskStatus);
  const deleteSubtask = useTaskStore((state) => state.deleteSubtask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const progress = useTaskProgress(task);

  const handleBlurSave = () => {
    if (title.trim() && (title !== task.title || description !== task.description)) {
      updateTask(task.id, { title: title.trim(), description });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer cette tâche et ses sous-tâches ?")) return;
    await deleteTask(task.id);
    onClose();
  };

  return (
    <Modal title="Détail de la tâche" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlurSave}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleBlurSave}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Statut</label>
          <StatusSelect value={task.status} onChange={(status) => setTaskStatus(task.id, status)} />
          {task.subtasks.length > 0 && (
            <span className="text-xs text-gray-500">Sous-tâches : {progress.ratioLabel} terminées</span>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
          <TagPicker
            allTags={tags}
            selectedTagIds={task.tagIds}
            onAdd={(name) => addTagToTask(task.id, name)}
            onRemove={(tagId) => removeTagFromTask(task.id, tagId)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sous-tâches</label>
          <SubtaskList
            subtasks={task.subtasks}
            onAdd={(subtaskTitle) => addSubtask(task.id, subtaskTitle)}
            onStatusChange={(subtaskId, status) => updateSubtaskStatus(task.id, subtaskId, status)}
            onDelete={(subtaskId) => deleteSubtask(task.id, subtaskId)}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Supprimer la tâche
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}
