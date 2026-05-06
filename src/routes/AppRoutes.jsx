import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { GuestRoute } from '../features/auth/components/GuestRoute';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { RoleRoute } from '../features/auth/components/RoleRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { CategoriesPage } from '../features/categories/pages/CategoriesPage';
import { CategoryProductsPage } from '../features/categories/pages/CategoryProductsPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { EmployeesPage } from '../features/employees/pages/EmployeesPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { ProductDetailPage } from '../features/products/pages/ProductDetailPage';
import { ProductsPage } from '../features/products/pages/ProductsPage';
import { SuppliersPage } from '../features/suppliers/pages/SuppliersPage';
import { SupplierProductsPage } from '../features/suppliers/pages/SupplierProductsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:categoryId/products" element={<CategoryProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/suppliers/:supplierId/products" element={<SupplierProductsPage />} />

          <Route element={<RoleRoute allow={['admin']} />}>
            <Route path="/employees" element={<EmployeesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
