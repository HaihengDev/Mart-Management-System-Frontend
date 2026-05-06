import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/components/AuthContext";
import { useTheme } from "../../app/ThemeContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/orders", label: "Orders" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/employees", label: "Employees", adminOnly: true },
];

export function AppLayout() {
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const displayName = user?.employee_name || user?.username;

  return (
    <div className="min-h-screen text-main">
      <header className="app-glass sticky top-0 z-20 border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-main text-lg font-bold tracking-tight uppercase">
            Mart Management
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn-glass rounded-lg px-2 py-1 text-lg font-semibold transition"
            >
              {theme === "dark" ? (
                <i class="fa-solid fa-moon"></i>
              ) : (
                <i class="fa-solid fa-sun"></i>
              )}
            </button>
            <div className="text-right">
              <p className="text-main text-sm font-semibold">{displayName}</p>
              <p className="text-soft text-xs uppercase tracking-wide">
                {user?.role}
              </p>
            </div>
            <button
              onClick={logout}
              className="btn-primary rounded-lg px-3 py-2 text-sm font-medium transition hover:brightness-110"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="panel-glass rounded-2xl p-3">
          <nav className="space-y-2">
            {navItems
              .filter((item) => (item.adminOnly ? isAdmin : true))
              .map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active ? "btn-primary text-white" : "btn-glass text-main"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
