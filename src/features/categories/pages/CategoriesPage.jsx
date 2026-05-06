import { useEffect, useState } from "react";
import { categoryApi } from "../../../services/endpoints";
import { DataState } from "../../../components/ui/DataState";
import { PageCard } from "../../../components/ui/PageCard";

export function CategoriesPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await categoryApi.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await categoryApi.create({ category_name: name });
      setMessage("Category created successfully");
      setName("");
      setOpenCreate(false);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const onUpdate = async (id) => {
    if (!editName.trim()) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await categoryApi.update(id, { category_name: editName });
      setMessage("Category updated successfully");
      setEditId("");
      setEditName("");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    setError("");
    setMessage("");
    try {
      await categoryApi.remove(id);
      setMessage("Category deleted successfully");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-4">
      <PageCard
        title="Category Management"
        subtitle="Create, update, and delete categories"
      >
        <button
          onClick={() => setOpenCreate((prev) => !prev)}
          className="rounded-xl btn-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {openCreate ? "Close Create Form" : "Create Category"}
        </button>

        {openCreate ? (
          <form
            onSubmit={onCreate}
            className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <button
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              {saving ? "Creating..." : "Save"}
            </button>
          </form>
        ) : null}

        {message ? (
          <p className="mt-3 text-sm text-emerald-600">{message}</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </PageCard>

      <PageCard title="Categories" subtitle="GET /api/categories">
        <DataState loading={loading} error={error} empty={items.length === 0}>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.category_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    ID: {item.category_id}
                  </p>
                </div>
                {editId === item._id ? (
                  <div className="flex gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <button
                      onClick={() => onUpdate(item._id)}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditId("")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(item._id);
                        setEditName(item.category_name || "");
                      }}
                      className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DataState>
      </PageCard>
    </div>
  );
}
