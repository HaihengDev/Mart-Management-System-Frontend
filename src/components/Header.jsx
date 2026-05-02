import NavBar from './NavBar.jsx';
import Logo from '../assets/logo.png';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <img
          src={Logo}
          alt="logo"
          className="h-10 w-auto object-contain sm:h-11"
        />
        <div className="[&>nav]:flex [&>nav]:items-center [&>nav]:gap-2">
          <NavBar />
        </div>
      </div>
    </header>
  );
}
