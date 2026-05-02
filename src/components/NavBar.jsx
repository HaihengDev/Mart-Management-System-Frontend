import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const baseStyle =
    'px-4 py-2 rounded-lg transition-colors duration-200 font-medium';

  const activeStyle = 'bg-blue-600 text-white';
  const inActiveStyle = 'text-gray-700 hover:bg-gray-200';

  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inActiveStyle}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inActiveStyle}`
        }
      >
        Categories
      </NavLink>
    </nav>
  );
}
