import { useEffect, useMemo, useState } from 'react';
import { orderApi, productApi } from '../../../services/endpoints';
import { DataState } from '../../../components/ui/DataState';
import { PageCard } from '../../../components/ui/PageCard';
import { getToken } from '../../../utils/storage';

const createOrderItem = (productId, discount = 0) => ({
  product_id: String(productId),
  quantity: 1,
  discount: Number(discount || 0),
});

function getEmployeeIdFromToken() {
  try {
    const token = getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.id ? String(payload.id) : '';
  } catch {
    return '';
  }
}

export function OrdersPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [employeeId, setEmployeeId] = useState(getEmployeeIdFromToken());
  const [status, setStatus] = useState('Cash');
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(String(p.product_id), p));
    return map;
  }, [products]);

  const orderPreview = useMemo(() => {
    const lines = items.map((item) => {
      const product = productMap.get(String(item.product_id));
      const price = Number(product?.price || 0);
      const quantity = Number(item.quantity || 0);
      const discount = Number(item.discount || 0);
      const lineTotal = price * quantity * (1 - discount / 100);
      return {
        ...item,
        product,
        price,
        quantity,
        discount,
        lineTotal,
      };
    });
    const grandTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    return { lines, grandTotal };
  }, [items, productMap]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, productsRes] = await Promise.all([
        orderApi.list(),
        productApi.list(),
      ]);
      setOrders(Array.isArray(ordersRes?.data) ? ordersRes.data : []);
      setProducts(Array.isArray(productsRes?.data) ? productsRes.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load order data');
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

  const addProductToOrder = (product) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => String(item.product_id) === String(product.product_id),
      );
      if (existingIndex >= 0) {
        return prev.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item,
        );
      }
      return [...prev, createOrderItem(product.product_id, product.discount)];
    });
  };

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const onCreateOrder = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

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
      setMessage(res?.data?.message || 'Order created successfully');
      setOpenCreate(false);
      setItems([]);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.result ||
          err?.response?.data?.message ||
          'Failed to create order',
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
          {openCreate ? 'Close Create Form' : 'Create Order'}
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

            <div className="grid gap-3 lg:grid-cols-2">
              <section className="panel-glass rounded-xl p-3">
                <p className="text-main mb-2 text-sm font-semibold">
                  All Products
                </p>
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-2"
                    >
                      <div>
                        <p className="text-main text-sm font-medium">
                          {product.product_name}
                        </p>
                        <p className="text-soft text-xs">
                          Stock: {product.stock} | Price: {product.price}$
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addProductToOrder(product)}
                        className="rounded-lg btn-primary px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel-glass rounded-xl p-3">
                <p className="text-main mb-2 text-sm font-semibold">
                  Order Items
                </p>
                <div className="space-y-2">
                  {orderPreview.lines.map((item, index) => {
                    const selectedProduct = item.product;
                    return (
                      <div
                        key={`${item.product_id}-${index}`}
                        className="grid gap-2 rounded-lg border border-slate-200 p-2 sm:grid-cols-[2fr_1fr_1fr_auto]"
                      >
                        <div>
                          <p className="text-main text-sm font-medium">
                            {selectedProduct?.product_name || 'Unknown product'}
                          </p>
                          <p className="text-soft text-xs">
                            Unit price: {selectedProduct?.price ?? 0}
                          </p>
                          <p className="text-soft text-xs">
                            Line total: {item.lineTotal.toFixed(2)}
                          </p>
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, 'quantity', e.target.value)
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
                            updateItem(index, 'discount', e.target.value)
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
                      </div>
                    );
                  })}
                  {items.length === 0 ? (
                    <p className="text-soft text-xs">
                      No products added yet. Click `Add` from the product list.
                    </p>
                  ) : null}
                  {items.length > 0 ? (
                    <div className="mt-2 rounded-lg border border-slate-200 p-2">
                      <p className="text-main text-sm font-semibold">
                        Grand Total: {orderPreview.grandTotal.toFixed(2)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>

            <div className="flex gap-2">
              <button
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
              >
                {saving ? 'Creating...' : 'Submit Order'}
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
                    {order.status} | Total: {order.grand_total.toFixed(2) || 0}$
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
                          <td className="py-1 pr-3">{item.price}$</td>
                          <td className="py-1 pr-3">{item.discount}%</td>
                          <td className="py-1 pr-3">
                            {item.total.toFixed(2) || 0}$
                          </td>
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
