export default function SlideCard({ name, imgUrl }) {
  return (
    <figure className="relative min-w-full">
      <img
        src={imgUrl}
        alt={name}
        className="h-55 w-full object-cover sm:h-80 lg:h-95"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/15 to-transparent" />
      <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-slate-900 sm:bottom-6 sm:left-6 sm:text-base">
        {name}
      </figcaption>
      <a
        href="#card-layout"
        className="absolute bottom-4 right-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-400 sm:bottom-6 sm:right-6 sm:text-sm"
      >
        Go Shopping&#x27F6;
      </a>
    </figure>
  );
}
