export default function Card({ name, imgUrl, price, stock, discount, views }) {
  const newPrice = price - (price * discount) / 100;
  const hasDiscount = discount > 0;

  return (
    <figure className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={imgUrl}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {hasDiscount ? (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
            -{discount}%
          </span>
        ) : null}
      </div>

      <figcaption className="space-y-4 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <h3 className="line-clamp-2 min-h-12 text-base font-semibold text-slate-900">
          {name}
        </h3>

        <section className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <p className="font-medium text-slate-600">Stock</p>
          <p className="font-semibold text-slate-900">{stock}</p>
        </section>

        <section className="text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-eye"></i>
            <span>{views} views</span>
          </p>
        </section>

        {hasDiscount ? (
          <section className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Price</p>
            <div className="flex items-baseline gap-2">
              <p className="text-sm text-slate-400 line-through">
                ${price.toFixed(2)}
              </p>
              <p className="text-xl font-bold text-rose-600">
                ${newPrice.toFixed(2)}
              </p>
            </div>
          </section>
        ) : (
          <section className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Price</p>
            <p className="text-xl font-bold text-slate-900">
              ${price.toFixed(2)}
            </p>
          </section>
        )}

        <button className="mt-1 w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400">
          View
        </button>
      </figcaption>
    </figure>
  );
}
