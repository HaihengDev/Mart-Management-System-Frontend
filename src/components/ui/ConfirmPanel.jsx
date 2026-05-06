export function ConfirmPanel({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  tone = "danger",
  onConfirm,
  onCancel,
  disabled = false,
}) {
  if (!open) return null;

  const confirmClass =
    tone === "danger"
      ? "bg-rose-600 hover:bg-rose-500"
      : "bg-amber-600 hover:bg-amber-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="panel-glass w-full max-w-md rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-main">{title}</h3>
        <p className="mt-2 text-sm text-soft">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition ${confirmClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
