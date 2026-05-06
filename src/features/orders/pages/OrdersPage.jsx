import { useEffect, useMemo, useState } from "react";
import { orderApi, productApi } from "../../../services/endpoints";
import { DataState } from "../../../components/ui/DataState";
import { PageCard } from "../../../components/ui/PageCard";
import { getToken } from "../../../utils/storage";

const createEmptyItem = () => ({ product_id: "", quantity: 1, discount: 0 });

function getEmployeeIdFromToken() {
  try {
    const token = getToken();
    if (!token) return "";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id ? String(payload.id) : "";
  } catch {
    return "";
  }
}

export function OrdersPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [employeeId, setEmployeeId] = useState(getEmployeeIdFromToken());
  const [status, setStatus] = useState("Cash");
  const [items, setItems] = useState([createEmptyItem()]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(String(p.product_id), p));
    return map;
  }, [products]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, productsRes] = await Promise.all([
        orderApi.list(),
        productApi.list(),
      ]);
      setOrders(Array.isArray(ordersRes?.data) ? ordersRes.data : []);
      setProducts(Array.isArray(productsRes?.data) ? productsRes.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load order data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateItem = (index, key, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };

  const onProductChange = (index, productId) => {
    const selectedProduct = productMap.get(String(productId));
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              product_id: productId,
              discount: selectedProduct?.discount ?? 0,
            }
          : item,
      ),
    );
  };

  const addItem = () => setItems((prev) => [...prev, createEmptyItem()]);
  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const onCreateOrder = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      employee_id: Number(employeeId),
      status,
      items: items
        .filter((x) => x.product_id && Number(x.quantity) > 0)
        .map((x) => ({
          product_id: Number(x.product_id),
          quantity: Number(x.quantity),
          discount: Number(x.discount || 0),
        })),
    };

    try {
      const res = await orderApi.create(payload);
      setMessage(res?.data?.message || "Order created successfully");
      setOpenCreate(false);
      setItems([createEmptyItem()]);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.result ||
          err?.response?.data?.message ||
          "Failed to create order",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageCard
        title="Order Management"
        subtitle="Create new order and track all orders"
      >
        <button
          onClick={() => setOpenCreate((prev) => !prev)}
          className="rounded-xl btn-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {openCreate ? "Close Create Form" : "Create Order"}
        </button>

        {openCreate ? (
          <form onSubmit={onCreateOrder} className="mt-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Employee ID"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                required
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              >
                <option value="Cash">Cash</option>
                <option value="QR">QR</option>
              </select>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => {
                const selectedProduct = productMap.get(String(item.product_id));
                return (
                  <div
                    key={index}
                    className="panel-glass grid gap-2 rounded-xl p-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
                  >
                    <select
                      value={item.product_id}
                      onChange={(e) => onProductChange(index, e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p.product_id}>
                          {p.product_name} (Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                      placeholder="Qty"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) =>
                        updateItem(index, "discount", e.target.value)
                      }
                      placeholder="Discount %"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Remove
                    </button>
                    {selectedProduct ? (
                      <p className="text-soft text-xs sm:col-span-4">
                        Unit price: {selectedProduct.price}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={addItem}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                Add Item
              </button>
              <button
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
              >
                {saving ? "Creating..." : "Submit Order"}
              </button>
            </div>
          </form>
        ) : null}

        {message ? (
          <p className="mt-3 text-sm text-emerald-600">{message}</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </PageCard>

      <PageCard title="Orders" subtitle="Protected API for admin and employee">
        <DataState loading={loading} error={error} empty={orders.length === 0}>
          <div className="space-y-3">
            {orders.map((order) => (
              <article key={order._id} className="panel-glass rounded-xl p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-main font-semibold">
                    Order #{order.order_id || order._id}
                  </p>
                  <p className="text-soft text-xs">
                    {order.status} | Total: {order.grand_total || 0}
                  </p>
                </div>
                <p className="text-soft mt-1 text-xs">
                  Employee ID: {order.employee_id}
                </p>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full text-left text-xs">
                    <thead>
                      <tr className="text-soft">
                        <th className="py-1 pr-3">Product</th>
                        <th className="py-1 pr-3">Qty</th>
                        <th className="py-1 pr-3">Price</th>
                        <th className="py-1 pr-3">Discount</th>
                        <th className="py-1 pr-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, idx) => (
                        <tr key={idx} className="text-main">
                          <td className="py-1 pr-3">{item.product_name}</td>
                          <td className="py-1 pr-3">{item.quantity}</td>
                          <td className="py-1 pr-3">{item.price}</td>
                          <td className="py-1 pr-3">{item.discount}%</td>
                          <td className="py-1 pr-3">{item.total || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        </DataState>
      </PageCard>
    </div>
  );
}
