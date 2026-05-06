import { useEffect, useMemo, useState } from "react";
import { productApi } from "../../../services/endpoints";
import { useAuth } from "../../auth/components/AuthContext";

const EXPIRY_THRESHOLD_DAYS = 30;

function daysUntil(dateString) {
  if (!dateString) return null;
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const displayName = user?.employee_name || user?.username;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await productApi.list();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load expiry notifications",
        );
      }
    };

    loadProducts();
  }, []);

  const nearlyExpiredProducts = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        daysLeft: daysUntil(product.expiry_date),
      }))
      .filter(
        (product) =>
          product.daysLeft !== null &&
          product.daysLeft <= EXPIRY_THRESHOLD_DAYS,
      )
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [products]);

  const cards = [
    { label: "Access Level", value: user?.role || "-" },
    { label: "Protected Orders", value: "Enabled" },
    { label: "Employee Module", value: isAdmin ? "Available" : "Admin only" },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {displayName}
        </h2>
        <p className="text-sm text-slate-600">
          This dashboard is connected to your backend auth and role permissions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {card.value}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-lg font-semibold text-amber-900">
          Expiry Notifications
        </h3>
        <p className="text-sm text-amber-800">
          Products expiring within {EXPIRY_THRESHOLD_DAYS} days.
        </p>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

        {!error && nearlyExpiredProducts.length === 0 ? (
          <p className="mt-3 text-sm text-amber-800">
            No products near expiry.
          </p>
        ) : null}

        <div className="mt-3 space-y-2">
          {nearlyExpiredProducts.map((product) => (
            <article
              key={product._id}
              className="rounded-xl border border-amber-300 bg-white p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">
                  {product.product_name}
                </p>
                <p
                  className={`text-xs font-semibold ${product.daysLeft <= 0 ? "text-rose-600" : "text-amber-500"}`}
                >
                  {product.daysLeft <= 0
                    ? `Expired ${Math.abs(product.daysLeft)} day(s) ago`
                    : `${product.daysLeft} day(s) left`}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Product ID: {product.product_id} | Stock: {product.stock}
              </p>
              <p className="text-xs text-slate-600">
                Expiry Date: {String(product.expiry_date).slice(0, 10)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
