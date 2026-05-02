import Card from './Card.jsx';
import useLoadProducts from '../Hooks/loadProducts.js';

export default function CardLayout() {
  const { items, isLoading, error } = useLoadProducts();

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
          Loading products...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Featured Products
        </h1>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {items.length} items
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item._id}
          name={item.product_name}
          imgUrl={item.product_image}
          price={item.price}
          discount={item.discount}
          stock={item.stock}
          views={item.views}
        />
      ))}
      </div>
    </section>
  );
}
