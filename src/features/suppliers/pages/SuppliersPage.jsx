import { useEffect, useState } from "react";
import { supplierApi } from "../../../services/endpoints";
import { DataState } from "../../../components/ui/DataState";
import { PageCard } from "../../../components/ui/PageCard";
import { ConfirmPanel } from "../../../components/ui/ConfirmPanel";

const defaultForm = {
  supplier_name: "",
  phone: "",
  email: "",
  address: "",
};

export function SuppliersPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState(defaultForm);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await supplierApi.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (event, target = "form") => {
    const { name, value } = event.target;
    if (target === "form") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await supplierApi.create(form);
      setMessage("Supplier created successfully");
      setForm(defaultForm);
      setOpenCreate(false);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create supplier");
    } finally {
      setSaving(false);
    }
  };

  const onUpdate = async (id) => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await supplierApi.update(id, editForm);
      setMessage("Supplier updated successfully");
      setEditId("");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update supplier");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    setMessage("");
    setError("");
    try {
      await supplierApi.remove(id);
      setMessage("Supplier deleted successfully");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete supplier");
    }
  };

  const closeConfirm = () => setConfirmAction(null);

  const onConfirmAction = async () => {
    if (!confirmAction) return;
    const action = confirmAction;
    closeConfirm();
    if (action.type === "update") {
      await onUpdate(action.id);
      return;
    }
    await onDelete(action.id);
  };

  return (
    <div className="space-y-4">
      <PageCard
        title="Supplier Management"
        subtitle="Create, update, and delete suppliers"
      >
        <button
          onClick={() => setOpenCreate((prev) => !prev)}
          className="rounded-xl btn-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {openCreate ? "Close Create Form" : "Create Supplier"}
        </button>

        {openCreate ? (
          <form onSubmit={onCreate} className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              name="supplier_name"
              value={form.supplier_name}
              onChange={onChange}
              placeholder="Supplier name"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Phone"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="Address"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <button
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2"
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

      <PageCard title="Suppliers" subtitle="GET /api/suppliers">
        <DataState loading={loading} error={error} empty={items.length === 0}>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-slate-200 p-3"
              >
                {editId === item._id ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      name="supplier_name"
                      value={editForm.supplier_name}
                      onChange={(e) => onChange(e, "edit")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <input
                      name="phone"
                      value={editForm.phone}
                      onChange={(e) => onChange(e, "edit")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <input
                      name="email"
                      value={editForm.email}
                      onChange={(e) => onChange(e, "edit")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <input
                      name="address"
                      value={editForm.address}
                      onChange={(e) => onChange(e, "edit")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <div className="flex gap-2 sm:col-span-2">
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "update",
                            id: item._id,
                            title: "Update supplier?",
                            message: `This will save changes for "${item.supplier_name}".`,
                            confirmLabel: "Yes, update",
                            tone: "warning",
                          })
                        }
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
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.supplier_name}
                      </p>
                      <p className="text-xs text-slate-600">
                        {item.phone} | {item.email}
                      </p>
                      <p className="text-xs text-slate-500">{item.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditId(item._id);
                          setEditForm({
                            supplier_name: item.supplier_name || "",
                            phone: item.phone || "",
                            email: item.email || "",
                            address: item.address || "",
                          });
                        }}
                        className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "delete",
                            id: item._id,
                            title: "Delete supplier?",
                            message: `This action will permanently remove "${item.supplier_name}".`,
                            confirmLabel: "Yes, delete",
                            tone: "danger",
                          })
                        }
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DataState>
      </PageCard>
      <ConfirmPanel
        open={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmLabel={confirmAction?.confirmLabel}
        tone={confirmAction?.tone}
        onCancel={closeConfirm}
        onConfirm={onConfirmAction}
      />
    </div>
  );
}
