export function DataState({ loading, error, empty, children }) {
  if (loading) {
    return <p className="text-soft text-sm">Loading...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-400">{error}</p>;
  }

  if (empty) {
    return <p className="text-soft text-sm">No data found.</p>;
  }

  return children;
}
