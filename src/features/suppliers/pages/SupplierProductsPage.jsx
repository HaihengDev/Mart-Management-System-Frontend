import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DataState } from '../../../components/ui/DataState';
import { PageCard } from '../../../components/ui/PageCard';
import { productApi, supplierApi } from '../../../services/endpoints';

export function SupplierProductsPage() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [supplierRes, productRes] = await Promise.all([
          supplierApi.list(),
          productApi.list(),
        ]);
        const suppliers = Array.isArray(supplierRes?.data)
          ? supplierRes.data
          : [];
        const allProducts = Array.isArray(productRes?.data)
          ? productRes.data
          : [];

        const selectedSupplier = suppliers.find(
          (item) => String(item.supplier_id) === String(supplierId),
        );
        setSupplierName(selectedSupplier?.supplier_name || '');

        const filteredProducts = allProducts.filter(
          (product) => String(product.supplier_id) === String(supplierId),
        );
        setProducts(filteredProducts);
      } catch (err) {
        setError(
          err?.response?.data?.message || 'Failed to load supplier products',
        );
      } finally {
        setLoading(false);
      }
    };

    if (supplierId) load();
  }, [supplierId]);

  const subtitle = useMemo(() => {
    if (!supplierId) return 'Products by selected supplier';
    if (supplierName) return `${supplierName} (ID: ${supplierId})`;
    return `Supplier ID: ${supplierId}`;
  }, [supplierId, supplierName]);

  return (
    <PageCard title="Supplier Products" subtitle={subtitle}>
      <button
        onClick={() => navigate('/suppliers')}
        className="mb-4 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
      >
        Back to Suppliers
      </button>

      <DataState loading={loading} error={error} empty={products.length === 0}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <img
                src={product.product_image}
                alt={product.product_name}
                className="h-40 w-full object-cover"
              />
              <div className="space-y-1 p-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {product.product_name}
                </h3>
                <p className="text-xs text-slate-600">
                  Price: {product.price}$
                </p>
                <p className="text-xs text-slate-600">Stock: {product.stock}</p>
                <Link
                  to={`/products/${product._id}`}
                  className="mt-1 inline-block rounded-lg btn-primary px-3 py-1.5 text-xs font-semibold text-white"
                >
                  View Product
                </Link>
              </div>
            </article>
          ))}
        </div>
      </DataState>
    </PageCard>
  );
}
