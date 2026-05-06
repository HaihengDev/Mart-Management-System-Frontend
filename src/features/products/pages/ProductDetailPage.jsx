import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataState } from '../../../components/ui/DataState';
import { PageCard } from '../../../components/ui/PageCard';
import { productApi } from '../../../services/endpoints';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await productApi.detail(id);
        setProduct(data?.data || null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  return (
    <PageCard title="Product Detail" subtitle="GET /api/products/:id">
      <button onClick={() => navigate('/products')} className="mb-4 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
        Back to Products
      </button>

      <DataState loading={loading} error={error} empty={!product}>
        <div className="grid gap-4 lg:grid-cols-2">
          <img src={product?.product_image} alt={product?.product_name} className="w-full rounded-xl border border-slate-200 object-cover" />
          <div className="space-y-2 text-sm text-slate-700">
            <p><span className="font-semibold text-slate-900">Name:</span> {product?.product_name}</p>
            <p><span className="font-semibold text-slate-900">Product ID:</span> {product?.product_id}</p>
            <p><span className="font-semibold text-slate-900">Category:</span> {product?.category_name} ({product?.category_id})</p>
            <p><span className="font-semibold text-slate-900">Supplier:</span> {product?.supplier_name} ({product?.supplier_id})</p>
            <p><span className="font-semibold text-slate-900">Price:</span> {product?.price}</p>
            <p><span className="font-semibold text-slate-900">Discount:</span> {product?.discount}</p>
            <p><span className="font-semibold text-slate-900">Stock:</span> {product?.stock}</p>
            <p><span className="font-semibold text-slate-900">Views:</span> {product?.views}</p>
            <p><span className="font-semibold text-slate-900">Rating:</span> {product?.rating}</p>
            <p><span className="font-semibold text-slate-900">Expiry Date:</span> {product?.expiry_date}</p>
          </div>
        </div>
      </DataState>
    </PageCard>
  );
}
