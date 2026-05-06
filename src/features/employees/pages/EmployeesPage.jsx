import { useEffect, useState } from "react";
import { employeeApi } from "../../../services/endpoints";
import { DataState } from "../../../components/ui/DataState";
import { PageCard } from "../../../components/ui/PageCard";
import { ConfirmPanel } from "../../../components/ui/ConfirmPanel";

const defaultForm = {
  employee_name: "",
  gender: "Male",
  position: "employee",
  salary: "",
};

export function EmployeesPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState(defaultForm);
  const [editFile, setEditFile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [oneTimeCredential, setOneTimeCredential] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await employeeApi.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (event, target = "create") => {
    const { name, value } = event.target;
    if (target === "create") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onCreate = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Employee image is required");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    setOneTimeCredential(null);

    const data = new FormData();
    data.append("file", file);
    data.append("employee_name", form.employee_name);
    data.append("gender", form.gender);
    data.append("position", form.position);
    data.append("salary", form.salary);

    try {
      const response = await employeeApi.create(data);
      setMessage(response?.data?.message || "Employee created successfully");
      setOneTimeCredential(response?.data?.user || null);
      setForm(defaultForm);
      setFile(null);
      setOpenCreate(false);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create employee");
    } finally {
      setSaving(false);
    }
  };

  const onUpdate = async (id) => {
    setSaving(true);
    setMessage("");
    setError("");
    const data = new FormData();
    data.append("employee_name", editForm.employee_name);
    data.append("gender", editForm.gender);
    data.append("position", editForm.position);
    data.append("salary", editForm.salary);
    if (editFile) data.append("file", editFile);

    try {
      await employeeApi.update(id, data);
      setMessage("Employee updated successfully");
      setEditId("");
      setEditFile(null);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    setMessage("");
    setError("");
    try {
      await employeeApi.remove(id);
      setMessage("Employee deleted successfully");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete employee");
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
        title="Employee Management"
        subtitle="Create, update, and delete employees"
      >
        <button
          onClick={() => setOpenCreate((prev) => !prev)}
          className="rounded-xl btn-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {openCreate ? "Close Create Form" : "Add Employee"}
        </button>

        {openCreate ? (
          <form onSubmit={onCreate} className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              name="employee_name"
              value={form.employee_name}
              onChange={onChange}
              placeholder="Employee name"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={onChange}
              placeholder="Salary"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <select
              name="gender"
              value={form.gender}
              onChange={onChange}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              name="position"
              value={form.position}
              onChange={onChange}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm sm:col-span-2"
              required
            />
            <button
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        ) : null}

        {message ? (
          <p className="mt-3 text-sm text-emerald-600">{message}</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </PageCard>

      {oneTimeCredential ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">New employee login (shown once)</p>
          <p>Username: {oneTimeCredential.username}</p>
          <p>Plain password: {oneTimeCredential.password}</p>
          <div className="mt-3">
            <button
              onClick={() => setOneTimeCredential(null)}
              className="rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white"
            >
              I saved it
            </button>
          </div>
        </div>
      ) : null}

      <PageCard title="Employees" subtitle="List with employee image">
        <DataState loading={loading} error={error} empty={items.length === 0}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((employee) => (
              <article
                key={employee._id}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <img
                  src={employee.employee_image}
                  alt={employee.employee_name}
                  className="h-44 w-full rounded-lg object-cover"
                />
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {employee.employee_name}
                </h3>
                <p className="text-sm text-slate-600">
                  Role: {employee.position}
                </p>
                <p className="text-sm text-slate-600">
                  Gender: {employee.gender}
                </p>
                <p className="text-sm text-slate-600">
                  Salary: {employee.salary}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(employee._id);
                      setEditForm({
                        employee_name: employee.employee_name || "",
                        gender: employee.gender || "Male",
                        position: employee.position || "employee",
                        salary: String(employee.salary || ""),
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
                        id: employee._id,
                        title: "Delete employee?",
                        message: `This action will permanently remove "${employee.employee_name}".`,
                        confirmLabel: "Yes, delete",
                        tone: "danger",
                      })
                    }
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
                {editId === employee._id ? (
                  <div className="mt-2 grid gap-2 border-t border-slate-200 pt-2">
                    <input
                      name="employee_name"
                      value={editForm.employee_name}
                      onChange={(e) => onChange(e, "edit")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <input
                      name="salary"
                      type="number"
                      value={editForm.salary}
                      onChange={(e) => onChange(e, "edit")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={(e) => onChange(e, "edit")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <select
                      name="position"
                      value={editForm.position}
                      onChange={(e) => onChange(e, "edit")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "update",
                            id: employee._id,
                            title: "Update employee?",
                            message: `This will save changes for "${employee.employee_name}".`,
                            confirmLabel: "Yes, update",
                            tone: "warning",
                          })
                        }
                        className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setEditId("");
                          setEditFile(null);
                        }}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
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
