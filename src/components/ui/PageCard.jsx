export function PageCard({ title, subtitle, children }) {
  return (
    <section className="panel-glass rounded-2xl p-5">
      <div className="mb-4">
        <h2 className="text-main text-xl font-semibold">{title}</h2>
        {subtitle ? <p className="text-soft text-sm">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
