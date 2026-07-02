import { useEffect, useState } from "react";
import type { ProjectMember } from "../../types";
import * as projectService from "../../services/projectService";
import { useAuthStore } from "../../store/useAuthStore";

export function ProjectMembers({ projectId }: { projectId: string }) {
  const currentUser = useAuthStore((state) => state.user);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    const data = await projectService.getMembers(projectId);
    setMembers(data);
  };

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  const isOwner = members.some((m) => m.userId === currentUser?.id && m.role === "OWNER");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    try {
      await projectService.inviteMember(projectId, trimmed);
      setEmail("");
      await loadMembers();
    } catch {
      setError("Aucun compte trouvé avec cet email, ou déjà membre du projet.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Retirer ce membre du projet ?")) return;
    await projectService.removeMember(projectId, userId);
    await loadMembers();
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-gray-900">Membres du projet</h2>
      <ul className="mt-3 divide-y divide-gray-100">
        {members.map((member) => (
          <li key={member.userId} className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-700">
              {member.user.name} <span className="text-gray-400">({member.user.email})</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase text-gray-400">{member.role}</span>
              {isOwner && member.role !== "OWNER" && (
                <button
                  type="button"
                  onClick={() => handleRemove(member.userId)}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Retirer
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {isOwner && (
        <form onSubmit={handleInvite} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email à inviter"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Inviter
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
