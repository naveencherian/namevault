"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-sm text-red-600 hover:text-red-800"
      onClick={(e) => {
        if (!confirm("Delete this domain?")) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
