import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  categoryApi,
  productApi,
  supplierApi,
} from "../../../services/endpoints";
import { DataState } from "../../../components/ui/DataState";
import { PageCard } from "../../../components/ui/PageCard";

const defaultForm = {
  product_name: "",
  stock: "",
  discount: "",
  price: "",
  expiry_date: "",
  category_id: "",
  supplier_id: "",
};

export function ProductsPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState(defaultForm);
  const [editFile, setEditFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [productRes, categoryRes, supplierRes] = await Promise.all([
        productApi.list(),
        categoryApi.list(),
        supplierApi.list(),
      ]);

      const productsData = Array.isArray(productRes?.data)
        ? productRes.data
        : [];
      const categoriesData = Array.isArray(categoryRes?.data)
        ? categoryRes.data
        : [];
      const suppliersData = Array.isArray(supplierRes?.data)
        ? supplierRes.data
        : [];

      setProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);

      if (!form.category_id && categoriesData[0]?.category_id) {
        setForm((prev) => ({
          ...prev,
          category_id: String(categoriesData[0].category_id),
        }));
      }
      if (!form.supplier_id && suppliersData[0]?.supplier_id) {
        setForm((prev) => ({
          ...prev,
          supplier_id: String(suppliersData[0].supplier_id),
        }));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products");
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
      setError("Product image is required");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const data = new FormData();
    data.append("file", file);
    data.append("product_name", form.product_name);
    data.append("stock", form.stock);
    data.append("discount", form.discount || "0");
    data.append("price", form.price);
    data.append("expiry_date", form.expiry_date);
    data.append("category_id", form.category_id);
    data.append("supplier_id", form.supplier_id);

    try {
      const response = await productApi.create(data);
      setMessage(response?.data?.message || "Product created successfully");
      setOpenCreate(false);
      setForm((prev) => ({
        ...defaultForm,
        category_id: prev.category_id,
        supplier_id: prev.supplier_id,
      }));
      setFile(null);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const onUpdate = async (id) => {
    setSaving(true);
    setMessage("");
    setError("");
    const data = new FormData();
    data.append("product_name", editForm.product_name);
    data.append("stock", editForm.stock);
    data.append("discount", editForm.discount || "0");
    data.append("price", editForm.price);
    data.append("expiry_date", editForm.expiry_date);
    data.append("category_id", editForm.category_id);
    data.append("supplier_id", editForm.supplier_id);
    if (editFile) data.append("file", editFile);

    try {
      await productApi.update(id, data);
      setMessage("Product updated successfully");
      setEditId("");
      setEditFile(null);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (productId) => {
    setMessage("");
    setError("");
    try {
      await productApi.remove(productId);
      setMessage("Product deleted successfully");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-4">
      <PageCard
        title="Product Management"
        subtitle="Create, update, and delete products"
      >
        <button
          onClick={() => setOpenCreate((prev) => !prev)}
          className="rounded-xl btn-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {openCreate ? "Close Create Form" : "Create Product"}
        </button>
        {openCreate ? (
          <form onSubmit={onCreate} className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              name="product_name"
              value={form.product_name}
              onChange={onChange}
              placeholder="Product name"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              placeholder="Price"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={onChange}
              placeholder="Stock"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <input
              name="discount"
              type="number"
              value={form.discount}
              onChange={onChange}
              placeholder="Discount"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            />
            <input
              name="expiry_date"
              type="date"
              value={form.expiry_date}
              onChange={onChange}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            />
            <select
              name="category_id"
              value={form.category_id}
              onChange={onChange}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item._id} value={item.category_id}>
                  {item.category_name}
                </option>
              ))}
            </select>
            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={onChange}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              required
            >
              <option value="">Select supplier</option>
              {suppliers.map((item) => (
                <option key={item._id} value={item.supplier_id}>
                  {item.supplier_name}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
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

      <PageCard title="Products" subtitle="Click view for full product details">
        <DataState
          loading={loading}
          error={error}
          empty={products.length === 0}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="h-44 w-full object-cover"
                />
                <div className="space-y-2 p-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    {product.product_name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Price: {product.price}
                  </p>
                  <p className="text-sm text-slate-600">
                    Stock: {product.stock}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      View Full
                    </Link>
                    <button
                      onClick={() => {
                        setEditId(product._id);
                        setEditForm({
                          product_name: product.product_name || "",
                          stock: String(product.stock || ""),
                          discount: String(product.discount || ""),
                          price: String(product.price || ""),
                          expiry_date: (product.expiry_date || "").slice(0, 10),
                          category_id: String(product.category_id || ""),
                          supplier_id: String(product.supplier_id || ""),
                        });
                      }}
                      className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.product_id)}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                  {editId === product._id ? (
                    <div className="grid gap-2 border-t border-slate-200 pt-2">
                      <input
                        name="product_name"
                        value={editForm.product_name}
                        onChange={(e) => onChange(e, "edit")}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      />
                      <input
                        name="price"
                        type="number"
                        value={editForm.price}
                        onChange={(e) => onChange(e, "edit")}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      />
                      <input
                        name="stock"
                        type="number"
                        value={editForm.stock}
                        onChange={(e) => onChange(e, "edit")}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      />
                      <input
                        name="discount"
                        type="number"
                        value={editForm.discount}
                        onChange={(e) => onChange(e, "edit")}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      />
                      <input
                        name="expiry_date"
                        type="date"
                        value={editForm.expiry_date}
                        onChange={(e) => onChange(e, "edit")}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      />
                      <select
                        name="category_id"
                        value={editForm.category_id}
                        onChange={(e) => onChange(e, "edit")}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      >
                        {categories.map((item) => (
                          <option key={item._id} value={item.category_id}>
                            {item.category_name}
                          </option>
                        ))}
                      </select>
                      <select
                        name="supplier_id"
                        value={editForm.supplier_id}
                        onChange={(e) => onChange(e, "edit")}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      >
                        {suppliers.map((item) => (
                          <option key={item._id} value={item.supplier_id}>
                            {item.supplier_name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditFile(e.target.files?.[0] || null)
                        }
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => onUpdate(product._id)}
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
                </div>
              </article>
            ))}
          </div>
        </DataState>
      </PageCard>
    </div>
  );
}
