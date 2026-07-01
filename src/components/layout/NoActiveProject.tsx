import { Link } from "react-router-dom";

export function NoActiveProject() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
      <p>Aucun projet sélectionné.</p>
      <Link to="/" className="mt-2 inline-block text-indigo-600 hover:underline">
        Choisir ou créer un projet
      </Link>
    </div>
  );
}
