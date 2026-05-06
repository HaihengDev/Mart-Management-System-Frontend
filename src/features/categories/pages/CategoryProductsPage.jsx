import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DataState } from '../../../components/ui/DataState';
import { PageCard } from '../../../components/ui/PageCard';
import { categoryApi, productApi } from '../../../services/endpoints';

export function CategoryProductsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [categoryRes, productRes] = await Promise.all([
          categoryApi.list(),
          productApi.list(),
        ]);
        const categories = Array.isArray(categoryRes?.data)
          ? categoryRes.data
          : [];
        const allProducts = Array.isArray(productRes?.data)
          ? productRes.data
          : [];

        const selectedCategory = categories.find(
          (item) => String(item.category_id) === String(categoryId),
        );
        setCategoryName(selectedCategory?.category_name || '');

        const filteredProducts = allProducts.filter(
          (product) => String(product.category_id) === String(categoryId),
        );
        setProducts(filteredProducts);
      } catch (err) {
        setError(
          err?.response?.data?.message || 'Failed to load category products',
        );
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) load();
  }, [categoryId]);

  const subtitle = useMemo(() => {
    if (!categoryId) return 'Products by selected category';
    if (categoryName) return `${categoryName} (ID: ${categoryId})`;
    return `Category ID: ${categoryId}`;
  }, [categoryId, categoryName]);

  return (
    <PageCard title="Category Products" subtitle={subtitle}>
      <button
        onClick={() => navigate('/categories')}
        className="mb-4 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
      >
        Back to Categories
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
